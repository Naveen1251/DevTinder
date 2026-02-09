// import express from 'express'
const express = require("express");

const app = express();

app.get("/getUserData", (req, res) => {
  try {
    throw new Error("Database connection failed");
    res.send("User added successfully!");
  } catch (err) {
    res.status(500).send("Error fetching user data");
  }
});

// err should always be first parameter
// If you write this at last it will catch all the errors from the above routes 
// and send a generic error message to the client,
app.use("/", (err, req, res, next) => {
  res.status(500).send("Something went wrong! Please try again later.");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
