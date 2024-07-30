import toast from "react-hot-toast";
import { settingEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { logout } from "./authAPI";
import { setUser } from "../../slices/profileSlice";

const {
  UPDATE_PROFILE_PICTUTE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingEndpoints;

export async function updateProfilePicture(token, profile) {
  const toastId = toast.loading("Loading...");
  try {
    const formData = new FormData();
    console.log("profile pic", profile);
    formData.append("profile", profile);
    const response = await apiConnector(
      "PUT",
      UPDATE_PROFILE_PICTUTE_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("update profile picture response", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Profile Picture Updated Successfully");
    const imageUrl = response.data.data.image;
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("user")),
        image: imageUrl,
      })
    );
    console.log(JSON.parse(localStorage.getItem("user")).image);
  } catch (error) {
    console.log("Error while updating profile picture", error);
    toast.error("Could not update profile picture");
  }
  toast.dismiss(toastId);
}

export function updateProfile(token, additionalDetails) {
  return async (dispatch) => {
    console.log("token", token);
    console.log("additionalDetails", additionalDetails);
    const { firstName, lastName, dateOfBirth, gender, contactNumber, about } =
      additionalDetails;
    console.log("additionalDetails", additionalDetails);
    const toastId = toast.loading("Updating...");

    console.log("URL: ", UPDATE_PROFILE_API);

    // Log the headers to verify Authorization header is set correctly
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log("Headers being sent: ", headers);

    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE_API,
        { firstName, lastName, dateOfBirth, gender, contactNumber, about },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log("response for updating profile details", response);
      //checking the status of the request from backend and then set the user data in redux store
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.userDetails.firstName} ${response.data.userDetails.lastName}`;
      dispatch(setUser({ ...response.data.userDetails, image: userImage }));
      console.log("image",userImage);

      toast.success("Profile Details Updated Successfully.");

      const user = JSON.parse(localStorage.getItem("user"));
      user.image=userImage;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.additionalDetails.dateOfBirth =
        dateOfBirth || user.additionalDetails.dateOfBirth;
      user.additionalDetails.contactNumber =
        contactNumber || user.additionalDetails.contactNumber;
      user.additionalDetails.about = about || user.additionalDetails.about;
      user.additionalDetails.gender = gender;
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.log("Error in Updating Profile", error);
      toast.error("Could not upadate your profile Details");
    }
    toast.dismiss(toastId);
  };
}

export async function updatePassword(token, password) {
  const { oldPassword, newPassword, confirmNewPassword } = password;
  const toastId = toast.loading("Updating...");
  try {
    const response = await apiConnector(
      "POST",
      CHANGE_PASSWORD_API,
      { oldPassword, newPassword, confirmNewPassword },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("update password response", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Password Updated Successfully");
  } catch (error) {
    console.log("upadate password error", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}

export async function deleteAccount(token, dispatch, navigate) {
  const toastId = toast.loading("Deleting...");
  try {
    const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
      Authorization: `Bearer ${token}`,
    });
    console.log("response while deleting account", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Account deleted SUccessfuly");
    dispatch(logout(navigate));
  } catch (error) {
    console.log("Error in Account deletion : ", error);
    toast.error(error.response.data.message);
  }
  toast.dismiss(toastId);
}
