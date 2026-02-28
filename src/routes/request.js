const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { connection } = require("mongoose");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status value");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found");
      }

      const existingConnectionUser = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionUser) {
        throw new Error(
          "Connection request already exists between these users",
        );
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} ${status === "interested" ? "is interested in" : "ignored"} ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error sending connection: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "Status not allowed" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: " Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.send(data);
    } catch (err) {
      res.status(400).send("Error", err.message);
    }
  },
);
module.exports = requestRouter;
