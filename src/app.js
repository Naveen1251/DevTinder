// import express from 'express'
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()); //This middleware helps to convert json object into JS object and set into req body
// without above middleware if you clg(req.body), this will return undefined.

app.post("/signup", async (req, res) => {
  // 
  // creating a new instance of user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Sucessfully");
  } catch (err) {
    res.status(400).send("Error saving the user");
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

// Patch
app.patch("/user",async (req,res)=>{
  const lastname = req.body.LastName;
  const data = req.body
  try{
    const updatedUser = await User.findOneAndUpdate({LastName:lastname},data)
    res.send("User Updated Successfully")
  }catch (err) {
    res.status(400).send("Something went wrong");
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
