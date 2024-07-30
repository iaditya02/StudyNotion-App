const { mongo, default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Tags");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress=require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");
const { convertSecondsToDuration } = require("../utils/convertSecondsToDuration");
const ObjectId = require("mongodb").ObjectId;
//create course handler
exports.createCourse = async (req, res) => {
  try {
    //fetch data  from the body of the request
    let {
      courseName,
      courseDescription,
      tag,
      whatUWillLearn,
      price,
      category,
      status,
      instructions,
    } = req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // Convert the tag and instructions from stringified Array to Array
    // const tag = JSON.parse(_tag);
    // const instructions = JSON.parse(_instructions);
    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatUWillLearn ||
      !price ||
      !tag ||
      !category ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor
    if (!status || status === undefined) {
      status = "Draft";
    }
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    console.log("Instructor details", instructorDetails);

    if (!instructorDetails) {
      return res.status(401).json({
        success: false,
        message:
          "Instructor Details not found. You must be logged in to create a course!",
      });
    }

    //check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(401).json({
        success: false,
        message: "Category Details not found.",
      });
    }

    //uplaod image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatUWillLearn: whatUWillLearn,
      price,
      tag:tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions:instructions,
    });

    //add the new course to the user Schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: { courses: newCourse._id },
      },
      { new: true } //return updated data
    );

    //update the category schema
    //todo HW
    // await Category.findByIdAndUpdate(
    //    categoryDetails._id,
    //   {
    //     $push: { courses: newCourse._id },
    //   },
    //   { new: true }
    // );

    //add the new course to the category
    const categoryDetails1 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: { course: newCourse._id },
      },
      { new: true }
    );
    console.log(
      "Updated category details after adding course to it",
      categoryDetails1
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error in createCourse : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create a course",
    });
  }
};

//get All courses handler function
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        name: true,
        price: true,
        thumbnail: true,
        instuctor: true,
        ratingAndReview: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses",
      count: allCourses.length,
      data: allCourses,
    });
  } catch (error) {
    console.log("Error in showing all courses : ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to show all courses",
    });
  }
};

//get All details of a Course
exports.getCourseDetails = async (req, res) => {
  try {
    //get id
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide course ID",
      });
    }
    //find courseDetails
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could  not find the course with given ID ${courseId}`,
      });
    }
    // console.log("coursedetails",courseDetails);

    //return response
    return res.status(200).json({
      success: true,
      data: {courseDetails},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
      message: "Error while getting all details of this course",
    });
  }
};

//Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    console.log("You are in course controllers")
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in editing course",
      error: error.message,
    });
  }
};

// Function to get all courses of a particular instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Find all courses of the instructor
    const allCourses = await Course.find({ instructor: userId });

    // Return all courses of the instructor
    res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    // Handle any errors that occur during the fetching of the courses
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

//Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    //Delete course id from Category
    await Category.findByIdAndUpdate(course.category._id, {
      $pull: { course: courseId },
    });

    //Delete course id from Instructor
    await User.findByIdAndUpdate(course.instructor._id, {
      $pull: { courses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
