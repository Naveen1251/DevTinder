// import express from 'express'
const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();
// Check Diff btwn app.use and app.all
// Handle Auth middleware for all request GET, POST, PUT, DELETE
// This authorization middleware will be applied to all routes that start with /admin
app.use("/admin", adminAuth);

// When we call /user route, it will not execute the authorization middleware 
// as it is not under /admin
// When req comes to /user route, it will execute the userAuth middleware
//  and then send the response.


app.get("/user", userAuth, (req, res) => {
  res.send("User added successfully!");
});

app.get("/admin/addUser", (req, res) => {
  // Logic of checking if user is authorized 
  res.send("User added successfully!");
});
app.get("/admin/deleteUser", (req, res) => {
  // Logic of checking if user is authorized
  res.send("User deleted successfully!");
});


// Checking logic for authorization can be implemented using middleware.
app.listen(3000, () => {    
  console.log("Server is running on http://localhost:3000");
});
