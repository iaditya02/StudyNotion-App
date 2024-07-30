const express = require("express");
const router = express.Router();

//import required controllers
const {
  logIn,
  signUp,
  sendOTP,
  updateUserPassword,
} = require("../controllers/Auth");


const {forgotPasswordToken,resetPassword}=require("../controllers/ForgotPassword");

const {auth}=require("../middlewares/auth");

//routes for login, signUp, and authentication

//route for logIn
router.post("/login",logIn);

//route for signUp
router.post("/signup",signUp);

//send OTP route
router.post("/sendotp",sendOTP);

//update user password
router.post("/updatePassword",auth,updateUserPassword)



//reset Password
router.post("/reset-password-token",forgotPasswordToken);

//route for resetting user's password after verification
router.post("/reset-password",resetPassword);

module.exports=router;


