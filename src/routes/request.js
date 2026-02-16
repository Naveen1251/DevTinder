const express = require("express")
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try{
    const user  = req.user
    res.send(user.firstName + " sent you connection request" )
  }catch(err){
    err.status(400).send("Error sending connection: " + err.message);
  }
})

module.exports = requestRouter;