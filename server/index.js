const express=require("express");
const app=express();

const userRoutes=require("./routes/User");
const courseRoutes=require("./routes/Course");
const profileRoutes=require("./routes/Profile");
const contactUsRoute=require("./routes/Contact");
const paymentRoute=require("./routes/Payments");

const databse=require("./config/database");
const cookieParser=require("cookie-parser");
const cors=require('cors');
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");

require("dotenv").config();
const PORT=process.env.PORT || 4000;

//database connect
databse.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials: true //<-- this is what makes it work
    }
));
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/temp'
}));

//cloudinary connect
cloudinaryConnect();

//mount routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/reach",contactUsRoute);
app.use("/api/v1/payment",paymentRoute);

//default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is running"
    })
})

//activate server
app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
});
