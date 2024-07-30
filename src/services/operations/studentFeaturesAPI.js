import { apiConnector } from "../apiConnector";
import { paymentEndpoints } from "../apis";
import toast from "react-hot-toast";
import rzpLogo from "../../assets/logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCSESS_EMAIL } =
  paymentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

//buy course
export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading..");
  try {
    //load the script
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("RazorPay SDK failed to load");
    }

    //initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    console.log("PRINTING orderResponse", orderResponse);

    //options create
    const options = {
      key: "rzp_test_qouJKUZdInhII3",
      amount: orderResponse.data.paymentResponse.amount,
      currency: orderResponse.data.currency,
      name: "StudyNotion",
      description: "Thank you for your purchase",
      image: rzpLogo,
      order_id: orderResponse.data.paymentResponse.id,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: function (response) {
        //send successfull payment mail
        console.log("payment response", response);
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.paymentResponse.amount,
          token
        );

        //verify payment
        console.log("courses data",courses);
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };

    //open payment modal
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log("error in payment", response.error);
    });
  } catch (error) {
    console.log("Payment api error", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
}

//send mail
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCSESS_EMAIL,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("sendPaymentSuccessEmail error", error);
  }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  console.log("bodydata",bodyData);
//   console.log("bodyDataCourses",bodyData.courses);
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("payment Successful, you are addded to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("Payment verify error", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
