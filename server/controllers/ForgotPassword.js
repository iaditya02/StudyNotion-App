const resetPasswordEmailTemplate = require("../mail/templates/resetPasswordEmailTemplate");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//forgotPasswordtoken
exports.forgotPasswordToken = async (req, res) => {
  try {
    //get email from the body
    const email = req.body.email;
    //check user for yhis email exists or not
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Your email is not registered.",
      });
    }
    //generate a token
    const token = crypto.randomBytes(20).toString("hex");
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    ); //using new true this will return changed data
    console.log("Details", updatedDetails);

    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send  this url to his email id
    // try {
    //   await mailSender(
    //     email,
    //     "Study Notion - Reset Password link",
    //     resetPasswordEmailTemplate(`${url}`)
    //   );
    //   // console.log("Email sent successfully:", emailResponse.response);
    // } catch (error) {
    //   // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
    //   console.error("Error occurred while sending email:", error);
    //   return res.status(500).json({
    //     success: false,
    //     message: "Error occurred while sending email",
    //     error: error.message,
    //   });
    // }
    await mailSender(
      email,
      "Study Notion - Reset Password link",
      resetPasswordEmailTemplate(`${url}`)
    );
    //return response
    return res.status(200).json({
      success: true,
      message: `Email has been sent with password reset link`,
      data: { resetLink: url },
    });
  } catch (error) {
    console.log("Error in forgot Password Token", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while reset password",
    });
  }
};

//reset Password
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and confirm Password not matching",
      });
    }
    //get user details from db using token
    let userDetails = await User.findOne({ token: token });

    //if no entry exists
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired link",
      });
    }
    //check time if it's expired or not
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, please regenerate your token ",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //update password in db
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully!",
    });
  } catch (error) {
    console.log("Error while reset password", error);
    return res.status(500).json({
      success: false,
      message: "Server error while reset password",
    });
  }
};
