import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";

import { updateProfilePicture } from "../../../services/operations/SettingsAPI";
import UpdateProfileDetails from "../../setting/UpdateProfileDetails";
import UpdatePassword from "../../setting/UpdatePassword";
import DelateAccount from "../../setting/DelateAccount";

const Settings = () => {
  const img = useSelector((state) => state.profile.user.image);
  const [profilePicture, setprofilePicture] = useState(img);
  const token = useSelector((state) => state.auth.token);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setprofilePicture(URL.createObjectURL(file));
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    updateProfilePicture(token, file);
  };

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Profile
      </h1>
      {/* update profile picture  */}
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 md:p-8 md:px-12 px-3 py-3 text-richblack-5">
        <div className="flex items-center gap-x-4">
          <img
            className="aspect-square w-[78px] rounded-full object-cover"
            src={profilePicture}
          ></img>
          <div className="space-y-2">
            <p>Change Profile Picture</p>
            <form onSubmit={handleFileUpload}>
              <div className="flex flex-row gap-3">
                <label
                  className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'"
                  htmlFor="upload"
                >
                  Select
                  <input
                    id="upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/gif, image/jpeg"
                  />
                </label>
                <button
                  type="submit"
                  className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
                >
                  Upload
                  <FiUpload />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* update details  */}
      <UpdateProfileDetails/>
      {/* update password  */}
      <UpdatePassword/>
      {/* delete Account  */}
      <DelateAccount/>
    </div>
  );
};

export default Settings;
