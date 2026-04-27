const express=require("express");
const checkauth=require("../middleware/auth");
const router=express.Router();
const {handleGenerateNewShortURL,getMyURLs}=require("../controllers/urll");
router.post("/",checkauth,handleGenerateNewShortURL);
router.get("/my-urls", checkauth, getMyURLs);
module.exports=router;