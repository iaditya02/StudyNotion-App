const express = require("express");
const router = express.Router();
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

const {
  updateProfile,
  deleteAccount,
  getAllUserDetails,
  updateProfilePicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

//delete user account
router.delete("/deleteAccount", auth, deleteAccount);
//update profile
router.put("/updateProfile", auth, updateProfile);
//get all user details
router.get("/allUserDetails", auth, getAllUserDetails);
//update profile picture
router.put("/updateProfilePicture", auth, updateProfilePicture);
//get user enrolled courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
