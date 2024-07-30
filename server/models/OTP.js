const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailVerificationTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5*60, //expire in 5 minutes
  },
});

//a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      emailVerificationTemplate(otp)
    );
    console.log("Mail Sent Successfully", mailResponse);
  } catch (error) {
    console.log("error occured at email verifivation", error);
    throw error;
  }
}

//pre middleware
otpSchema.pre("save", async function (next) {
  //only send a email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema); //creating a model of OTP using the schema defined above
