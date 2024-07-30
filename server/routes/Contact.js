const express=require('express');
const { contactUs } = require('../controllers/ContactUs');
const router=express.Router();

router.post("/contact",contactUs);

module.exports=router;