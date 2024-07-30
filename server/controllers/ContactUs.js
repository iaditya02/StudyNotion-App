const { contactUsEmail } = require("../mail/templates/contactUsEmailTemplate");
const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
  const { firstName, lastName, email, message, phoneNo, countryCode} = req.body;
  if (!firstName || !email || !message) {
    return res.status(403).send({
      success: false,
      message: "All Fields are required",
    });
  }
  try {
    const data = {
      firstName,
      lastName: `${lastName ? lastName : "null"}`,
      email,
      message,
      phoneNo: `${phoneNo ? phoneNo : "null"}`,
    };

    const info = await mailSender(
      process.env.CONTACT_MAIL,
      "Enquery from studyNotion",
      contactUsEmail(firstName,lastName,email,message,phoneNo,countryCode)
      // `<html><body>${Object.keys(data).map((key) => {
      //   return `<p>${key} : ${data[key]}</p>`;
      // })}</body></html>`
    );

    if (info) {
      return res.status(200).send({
        success: true,
        message: "Your message has been sent successfully",
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log("Error in Contact Us API");
    return res.status(403).send({
      success: false,
      message: "Something went wrong",
    });
  }
};
