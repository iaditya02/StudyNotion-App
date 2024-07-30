import React from "react";

import logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../../assets/images/TimelineImage.png";

const timeline = [
  {
    logo: logo1,
    heading: "Leadership",
    description: "Fully commited to the success company.",
  },
  {
    logo: logo2,
    heading: "Responsibility",
    description: "Students will always be our priority.",
  },
  {
    logo: logo3,
    heading: "Flexibility",
    description: "The ability to swith is an important skill.",
  },
  {
    logo: logo4,
    heading: "Solve the problem",
    description: "Code your way to a solution.",
  },
];

const TimeLineSection = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-15 items-center">
        <div className="lg:w-[45%] flex flex-col gap-5 p-3 lg:p-0">
          {timeline.map((element, index) => {
            return (
              <div className=" flex gap-6" key={index}>
                <div className=" w-[50px] h-[50px] bg-white flex items-center justify-center rounded-md">
                  <img src={element.logo} alt="" />
                </div>

                <div>
                  <h3 className=" font-semibold text-[18px]">
                    {element.heading}
                  </h3>
                  <p className=" text-base"> {element.description} </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className=" relative shadow-blue-200">
          <img
            src={timelineImage}
            alt="timeLineImage"
            className=" object-cover h-fit shadow-black rounded-md"
          />

          <div
            className=" absolute bg-caribbeangreen-700 flex text-white uppercase py-7 rounded-md shadow-blue-900 shadow-md
                left-[50%] translate-x-[-50%] translate-y-[-50%]
                "
          >
            <div className=" flex gap-5 items-center border-r border-caribbeangreen-200 px-7">
              <p className=" text-3xl font-bold">10</p>
              <p className=" text-caribbeangreen-50 text-sm">
                Years of Experience
              </p>
            </div>
            <div className=" flex gap-5 items-center px-7">
              <p className=" text-3xl font-bold">250</p>
              <p className=" text-caribbeangreen-50 text-sm">Type of Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLineSection;
