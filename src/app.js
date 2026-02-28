// import express from 'express'
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
app.use(cookieParser()); // This middleware is used to parse cookies from the incoming request
// and populate the req.cookies object with the parsed cookie data.
//  It allows you to easily access and manipulate cookies in your Express application.

app.use(express.json()); //This middleware helps to convert json object into JS object and set into req body
// without above middleware if you clg(req.body), this will return undefined.


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


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
