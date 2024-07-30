import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

const Course_Card = ({ course, height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReview);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className=" w-[350px]">
      <Link to={`/courses/${course._id}`}>
        <div className="bg-richblack-700 rounded-xl overflow-hidden shadow-lg ">
          <img
            src={course?.thumbnail}
            alt="course thumbnail"
            className={`${height} w-full object-cover`}
          />
          <div className="flex flex-col gap-2 p-4 text-start">
            <p className="text-xl text-richblack-5 font-bold">
              {course?.courseName}
            </p>
            <p className="text-sm text-richblack-50">Instructor
              {` - ${course?.instructor?.firstName}`} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Course_Card;
