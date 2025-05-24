const express  = require("express");
const app = express();
const signup = require("../models/Singup");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
app.use(express.urlencoded({ extended: true }));


exports.addUser = async (req, res) => {
  try {
    const { fname, lname,email,password } = req.body;
    console.log(req.body, "this is body")
    let check_email = await signup.findOne({ email });

    if (check_email) {
      return res.status(400).json({ message: "Email already exists" });
    }else{
       const newUser = new signup({
        fname,
        lname,
        email,
        password
       })
       await newUser.save();

       const token = jwt.sign(
        {userId: newUser._id, email: newUser.email},process.env.JWT_SECRET,{expiresIn: "1h"}
       );

       res.status(201).json({
        message: "User created successfully",
        token
    })
  }
  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req,res)=>{
  try{
    const {email,password} = req.body;
    const check_email = await signup.findOne({email});
    if(!check_email){
      return res.status(400).json({message: "Email not found"});
    }
    const isMatch = await bcrypt.compare(password,check_email.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid password"});
    }
    const token = jwt.sign(
      {userId: check_email._id, email: check_email.email},process.env.JWT_SECRET,{expiresIn: "1h"}
     );

     res.status(200).json({
      message: "Login successful",
      token
  })
}catch(error){
    res.status(500).json({ error: error.message });
  }
}