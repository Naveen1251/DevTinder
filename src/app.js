// import express from 'express'
const express = require("express");

const app = express();

// Accepts any req if it is /user,/user/xyz,/user/abc/def
app.get("/user", (req, res) => {
  res.send({firstName: 'naveen', lastName: 'Prakash'});
});

// Accepts any req if it is /ac,/abc 
// (ab?c worked until express 4.x.x, but in express 5.x.x it is not working, so we can use regex to achieve the same result)
app.get(/^\/ab?c$/, (req, res) => {
  res.send({firstName: 'naveen', lastName: 'Prakash'});
});
app.get("/user", (req, res) => {
  console.log(req.query); // to get optional filters and modifiers or query parameters
  res.send({firstName: 'naveen', lastName: 'Prakash'});
});

// this is for dynamic routing
app.get("/user/:id", (req, res) => {
  console.log(req.params); // to get required route data
  res.send({firstName: 'naveen', lastName: 'Prakash'});
});

// // This will match only POST requests to /user
// app.post("/user", (req, res) => {
//   res.send("Data successfully saved to DB");
// });

// // This will match only DELETE requests to /user
// app.delete("/user", (req, res) => {
//   res.send("Data successfully deleted from DB");
// });

// // This will match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//   res.send("Hello World from test");
// });

// app.use("/", (req, res) => {
//   res.send("Hello World update");
// });

app.listen(3000, () => {    
  console.log("Server is running on http://localhost:3000");
});
