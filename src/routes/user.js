const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const recievedRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age skills");

    res.json({
      message: "Received connection requests fetched successfully",
      data: recievedRequests,
    });
  } catch (err) {
    res.status(400).send("Error fetching received requests: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId._id, status: "accepted" },
        { toUserId: loggedInUserId._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName photoUrl age skills")
      .populate("toUserId", "firstName lastName photoUrl age skills");

    const formattedConnections = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUserId._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.json({
      message: "Connections fetched successfully",
      data: formattedConnections,
    });
  } catch (err) {
    res.status(400).send("Error fetching connections: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    let limit = parseInt(req.query.limit) || 10;
    limit  = limit > 50 ? 50 : limit; 
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId._id },
        { toUserId: loggedInUserId._id },
      ],
    }).select("fromUserId toUserId");

    const hideFromFeed = new Set();
    connections.forEach((req) => {
      hideFromFeed.add(req.toUserId.toString());
      hideFromFeed.add(req.fromUserId.toString());
    });

    const users = await User.find({
      _id: { $ne: loggedInUserId._id, $nin: Array.from(hideFromFeed) },
    }).select("firstName lastName photoUrl age skills").skip(skip).limit(limit);


    res.json({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).send("Error fetching feed: " + err.message);
  }
});

module.exports = userRouter;
