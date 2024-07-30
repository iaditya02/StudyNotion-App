const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating
exports.createRating = async (req, res) => {
  try {
    //get userid
    const userId = req.user.id;
    //fetch data from req body
    const { rating, review, courseId } = req.body;
    //check whether user is enrolled in this course or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(401).json({
        success: false,
        msg: "Student is not enrolled in this course",
      });
    }

    //check whether user already review this course or not
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(409).json({
        success: false,
        msg: "User has already given the review for this course.",
      });
    }
    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    //update this course with rating and review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReview: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log("updated course details", updatedCourseDetails);
    //return response
    return res.status(201).json({
      success: true,
      data: ratingReview,
      message: "Rating And Review done successfully",
    });
  } catch (error) {
    console.log("Error in adding rating and review : ", error);
    return res.status(500).json({
      success: false,
      msg: "Server Error! Can't add rating and review",
    });
  }
};

//get average rating
exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseid;
    //calculate average rating
    const avgRating = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    //return rating
    if (avgRating.length <= 0) {
      return res.status(404).json({
        success: false,
        count: 0,
        message: "No Average Rating found.",
        averageRating: 0,
      });
    } else {
      return res.status(200).json({
        success: true,
        count: avgRating.length,
        averageRating: avgRating[0].averageRating,
      });
    }
  } catch (error) {
    console.log("Error in getting average rating and review : ", error);
    return res.status(500).json({
      success: false,
      msg: "Server Error! Can't get average of rating and review",
    });
  }
};

//get all rating and review of all courses
exports.getAllRatings = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();
    //return response
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log("Error in getting all rating and review : ", error);
    return res.status(500).json({
      success: false,
      msg: "Server Error! Can't get all rating and review",
    });
  }
};
