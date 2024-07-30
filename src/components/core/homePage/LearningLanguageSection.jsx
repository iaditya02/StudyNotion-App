import React from "react";
import HighlightText from "./HighlightText";
import KnowYourProgress from "../../../assets/images/Know_your_progress.png"
import CompareWithOthers from "../../../assets/images/Compare_with_others.png"
import PlanYourLesson from "../../../assets/images/Plan_your_lessons.png"
import CTAButton from "../../../components/core/homePage/Button"

const LearningLanguageSection = () => {
  return (
    <div className=" mt-[130px] w-11/12 items-center mb-20">
      <div className=" flex flex-col gap-5 items-center">
        <div className=" text-4xl text-center font-semibold">
          Your Swiss Knife for <HighlightText text={"leaning any language"} />
        </div>

        <div className=" text-center text-richblack-600 mx-auto text-base font-medium w-[70%]">
            Using spin making learning multiple languages easy. With 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>


        <div className="flex flex-col lg:flex-row items-center justify-center mt-5">
            <img src={KnowYourProgress}
                alt="knowYourProgress"
                className=" object-contain md:-mr-32"
            />
             <img src={CompareWithOthers}
                alt="CompareWithOthers"
                className=" object-fit"
            />
             <img src={PlanYourLesson}
                alt="PlanYourLesson"
                className="object-contain md:-ml-36"
            />
        </div>
        <div className=" w-fit">
            <CTAButton active={true} linkto={"/signup"}>
            <div>
                Learn more
            </div>
            </CTAButton>
            
            
        </div>

      </div>
    </div>
  );
};

export default LearningLanguageSection;
