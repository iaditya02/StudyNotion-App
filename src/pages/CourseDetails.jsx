import React, { useEffect, useState } from "react";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from "../components/common/Footer";
import RatingStars from "../components/common/RatingStars";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { formatDate } from "../services/formatDate";
import { FaShareSquare } from "react-icons/fa";
import { ACCOUNT_TYPE } from "../utils/constants";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";
import { IoVideocam } from "react-icons/io5";
import { addToCart } from "../slices/cartSlice";

const CourseDetails = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  const [courseData, setCourseData] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const result = await getCourseDetails(courseId);
        setCourseData(result);
        console.log("result", result);
      } catch (error) {
        console.log("Could not fetch course details");
      }
    };
    getCourseData();
  }, [courseId]);

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [totalTimeDuration, setTotalTimeDuration] = useState(0);

  useEffect(() => {
    let lectures = 0;
    let totalDuration = 0;
    courseData?.courseContent?.forEach((sec) => {
      lectures += sec?.subSection?.length || 0;
    });
    courseData?.courseContent?.forEach((sec) => {
      sec.subSection.forEach((subSec) => {
        totalDuration += parseInt(subSec?.timeDuration) || 0;
      });
    });
    setTotalTimeDuration(totalDuration);
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  useEffect(() => {
    if (courseData) {
      const Enrolled = courseData?.studentsEnrolled?.find(
        (student) => student === user?._id
      );
      // console.log("CourseDetails -> Enrolled", Enrolled)
      if (Enrolled) {
        setAlreadyEnrolled(true);
      }
    }
    const count = GetAvgRating(courseData?.ratingAndReview);
    setAvgReviewCount(count);
  }, [courseData]);

  const [openSections, setOpenSections] = useState([]);

  const handleToggleSections = () => {
    // If all sections are currently open, close all; otherwise, open all
    if (openSections.length === courseData?.courseContent?.length) {
      setOpenSections([]);
    } else {
      setOpenSections(courseData?.courseContent?.map((item, index) => index));
    }
  };

  const [confirmationModal, setConfirmationModal] = useState(null);
  const handleBuyCourse = () => {
    if (token) {
      console.log("token is present", token);
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      isOpen: true,
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => {
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
        navigate("/login");
      },
      btn2Handler: () => {
        setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (loading || !courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const handelAddToCart = () => {
    if (token) {
      dispatch(addToCart(courseData));
      console.log("courseData to cart", courseData);
    } else {
      dispatch("./login");
    }
  };
  

  if (!courseData) {
    return <Error />;
  }


  const {
    _id,
    // courseName,
    courseDescription,
    // thumbnail,
    price,
    ratingAndReview,
    whatUWillLearn,
    courseContent,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData;

  const courseName = courseData?.courseName;
  const thumbnail = courseData?.thumbnail;

  return (
    <>
      <div>
        <div className="mx-auto box-content px-4 lg:w-[1260px] lg:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px] ">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReview?.length} reviews)`}</span>
                <span>{`${studentsEnrolled?.length} students enrolled`}</span>
              </div>
              <div>
                <p className="">
                  Created By{" "}
                  {`${instructor?.firstName} ${instructor?.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                <span>₹{courseData?.price}</span>
              </p>
              {ACCOUNT_TYPE.INSTRUCTOR !== user?.accountType && (
                <>
                  {alreadyEnrolled ? (
                    <button
                      onClick={() => {
                        navigate("/dashboard/enrolled-courses");
                      }}
                      className=" bg-opacity-1 text-opacity-1 bg-[#86198f] rounded-md text-richblack-5 cursor-pointer p-4"
                    >
                      Go to Course
                    </button>
                  ) : (
                    <button
                      onClick={handleBuyCourse}
                      className="bg-opacity-1 text-opacity-1 bg-[#86198f] rounded-md text-richblack-5 cursor-pointer p-4"
                    >
                      Buy Now
                    </button>
                  )}
                  {alreadyEnrolled ? (
                    <div></div>
                  ) : cart?.find((item) => item?._id === courseData?._id) ? (
                    <button
                      onClick={() => {
                        navigate("/dashboard/cart");
                      }}
                      className="cursor-pointer p-4  rounded-md bg-richblack-900 text-richblack-5"
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      onClick={handelAddToCart}
                      className="cursor-pointer p-4  rounded-md bg-richblack-900 text-richblack-5"
                    >
                      Add to Cart
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
              <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
                <img
                  src={thumbnail}
                  alt="course img"
                  className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
                />
                <div className="px-4">
                  <div className="space-x-3 pb-4 text-3xl font-semibold">
                    <span>₹{courseData?.price}</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {ACCOUNT_TYPE.INSTRUCTOR !== user?.accountType && (
                      <>
                        {alreadyEnrolled ? (
                          <button
                            onClick={() => {
                              navigate("/dashboard/enrolled-courses");
                            }}
                            className=" bg-opacity-1 text-opacity-1 bg-[#86198f] rounded-md text-richblack-5 cursor-pointer p-4"
                          >
                            Go to Course
                          </button>
                        ) : (
                          <button
                            onClick={handleBuyCourse}
                            className=" bg-opacity-1 text-opacity-1 bg-[#86198f] rounded-md text-richblack-5 cursor-pointer p-4"
                          >
                            Buy Now
                          </button>
                        )}
                        {alreadyEnrolled ? (
                          <div></div>
                        ) : cart?.find(
                            (item) => item._id === courseData._id
                          ) ? (
                          <button
                            onClick={() => {
                              navigate("/dashboard/cart");
                            }}
                            className="cursor-pointer p-4  rounded-md bg-richblack-900 text-richblack-5"
                          >
                            Go to Cart
                          </button>
                        ) : (
                          <button
                            onClick={handelAddToCart}
                            className="cursor-pointer p-4  rounded-md bg-richblack-900 text-richblack-5"
                          >
                            Add to Cart
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="pb-3 pt-6 text-center text-sm text-richblack-25">
                    <p>30-Day Money-Back Guarantee</p>
                  </div>
                  <div className="">
                    <p className="my-2 text-xl font-semibold ">
                      This course includes
                    </p>
                    <div className="flex flex-col gap-1 text-sm text-caribbeangreen-100">
                      {JSON.parse(courseData?.instructions).map(
                        (item, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <span className="text-lg">✓</span>
                            <span>{item}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    {/* copy url */}
                    <button
                      className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("URL copied to clipboard");
                      }}
                    >
                      <FaShareSquare className="text-xl text-yellow-200" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
            <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
              <div className="my-8 border border-richblack-600 p-8">
                <p className="text-3xl font-semibold">What you'll learn</p>
                <div className="mt-5">{courseData?.whatUWillLearn}</div>
              </div>
              <div className="max-w-[830px] ">
                <div className="flex flex-col gap-3">
                  <p className="text-[28px] font-semibold">Course Content</p>
                  <div className="flex flex-wrap justify-between gap-2">
                    <div className="flex gap-2">
                      <span>
                        {courseData?.courseContent?.length} Section(s)
                      </span>
                      <span>
                        {/* {courseData?.courseContent?.reduce(
                          (acc, item) => acc + item?.subSection?.length,
                          0
                        )}{" "} */}
                        {totalNoOfLectures} Lecture(s)
                      </span>
                      <span>
                        {totalTimeDuration} (hours) Total Length of this course
                      </span>
                    </div>
                    <button
                      className="text-yellow-25"
                      onClick={handleToggleSections}
                    >
                      <span>Collapse all sections</span>
                    </button>
                  </div>
                </div>
                <div className="py-4">
                  {courseData?.courseContent?.map((item, index) => (
                    <details
                      key={index}
                      open={openSections.includes(index)} // Set the open state based on openSections array
                      className=" border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 detailanimatation"
                    >
                      <summary className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7  py-5 transition-[0.3s]">
                        <div className="flex items-center gap-2">
                          <FaChevronDown className="arrow " />
                          <span className="text-xl">{item?.sectionName}</span>
                        </div>
                        <div className="space-x-4">
                          <span className="text-yellow-25">
                            {item?.subSection?.length} Lecture(s)
                          </span>
                        </div>
                      </summary>
                      <div className="mt-5">
                        {item?.subSection?.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            className="relative overflow-hidden bg-richblack-900  p-5 border border-solid border-richblack-600"
                          >
                            <div className="flex items-center gap-2">
                              <IoVideocam className="txt-lg text-richblack-5" />
                              <span className="text-lg">{subItem?.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-12 py-4"></div>
            <p className="text-[28px] font-semibold">Author</p>
            <div className="flex items-center gap-4 py-4">
              <img
                src={courseData?.instructor.image}
                alt="author img"
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <p className="text-xl font-semibold">
                {courseData?.instructor?.firstName}{" "}
                {courseData?.instructor?.lastName}
              </p>
            </div>
            <p className="text-richblack-50 text-sm mb-10">
              {courseData?.instructor?.additionalDetails?.about}
            </p>
          </div>
          <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
            <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[990px]">
              <div className="my-8 border border-richblack-600 p-3 md:p-8">
                <p className="text-3xl font-semibold">Reviews</p>
                <div className="mt-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-4xl font-semibold">
                        {avgReviewCount}
                      </span>
                      <span className="text-2xl">/5</span>
                      <span className="text-richblack-50">
                        ({courseData?.ratingAndReview?.length} ratings)
                      </span>
                      <span className="text-richblack-50">|</span>
                      <span className="text-richblack-50">
                        {" "}
                        {courseData?.studentsEnrolled?.length} students enrolled
                      </span>
                    </div>
                  </div>
                </div>
                {courseData?.ratingAndReview?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:items-baseline gap-3 my-4 mt-12 ga"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item?.user?.image}
                        alt="user img"
                        className="w-[30px] h-[30px] rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <p className="md:text-xl min-w-max font-semibold">
                          {item?.user?.firstName} {item?.user?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <RatingStars Review_Count={item?.rating} />
                      </div>
                      <p className="text-richblack-50 text-[12px] md:text-sm max-w-4xl">
                        {item?.review}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        {confirmationModal && (
          <ConfirmationModal modalData={confirmationModal} />
        )}
      </div>
    </>
  );
};

export default CourseDetails;
