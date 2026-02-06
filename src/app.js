// import express from 'express'
const express = require("express");

const app = express();

// app.use("/user",rh1,[rh2,rh3],rh4,rh5)// This will also work
// app.use("/user",rh1,rh2,rh3,rh4,rh5)// This will also work
// app.use("/user",[rh1,rh2,rh3,rh4,rh5])// This will also work

// app.use("/user",(req, res) => {
//   res.send("First user");
// },(req, res) => {
//   res.send("Second user");
// })
// In the above case you will get "First user" as response because 
// the first callback function is sending the response 
// and the second callback function will not be executed.


// app.use("/user",(req, res) => {
//   // res.send("First user");
// },(req, res) => {
//   res.send("Second user");
// })
// If you are not handling the response in the first callback function 
// then the second callback function will not be executed 
// and you will see server hangs and does not send any response.

app.use("/user",(req, res,next) => {
  // res.send("First user");
  next();
},(req, res) => {
  res.send("Second user");
})
// In the above case you will get "Second user" as response because
// the first callback function is calling next() to pass control to the next callback function 
// and the second callback function is sending the response.


app.listen(3000, () => {    
  console.log("Server is running on http://localhost:3000");
});
