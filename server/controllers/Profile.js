const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress=require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");
const {
  convertSecondsToDuration,
} = require("../utils/convertSecondsToDuration");

//update Profile
exports.updateProfile = async (req, res) => {
  try {
    //get data
    const {
      firstName,
      lastName,
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    //get userid
    const id = req.user.id;
    // //validation
    // if(!contactNumber||!gender){
    //     return  res.status(400).json({
    //         success:false,
    //         message:"Please fill all fields"
    //     });
    // }
    //find profile using userid
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    //update profile using save method because object is already create while signup
    userDetails.firstName = firstName || userDetails.firstName;
    userDetails.lastName = lastName || userDetails.lastName;
    profileDetails.dateOfBirth = dateOfBirth || profileDetails.dateOfBirth;
    profileDetails.about = about || profileDetails.about;
    profileDetails.contactNumber =
      contactNumber || profileDetails.contactNumber;
    profileDetails.gender = gender || profileDetails.gender;
    // const user = await User.findByIdAndUpdate(id, {
    //   firstName,
    //   lastName,
    // });
    // await user.save();
    // profileDetails.dateOfBirth = dateOfBirth;
    // profileDetails.about = about;
    // profileDetails.contactNumber = contactNumber;
    // profileDetails.gender = gender;

    await profileDetails.save();
    await userDetails.save();

    // const updatedUserDetails = await User.findById(id)
    //   .populate("additionalDetails")
    //   .exec();
    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated Successfully!",
      userDetails,
      profileDetails,
    });
  } catch (error) {
    console.log("Error while  updating the profile : ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error at profile updating",
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    //get userid
    const id = req.user.id;
    //validation whether user exist or not
    const userDetails = await User.findById({ _id: id });
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "User doesnot exists!",
      });
    }
    //delete profile first
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    //todo :remove from count of enroled students and then delete user
    //delete user
    await User.findByIdAndDelete({ _id: id });
    //return response
    return res.status(200).json({
      success: true,
      message: "Your Account has been deleted successfully!",
    });
  } catch (error) {
    console.log("Error in deleting the account : ", error);
    return res.status(500).json({
      success: false,
      message: "Server Error! Can't delete your account.",
    });
  }
};

//get all userDetails
exports.getAllUserDetails = async (req, res) => {
  try {
    //get userid
    const id = req.user.id;
    //validation and get userid
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "user data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.log("Error in getting user details :", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update display profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No such user exist",
      });
    }

    const image = req.files.profile;
    //check image is there or not
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    //upload image to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );
    console.log("image Upload Details", uploadDetails);

    const updateImage = await User.findByIdAndUpdate(
      { _id: userId },
      { image: uploadDetails.secure_url },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      data: updateImage,
      message: "Image updated Successfully",
    });
  } catch (error) {
    console.log("Error in updating Image", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//get enrolled courses details

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userID: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      console.log("courseProgressCount",courseProgressCount);
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    console.log("course",userDetails);
    return res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.instructorDashboard=async(req,res)=>{
  try{
    const courseDetails=await Course.find({instructor:req.user.id});

    const courseData=courseDetails.map((course)=>{
      const totalStudentsEnrolled=course.studentsEnrolled.length;
      const totalAmountGenerated=totalStudentsEnrolled*course.price;

      //create a new obkect with the additional fields
      const courseDataWithStats={
        _id:course._id,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated
      }
      return courseDataWithStats
    })
    return res.status(200).json({
      success:true,
      courses:courseData,
      })

  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:error.message
      })
  }
}