import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiConnector";
import { contactusEndpoint } from "../../services/apis";
import countryCode from "../../data/countrycode.json";
import toast from "react-hot-toast";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  const submitContactForm = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      const phoneNo = data.countryCode + "  " + data.phoneNo;
      const { firstName, lastName, email, message } = data;

      const res = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);
      // console.log("logging response data",res);
      if (res.data.success === true) {
        toast.success("Message sent successfully");
      } else {
        toast.error("Something went wrong");
      }
      console.log("contact response", res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* firstname  */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstName" className="text-[14px] text-richblack-5">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter first name"
            className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
            {...register("firstName", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-pink-600">
              Please enter your name.
            </span>
          )}
        </div>
        {/* lastname  */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastName" className="text-[14px] text-richblack-5">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Enter last name"
            className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
            {...register("lastName")}
          />
        </div>
      </div>
      {/* email  */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-[14px] text-richblack-5">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-pink-600">
            Please enter your Email address.
          </span>
        )}
      </div>
      {/* phone number  */}
      <div className=" flex flex-col gap-2">
        <label className=" text-[14px] text-richblack-5" htmlFor="phoneNo">
          Phone Number
        </label>
        <div className=" flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              type="text"
              name="countrycode"
              id="countryCode"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              {...register("countryCode", { required: true })}
            >
              {countryCode.map((item, index) => {
                return (
                  <option key={index} value={item.code}>
                    {item.code} - {item.country}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="tel"
              name="phoneNo"
              id="phoneNo"
              placeholder="12345 67890"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter phone Number *",
                },
                maxLength: {
                  value: 10,
                  message: "Enter a valid Phone Number *",
                },
                minLength: {
                  value: 8,
                  message: "Enter a valid Phone Number *",
                },
              })}
            />
            {errors.phoneNo && (
              <span className=" text-yellow-25">
                {errors.phoneNo.message}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* message box  */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-[14px] text-richblack-5">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="28"
          rows="7"
          placeholder="Enter your message here"
          className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>
      <button
        type="submit"
        className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-richblack-500 sm:text-[16px] "
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
