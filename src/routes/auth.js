const express = require("express")
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");


authRouter.post("/signup", async (req, res) => {
  try {
    // validate the request body
    validateSignupData(req);

    // Encrypt the password before saving to DB
    const { firstName, lastName, emailId, password } = req.body;
    const saltRounds = 10; // You can adjust the salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword, // Store the hashed password in the database
    });

    await user.save();
    res.send("User Added Sucessfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const ValidateEmail = validator.isEmail(emailId);
    if (!ValidateEmail) {
      return res.status(400).send("Invalid Email"); //if email is invalid then we will not check for password and return error immediately
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("invalid credentials");
    }

    const validPassword = await user.validatePassword(password)
    if (!validPassword) {
      throw new Error("invalid credentials");
    } else {
      // create a JWT token
      const token = await user.getJWT(); //we are calling the getJWT method which we have created in user model to generate a JWT token for the user

      // add the token to cookie and send response back to user
      res.cookie("token", token,{expires: new Date(Date.now() + 8 * 3600000) }); // Set the token in a cookie with an expiration time of 1 hour 

      res.send("Login sucessful!!");
    }
  } catch (err) {
    res.status(400).send("Error logging in: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token",null,{expires: new Date(Date.now())}) //we are setting the token cookie to null and setting the expiration time to current time so that cookie will be deleted from browser; 
  res.send("Logout successful!");
});


module.exports = authRouter;