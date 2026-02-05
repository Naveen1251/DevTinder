// import express from 'express'
const express = require("express");

const app = express();

// This will match only GET requests to /user
app.get("/user", (req, res) => {
  res.send({firstName: 'naveen', lastName: 'Prakash'});
});

// This will match only POST requests to /user
app.post("/user", (req, res) => {
  res.send("Data successfully saved to DB");
});

// This will match only DELETE requests to /user
app.delete("/user", (req, res) => {
  res.send("Data successfully deleted from DB");
});

// This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello World from test");
});

// app.use("/", (req, res) => {
//   res.send("Hello World update");
// });

app.listen(3000, () => {    
  console.log("Server is running on http://localhost:3000");
});
