const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");
const mongoose = require("mongoose");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId  = req.user.id;

  try {
    //check if the subSection is valid or not
    const subSection = await SubSection.findById(subSectionId);
    console.log("subSectionID", subSection);

    if (!subSection) {
      return res.status(404).json({ error: "Invalid SubSection" });
    }

    //check for old entry of courseProgress

    let courseProgress = await CourseProgress.findOne({
      userID: userId,
      courseID: courseId,
    });
    console.log("courseProgress data", courseProgress);

    if (!courseProgress) {
      return res.status(404).json({
        error: "Course Progress not found",
        success: false,
        result: courseProgress,
      });
    } else {
      //check for re-completing video/subSection
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(400).json({
          error: "You have already completed this subSection",
          success: false,
        });
      }

      //push into completed videos
      courseProgress.completedVideos.push(subSectionId);
    }
    await courseProgress.save();
    return res.status(200).json({
        success:true,
      message: "Course Progress updated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};
