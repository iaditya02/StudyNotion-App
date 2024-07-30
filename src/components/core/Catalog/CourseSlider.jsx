import React from "react";

// import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay, FreeMode, Pagination } from "swiper";
import Course_Card from "./Course_Card";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

const CourseSlider = ({ Courses }) => {
  return (
    <div className="">
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={false}
          // pagination={true}
          freeMode={true}
          // allowSlidePrev={true}
          modules={[Autoplay, FreeMode, Pagination]}
          autoplay={{
            delay: 200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={5000}
          breakpoints={{
            440: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            825: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, index) => (
            <SwiperSlide key={index} className="">
              <Course_Card course={course} height={"lg:h-[250px] h-[100px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </div>
  );
};

export default CourseSlider;
