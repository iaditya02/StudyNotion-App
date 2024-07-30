import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);

  const {courseId}=useParams();
  const {token}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();

  useEffect(()=>{
    const setCourseSpecificDetails=async()=>{
        const courseData=await getFullDetailsOfCourse(courseId,token);
        console.log("courseDAta",courseData);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        dispatch(setEntireCourseData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos));
        let lectures=0;
        courseData?.courseDetails?.courseContent?.forEach((section)=>{
            lectures+=section.subSection.length
        })
        dispatch(setTotalNoOfLectures(lectures));
    }
    setCourseSpecificDetails();

  },[courseId, token, dispatch])

  return (
    <>
      <div className=" flex w-screen">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />

        <div>
          <Outlet />
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

export default ViewCourse;
