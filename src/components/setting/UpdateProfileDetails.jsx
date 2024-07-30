import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../services/operations/SettingsAPI";
import { useNavigate } from "react-router-dom";

const UpdateProfileDetails = () => {
  const user = useSelector((state) => state.profile.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    about: "",
  });

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handelAdditionalDetails = (e) => {
    e.preventDefault();
    dispatch(updateProfile(token, formData));
  };

  const handleCancel=()=>{
    navigate("/dashboard/my-profile");
  }

  return (
    <form onSubmit={handelAdditionalDetails}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="firstName" className=" text-richblack-50">
              First Name
            </label>
            <input
              defaultValue={user.firstName || null}
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="lastName" className="text-richblack-50">
              Last Name
            </label>
            <input
              defaultValue={user.lastName || null}
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter first name"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dateOfBirth" className="text-richblack-50">
              Date of Birth
            </label>
            <input
              defaultValue={user?.additionalDetails.dateOfBirth || null}
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="text-richblack-50">
              Gender
            </label>
            <select
              defaultValue={user?.additionalDetails.gender || null}
              type="text"
              name="gender"
              id="gender"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              onChange={handleOnChange}
            >
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="contactNumber" className="text-richblack-50">
              Contact Number
            </label>
            <input
              defaultValue={user?.additionalDetails.contactNumber || null}
              type="tel"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter Contact Number"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about" className="text-richblack-50">
              About
            </label>
            <input
              defaultValue={user?.additionalDetails.about || null}
              type="text"
              name="about"
              id="about"
              placeholder="Enter Bio Details"
              className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
              onChange={handleOnChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <div 
        onClick={handleCancel}
        className="flex items-center bg-richblack-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined">
          Cancel
        </div>
        <button
          className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UpdateProfileDetails;
