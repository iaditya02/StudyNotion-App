const mongoose=require('mongoose');

const categotySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
    },
    course:[
        {

            type:mongoose.Schema.Types.ObjectId,  //reference to the courses collection
            ref:'Course',                          //
        }
    ]
});

module.exports=mongoose.model("Category",categotySchema);