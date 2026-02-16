// import express from 'express'
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")

app.use(cookieParser()); // This middleware is used to parse cookies from the incoming request
// and populate the req.cookies object with the parsed cookie data.
//  It allows you to easily access and manipulate cookies in your Express application.

app.use(express.json()); //This middleware helps to convert json object into JS object and set into req body
// without above middleware if you clg(req.body), this will return undefined.

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth,async (req, res) => {
  try {
    const user = req.user
    
    res.send(user);
  } catch (err) {
    err.status(400).send("Error logging in: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try{
    const user  = req.user
    res.send(user.firstName + " sent you connection request" )
  }catch(err){
    err.status(400).send("Error sending connection: " + err.message);
  }
})

connectDB()
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });
