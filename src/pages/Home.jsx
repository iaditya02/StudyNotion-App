import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/homePage/HighlightText";
import CTAButton from "../components/core/homePage/Button";
import Banner from "../assets/images/banner.mp4";
import CodeBlocks from "../components/core/homePage/CodeBlocks";
import TimeLineSection from "../components/core/homePage/TimeLineSection";
import LearningLanguageSection from "../components/core/homePage/LearningLanguageSection";
import InstructerSection from "../components/core/homePage/InstructerSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/homePage/ExploreMore";
import { ReviewSlider } from "../components/common/ReviewSlider";

const Home = () => {
  return (
    <div>
      {/* Section 1 */}

      <div className=" relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent">
        <Link to={"/signup"}>
          <div className=" group mt-16 p-1 mx-auto bg-richblue-800 rounded-full text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className=" flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblue-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className=" text-center text-4xl font-semibold mt-6">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className=" w-[75%] mt-4 text-center text-[0.9rem] leading-5 font-bold text-richblack-300">
          With our online coding courses, you can learn at your own place, from
          anywhere and anytime in the world, and get access to a wealth of
          resources, including hands-on projects, quizes, and personalized
          feedback from instructors.
        </div>

        <div className=" flex gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn more
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book demo
          </CTAButton>
        </div>

        <div className=" mx-3 my-7 mt-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200 w-[70%]">
          <video
            className="shadow-[20px_20px_rgba(240,245,245)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/*code section 1*/}
        <div>
          <CodeBlocks
            position={" flex lg:flex-row flex-col"}
            heading={
              <div className="font-semibold text-2xl lg:text-4xl sm:w-full">
                Unlock your
                <HighlightText text={"coding potential "} />
                with pur online courses.
              </div>
            }
            subHeading={
              "Our courses are designed and tought bt industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "try it youself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            codeColor={"text-white-25"}
            bgGradient={<div className="codeblock1 absolute"> </div>}
          />
        </div>

        {/*code section 2*/}
        <div>
          <CodeBlocks
            position={" flex lg:flex-row-reverse flex-col"}
            heading={
              <div className="font-semibold text-2xl lg:text-4xl sm:w-full">
                Start
                <HighlightText text={"coding in seconds "} />
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeBlock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            codeColor={"text-white-25"}
            bgGradient={<div className="codeblock2 absolute"> </div>}
          />
        </div>

        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className=" bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[280px] flex ">
          <div className=" w-11/12 max-w-maxContent flex items-center gap-5 mx-auto justify-center">
            <div className=" flex gap-7 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className=" flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className=" w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className=" flex gap-5 mb-10 mt-[120px] justify-between">
            <div className=" text-4xl font-semibold w-[45%]">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className=" flex flex-col gap-10 w-[40%] items-start">
              <div className=" text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competetative specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton>
            </div>
          </div>

          <TimeLineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
        <InstructerSection />

        <div className=" mb-16 mt-3">
          <h2 className="text-center text-2xl md:text-4xl font-semibold mt-8 text-richblack-5 mb-5">
            Review from Other learners
          </h2>

          {/*Review slider*/}
          <ReviewSlider />
        </div>
      </div>

      {/* footer*/}
      <Footer />
    </div>
  );
};

export default Home;
