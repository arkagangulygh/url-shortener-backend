const express=require("express");
const router=express.Router();
const {handlegetanalytics}=require("../controllers/urll");
router.get("/analytics/:shortId",handlegetanalytics);
module.exports=router;
