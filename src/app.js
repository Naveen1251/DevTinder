// import express from 'express'
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World update");
});

app.get("/test", (req, res) => {
  res.send("Hello World from test");
});


app.get("/hello", (req, res) => {
  res.send("Hello World from hellow route");
});

app.listen(3000, () => {    
  console.log("Server is running on http://localhost:3000");
});
