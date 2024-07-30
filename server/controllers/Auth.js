const User = require("../models/User");
const OTP = require("../models/OTP");
const otpgenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
const { passwordUpdate } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

//send OTP
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from req body
    const { email } = req.body;

    //check if user is already present or not
    const checkUserPresent = await User.findOne({ email });

    //if user already exists,then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "Email Already Registered",
      });
    }

    //generate otp
    var otp = otpgenerator.generate(6, {
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      numbersOnly: true,
    });
    console.log("otp is", otp);

    //make sure that otp is unique so check
    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpgenerator.generate(6, {
        upperCaseAlphabets: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        numbersOnly: true,
      });
    }

    //save the otp to the database
    const otpPayload = { email, otp };
    //create an entry fot OTP
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body",otpBody);

    //return response successfully
    return res.status(200).json({
      success: true,
      // data: {
      //   email,
      //   "OTP Sent": `${otp}`,
      // },
      message: "OTP sent successfully",
      otp
    });
  } catch (error) {
    console.log("Error while creating an OTP", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//sign up
exports.signUp = async (req, res) => {
  try {
    //data fetch from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please provide all details",
      });
    }

    //match both passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword do not match, please try again",
      });
    }

    //check  if user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already in registered.",
      });
    }

    //find the most recent otp stored for the user
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1); //createdAt:-1 means sorted in descending order
    console.log("Recent Otp", recentOTP);

    //validate OTP
    if (recentOTP.length === 0) {
      //means otp not found
      return res.status(400).json({
        success: false,
        message: "Otp not found.",
      });
    }
    //match input otp and recentOtp
    else if (otp !== recentOTP[0].otp) {
      //means invalid otp
      return res.status(401).json({
        success: false,
        message: "Invalid Otp.",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    //create entry in Db
    //create profile first
    const profileDetails = await Profile.create({
      gender:' ',
      dateOfBirth:' ',
      about:' ',
      contactNumber:null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully.",
      user,
    });
  } catch (error) {
    console.log("Error at signUp", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

//login
exports.logIn = async (req, res) => {
  try {
    //fetch email and password from req body
    const { email, password } = req.body;

    //validate data
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: "Please provide email or and password.Please try again",
      });
    }

    //check user exists or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password. Please signUp first.",
      });
    }

    //generate JWT, after matching password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //for 7 days
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        user,
        token,
        message: "Loged In successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log("error while sign in", error);
    return res.status(500).json({
      success: false,
      error: "Login failure. Please try again.",
    });
  }
};

//change password
exports.updateUserPassword = async (req, res) => {
  try {
    //fetch data from request
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    //validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //check old password
    let user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old Password is wrong!",
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password cannot be same as Old Password",
      });
    }
    //check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: `Your new password should be at least 6 characters long`,
      });
    }
    //check password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "The password and the confirmation password do not match",
      });
    }

    //hash new password & update password in db
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });

    //send mail that your password id updated
    try {
      const mailsend = await mailSender(
        updatedUserDetails.email,
        "Study Notion - Password Updated",
        passwordUpdate(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", mailsend.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log("Error in updating password", error);
    res.status(500).json({
      success: false,
      message: "Error occur at updating password",
    });
  }
};
