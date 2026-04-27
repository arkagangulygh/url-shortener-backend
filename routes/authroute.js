const express=require("express");
const router=express.Router();
const {handlesignup,handlelogin}=require("../controllers/authcontroller");
router.post("/signup",handlesignup);
router.post("/login",handlelogin);
module.exports=router;