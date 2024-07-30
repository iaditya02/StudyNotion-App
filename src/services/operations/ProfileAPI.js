import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const { GETENROLLEDCOURSES_API,GET_INSTRUCTOR_DATA_API } = profileEndpoints;

//get user enrolled courses
export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GETENROLLEDCOURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");
    console.log(
      "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
      response
    )

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data.courses;
    console.log("result",result);
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  }
  toast.dismiss(toastId);
  return result;
}


export async function getInstructorData(token){
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET",GET_INSTRUCTOR_DATA_API,null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("AFTER Calling BACKEND API FOR INSTRUCTOR DATA",response);

    result=response?.data?.courses;
    console.log("resulr",result);
  }
  catch(error){
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error);
    toast.error("Could Not Get Instructor Data");
  }
  toast.dismiss(toastId);
  return result;
}
