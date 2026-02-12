// import express from 'express'
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()) //This middleware helps to convert json object into JS object and set into req body 
// without above middleware if you clg(req.body), this will return undefined.

app.post("/signup", async (req, res) => {

  // creating a new instance of user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Sucessfully");
  } catch (err) {
    res.status(400).send("Error saving the user");
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
