const express = require("express");
const router = express.Router();

const {
  createCourse,
  showAllCourses,
  getCourseDetails,
  editCourse,
  deleteCourse,
  getInstructorCourses,
  getFullCourseDetails,
} = require("../controllers/Courses");

const {
  createCaregory,
  getAllCategory,
  categoryPageDetails,
  addCourseToCategory,
} = require("../controllers/Tags");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

const {
  createRating,
  getAverageRating,
  getAllRatings,
} = require("../controllers/RatingAndReview");

const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

const { updateCourseProgress } = require("../controllers/CourseProgress");

//course routes

//course can only created by instructor
router.post("/createCourse", auth, isInstructor, createCourse);
//edit a course
router.post("/editCourse", auth, isInstructor, editCourse);
//delete a course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

//get all courses
router.get("/getAllCourses", showAllCourses);

//add a section to the course
router.post("/addSection", auth, isInstructor, createSection);
//update section
router.post("/updateSection", auth, isInstructor, updateSection);
//delete section
router.post("/deleteSection", auth, isInstructor, deleteSection);

//add subSection
router.post("/addSubSection", auth, isInstructor, createSubSection);
//update subSection
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
//delete subSection
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

//get All courses
router.get("/getAllCourses", showAllCourses);

//get a specific course details
router.post("/getCourseDetails", getCourseDetails);

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

//get all courses of a specific instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

//category Routes
router.post("/createCategory", auth, isAdmin, createCaregory); //admin can create a new Category
router.get("/getAllCategories", getAllCategory); //all users can see all categories
router.post("/getCategoryPageDetails", categoryPageDetails);
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory); //instructors can add courses to the category they created

//rating and review routes
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getAllReviews", getAllRatings);

//course progress api
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

module.exports = router;
