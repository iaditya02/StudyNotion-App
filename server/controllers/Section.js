const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    //data fetch from req
    const { sectionName, courseId } = req.body;
    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        msg: "Please enter all fields",
      });
    }
    const ifcourse = await Course.findById(courseId);
    if (!ifcourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    //create section
    const newSection = await Section.create({ sectionName });
    //update section to course schema with sectionobjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    //return response
    res.status(201).json({
      success: true,
      data: updatedCourseDetails,
      message: "Section Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
      message: "Error while creating Section. Please try again",
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    //data input
    const { sectionName, sectionId, courseId } = req.body;
    //data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        msg: "Please provide required field(s)",
      });
    }
    //updata data
    const updateSectionDetails = await Section.findByIdAndUpdate(
      sectionId,
      {
        sectionName,
      },
      { new: true }
    );
    //update course details
    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();

    //return response
    res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section Updated Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
      message: "Error while updating Section. Please try again",
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    //get id of section assuming that we are sending id into params
    const { sectionId, courseId } = req.body;
    //validation
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Request",
      });
    }
    //use find by id and delete
    await Section.findByIdAndDelete(sectionId);
    //todo: do we need to ddelete the entry from course schema
    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();
    //return response
    res.status(200).json({
      success: true,
      updatedCourse,
      message: `Section Deleted Successfully with ID ${sectionId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
      message: "Error while deleting Section. Please try again",
    });
  }
};
