const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const User=require("../models/user");

const JWT_SECRET="supersecretkey";

async function handlesignup(req,res)
{
    let {name,email,password}=req.body;
    const existinguser=await User.findOne({email});
    if(existinguser)
    {
        res.status(500).json("User already exists, you dont have to sign up!");
    }
    const hashedpassword=await bcrypt.hash(password,10);
    
    await User.create({name,email,password:hashedpassword});
    return res.json({ message: "User created successfully" });
}
async function handlelogin(req,res)
{
    console.log("LOGIN BODY:", req.body);
    let {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user)
    {
        res.status(400).json("User doesnt exist");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return res.json({ token });
}
module.exports = {handlesignup,handlelogin};