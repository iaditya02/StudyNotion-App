import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
// import Swiper core and required modules

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper";
import ReactStars from "react-rating-stars-component";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { ratingEndpoints } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

const { GET_RATING_API } = ratingEndpoints;

export const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    const fetchAllReviews = async () => {
      const data = await apiConnector("GET", GET_RATING_API);
      console.log(data);

      if (data?.data?.success) {
        setReviews(data?.data?.data);
      }
    };
    fetchAllReviews();
  }, []);

  useEffect(() => {
    console.log("Review response", reviews);
  }, [reviews]);

  return (
    <div>
      <div>
        <Swiper
          slidesPerView={4}
          spaceBetween={26}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, FreeMode, Pagination]}
          breakpoints={{
            300: { slidesPerView: 1.1, spaceBetween: 10 },
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.1 },
          }}
          className=" w-full"
        >
          {reviews?.map((review, index) => (
            <SwiperSlide key={index} className=" flex flex-col">
              <div className="flex flex-col gap-3 min-h-[150px] bg-richblack-800 p-3 text-[14px] text-richblack-25 rounded-md">
                <div className=" flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt="ProfilePic"
                    className=" imag2"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                    <h2 className="text-[12px] font-semibold text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>
                <p className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : `${review?.review}`}
                </p>
                <div className="flex items-center gap-2 ">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
