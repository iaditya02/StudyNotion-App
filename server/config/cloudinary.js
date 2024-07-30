const cloudinary=require("cloudinary").v2;

exports.cloudinaryConnect=()=>{
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLODINARY_API_KEY,
            api_secret:process.env.CLODINARY_API_SECRET
        });
        console.log("cloudinary Connected")

    }
    catch(err){
        console.log('Error in connecting to Cloudinary', err);
    }
}