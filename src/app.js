// import express from 'express'
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignupData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

app.use(express.json()); //This middleware helps to convert json object into JS object and set into req body
// without above middleware if you clg(req.body), this will return undefined.

app.post("/signup", async (req, res) => {
  try {
    // validate the request body
    validateSignupData(req);

    // Encrypt the password before saving to DB
    const {firstName,lastName,emailId,password} = req.body;
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
  try{
    const { emailId, password } = req.body;

    const ValidateEmail = validator.isEmail(emailId);
    if (!ValidateEmail) {
        return res.status(400).send("Invalid Email"); //if email is invalid then we will not check for password and return error immediately
    }

    const user = await User.findOne({ emailId: emailId });
    if(!user){
      throw new Error("invalid credentials")
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
      throw new Error("invalid credentials")
    }else{
      res.send("Login sucessful!!")
    }
  } catch(err){
      res.status(400).send("Error logging in: " + err.message);
    }
 
});

// get user by firstname
app.get("/user", async (req, res) => {
  const userFirstName = req.body.firstName;
  try {
    const users = await User.find({ firstName: userFirstName });
    if (users.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

// Get data of all users available in DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

// Delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted sucessfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// update user data
app.patch("/user/:userId", async (req, res) => {
  const lastname = req.params?.userId;
  const data = req.body;

  const allowedUpdates = ["age", "gender", "photoUrl", "about"];
  const isUpdateAllowed = Object.keys(data).every((update) =>
    allowedUpdates.includes(update),
  );
  if (!isUpdateAllowed) {
    return res.status(400).send("Invalid Updates");
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { LastName: lastname },
      data,
      {
        returnDocument: "after",
        runValidators: true, // this will run the validators defined in the schema before updating the document
      },
    );
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

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
