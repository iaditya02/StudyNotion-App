import React, { useState } from "react";
import { updatePassword } from "../../services/operations/SettingsAPI";
import { useSelector } from "react-redux";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const navigate=useNavigate();

  const handleCancel=()=>{
    navigate("/dashboard/my-profile");
  }

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleOnChangePassword = (e) => {
    setPassword((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePassword = (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = password;
    if (newPassword === confirmNewPassword) {
      updatePassword(token, password);
    } else {
      alert("Password doesn't matches");
    }
  };

  return (
    <form onSubmit={handlePassword}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className=" text-xl text-richblack-5 font-semibold">
          Update Password
        </h2>
        <div className=" relative mt-4">
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Old Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={password.oldPassword}
              onChange={handleOnChangePassword}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
            />
          </label>
          <span
            onClick={() => setShowOldPassword((prev) => !prev)}
            className="absolute right-3 top-9 z-[10] cursor-pointer"
          >
            {showOldPassword ? (
              <AiOutlineEyeInvisible
                fontSize={24}
                fill="#AFB2BF"
                color="white"
                className=""
              />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" color="white" />
            )}
          </span>
        </div>
        <div className=" relative mt-4">
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={password.newPassword}
              onChange={handleOnChangePassword}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
            />
          </label>
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 z-[10] cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible
                fontSize={24}
                fill="#AFB2BF"
                color="white"
                className=""
              />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" color="white" />
            )}
          </span>
        </div>
        <div className=" relative mt-4">
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={password.confirmNewPassword}
              onChange={handleOnChangePassword}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
            />
          </label>
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-10 z-[10] cursor-pointer"
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible
                fontSize={24}
                fill="#AFB2BF"
                color="white"
                className=""
              />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" color="white" />
            )}
          </span>
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <div
            onClick={handleCancel}
            className="flex items-center bg-richblack-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
          >
            Cancel
          </div>
          <button
            className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdatePassword;
