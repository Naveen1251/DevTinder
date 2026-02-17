const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const {validateEditProfileData} = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt")


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user
    
    res.send(user);
  } catch (err) {
    res.status(400).send("Error logging in: " + err.message);
  }
});

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
  try{
    
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
    await loggedInUser.save()
    // res.send(` ${loggedInUser.firstName}, your profile Updated sucessfully`); this is on way 
    res.json({message: `${loggedInUser.firstName}, your profile Updated sucessfully`, user: loggedInUser}) // this is another way to send response with message and updated user data in json format
  } catch (err) {
    res.status(400).send("Error editing: " + err.message);
  }
})


profileRouter.patch("/profile/password", async(req,res)=>{
  try{
    const{emailId, newPassword} = req.body
    const user = await User.findOne({ emailId: emailId });
    if(!user){
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({message: "Password updated successfully"});
  }catch (err) {
    res.status(400).send("Error editing: " + err.message);
  }
});

module.exports = profileRouter;
