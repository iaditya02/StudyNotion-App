import React from "react";
import { deleteAccount } from "../../services/operations/SettingsAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const DelateAccount = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const token = useSelector((state) => state.auth.token);

  const onDeleteAccount = () => {
    deleteAccount(token, dispatch,navigate);
  };

  return (
    <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-3 md:p-8 md:px-12">
      <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
        <MdDelete className="text-4xl text-richblack-50" />
      </div>
      <div className="flex flex-col space-y-2 w-full">
        <h2 className="text-lg font-semibold text-richblack-5">
          Delete Account
        </h2>
        <div className="md:w-3/5 text-pink-25">
          <p>Would you like to delete account?</p>
          <p>
            This account may contain Paid Courses. Deleting your account is
            permanent and will remove all the contain associated with it.
          </p>
        </div>
        <button
          type="button"
          onClick={onDeleteAccount}
          className="w-fit cursor-pointer italic text-pink-300"
        >
          Click here to delete your Account.
        </button>
      </div>
    </div>
  );
};

export default DelateAccount;
