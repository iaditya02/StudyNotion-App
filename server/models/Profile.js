const mongoose=require('mongoose');

const profileSchema=new  mongoose.Schema({
    gender:{
        type:String
    },
    dateOfBirth:{
        type:String
    },
    about:{
        type:String,
        required:true,
        maxlength:[100,"Your description is too long"]
    },
    contactNumber:{
        type:Number,
        trim:true,
        minlength:10,
    }
});

module.exports=mongoose.model("Profile",profileSchema);