import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { IoArrowBackCircle } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import {FaAngleDoubleRight} from 'react-icons/fa'
import {FaChevronLeft} from 'react-icons/fa'

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    //this is new syntax to write a function and call a function
    const setActiveFlags = () => {
      if (!courseSectionData.length) {
        return;
      }
      const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );

      const currentSubSectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.subSection.findIndex((data) => data._id === subSectionId);

      const activeSubSectionId =
        courseSectionData?.[currentSectionIndex]?.subSection?.[
          currentSubSectionIndex
        ]?._id;

      //set current section here
      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
      //set current subSection here
      setVideoBarActive(activeSubSectionId);
    };
    setActiveFlags();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div
        className={`${
          showSidebar ? "" : "hidden"
        } w-6 h-72 md:hidden relative `}
      >
        <FaAngleDoubleRight
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
          className={` md:hidden z-10 cursor-pointer text-2xl text-richblack-900 m-2 bg-richblack-100 rounded-full p-1 top-3 absolute -left-1 `}
        />
      </div>
      {!videoBarActive ? (
        <div className="grid h-screen w-screen place-items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className={ `${showSidebar?"h-0 w-0":"h-[calc(100vh-3.5rem)] w-[320px]"} transition-all duration-700 z-20 relative offSidebar1`}>
        <div className={`${showSidebar?"hidden":""} transition-all origin-right duration-500 flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 offSidebar2`}>
          <div className={`${showSidebar?"hidden":""} mx-5   flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25 offSidebar2`}>
            <div className='flex w-full items-center justify-between '>
              <div
                className="className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90'"
                title="back"
              >
                <FaChevronLeft className=' cursor-pointer md:hidden' onClick={()=>{setShowSidebar(true)}}/>
              <FaChevronLeft className=' cursor-pointer hidden md:block' onClick={()=>{
                navigate(`/dashboard/enrolled-courses`);
              }}/>
              </div>
              <IconBtn
                text="Add Review"
                customClasses="ml-auto"
                onclick={() => setReviewModal(true)}
              />
            </div>
            <div className="flex flex-col">
              <p>{courseEntireData?.courseName}</p>
              <p className="text-sm font-semibold text-richblack-500">
                {completedLectures?.length} / {totalNoOfLectures}
              </p>
            </div>
          </div>
          <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
            {courseSectionData.map((section, index) => (
              <div
                className="mt-2 cursor-pointer text-sm text-richblack-5"
                onClick={() => setActiveStatus(section?._id)}
                key={index}
              >
                {/* Section */}
                <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                  <div className="w-[70%] font-semibold">
                    {section?.sectionName}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`${
                        activeStatus === section?._id
                          ? "rotate-0"
                          : "rotate-180"
                      } transition-all duration-500`}
                    >
                      <MdKeyboardArrowDown />
                    </span>
                  </div>
                </div>

                {/* Sub Sections */}
                {activeStatus === section?._id && (
                  <div className="transition-[height] duration-500 ease-in-out mt-1">
                    {section.subSection.map((topic, i) => (
                      <div
                        className={`flex gap-3 px-5 py-2 ${
                          videoBarActive === topic._id
                            ? "bg-yellow-200 font-semibold text-richblack-800"
                            : "hover:bg-richblack-900"
                        } `}
                        key={i}
                        onClick={() => {
                          navigate(
                            `/dashboard/enrolled-courses/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                          );
                          setVideoBarActive(topic._id);
                        }}
                      >
                        <input
                          type="checkbox"
                          readOnly={true}
                          checked={completedLectures.includes(topic?._id)}
                          //onChange={() => {}}
                        />
                        {topic.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>
      )}
    </>
  );
};

export default VideoDetailsSidebar;
