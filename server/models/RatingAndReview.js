const mongoose=require('mongoose');

const ratingAndreviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    rating:{
        type:Number,
        required:true,
        min:1,
    },
    review:{
        type:String,
        required:true,
        maxLength:500,
        trim: true,
    },
    course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},

});

module.exports=mongoose.model("RatingAndReview",ratingAndreviewSchema);