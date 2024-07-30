const { default: mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailsender = require("../utils/mailSender");
const crypto = require("crypto");
const { paymentSuccess } = require("../mail/templates/paymentSuccess");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

//initiate payment
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "No courses selected",
    });
  }

  let totalAmount = 0;
  // console.log("courses",courses);

  for (const course_id of courses) {
    let course;
    console.log("courseID",course_id)
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.json({
          success: false,
          message: "Could not find course",
        });
      }
      
      console.log("course", course);
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already Enrolled",
        });
      }
      totalAmount += course.price;
      console.log("totalcost", totalAmount);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error1",
      });
    }
  }

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };

  console.log("options",options);

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log("paymentResponse",paymentResponse);

    return res.status(200).json({
      success: true,
      message: "Payment link generated",
      paymentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not initiate payement order",
    });
  }
};

//verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;
  console.log("courses",courses);

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (razorpay_signature === expectedSignature) {
    //enroll student
    await enrollStudents(courses, userId, res);

    //return res
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  }
  return res.status(500).json({
    success: false,
    message: "Payment verification failed",
  });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });
  }
  for (const courseId of courses) {
    try {
      //find the course and enroll user in course
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrollStudents) {
        return res.status(500).json({
          success: false,
          message: "Failed to enroll students in courses",
        });
      }



      //create a course progress of the student
      const courseProgress=await CourseProgress.create(
        {
          courseID:courseId,
          userID:userId,
          completedVideos:[],
        }
      )

      //find the student and add the course of enrolled courses

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress:courseProgress._id,
          },
        },
        { new: true }
      );
      //send mail
      const mailSender = await mailsender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailsender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccess(
        amount / 100,
        paymentId,
        orderId,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

//this is for single item buy
// //capture the payment and initiate the razorpay order
// exports.capturePayment = async (req, res) => {
//   //get courseid and userid
//   const { course_id } = req.body;
//   const userId = req.user.id;
//   //validation
//   //valid courseid
//   if (!course_id) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide a valid course id",
//     });
//   }
//   //valid courseDEtails
//   let course;
//   try {
//     course = await Course.findById(course_id);
//     if (!course) {
//       return res.json({
//         success: false,
//         message: "Invalid Course Id.",
//       });
//     }
//     //check already user pay for the same course
//     const uid = new mongoose.Types.ObjectId(userId);
//     if (course.studentsEnrolled.includes(uid)) {
//       return res.status(401).json({
//         success: false,
//         message: "Student is already enrolleed for this course",
//       });
//     }
//   } catch (error) {
//     console.log("Error in Fetching Course Details", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
//   //order create
//   const amount = course.price;
//   const currency = "INR"; //only INR supported by Razorpay

//   const options = {
//     amount: amount * 100,
//     currency: currency,
//     receipt: "receipt_no_" + Math.floor(Math.random() * 99999),
//     notes: {
//       courseId: course._id,
//       userId,
//     },
//   };
//   try {
//     //initaiate the payment using razorpay
//     const paymentResponse = await instance.orders.create(options);
//     console.log("Payment response", paymentResponse);
//     //return response
//     return res.status(200).json({
//       success: true,
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       couseThumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount / 100,
//     });
//   } catch (error) {
//     console.log("Error creating order", error);
//     res.json({
//       success: false,
//       message: "couldnot initaiate the payment",
//     });
//   }
// };

// //verify signature of razorpay and server
// exports.verifySignature = async (req, res) => {
//   const webHookSecret = "12345678";

//   const signatureFromRazorpay = ["x-razorpay-signature"];

//   const shasum = crypto.createHmac("sha256", webHookSecret);

//   shasum.update(JSON.stringify(req.body));

//   const digest = shasum.digest("hex");

//   if (digest === signatureFromRazorpay) {
//     console.log("payment is authorized");

//     const { courseId, userId } = req.body.payload.payment.entity.notes;

//     try {
//       //fullfill the action
//       //find the course and enroll  it to the user who made the payments
//       const enrolledCourse = await Course.findById(
//         { _id: courseId },
//         {
//           $push: { studentsEnrolled: userId },
//         },
//         { new: true }
//       );

//       if (!enrolledCourse) {
//         return res.status(500).json({
//           success: false,
//           message: "course not found",
//         });
//       }
//       console.log("Enrolled course", enrolledCourse);

//       //find the student and update the course
//       const enrolledStudent = await User.findOneAndUpdate(
//         { _id: userId },
//         {
//           $push: { courses: courseId },
//         },
//         { new: true }
//       );
//       console.log("EnrolledStudent", enrolledStudent);

//       //mail send
//       const emailResponse = await mailsender(
//         enrolledStudent.email,
//         `You have successfully enrolled in ${enrolledCourse.title}`,
//         `<h3>Hello ${enrolledStudent.name}, </h3><br/>
//          <p>Your payment for the Enrollment of "${enrolledCourse.title}" has been successful.</p>`
//       );
//       console.log("email response", emailResponse);
//       //send back a response
//       return res.status(200).json({
//         success: true,
//         data: enrolledCourse,
//         message: "Signatgure verified successfully",
//       });
//     } catch (error) {
//       console.log("Error in enrolling to a Course ", error);
//       return res.status(500).json({
//         success: false,
//         message: "Something went wrong!",
//       });
//     }
//   }
//   else{
//     return  res.status(401).json({
//       success:false,
//       message:"Not authorized"
//     })
//   }
// };
