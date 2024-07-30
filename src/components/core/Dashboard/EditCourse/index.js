import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCourse/RenderSteps";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse, setStep } from "../../../../slices/courseSlice";

const EditCourse = () => {
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  console.log("courseId",courseId);



  useEffect(()=>{
    const populateCourse=async()=>{
        setLoading(true);
        const result=await getFullDetailsOfCourse(courseId,token);
        if(result?.courseDetails){
            console.log("Result",result);
            dispatch(setEditCourse(true));
            dispatch(setCourse(result?.courseDetails));
            dispatch(setStep(1));
        }
        setLoading(false);

    }
    populateCourse();
  },[])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }



  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
};

export default EditCourse;
