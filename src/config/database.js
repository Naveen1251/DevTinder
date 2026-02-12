const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteNode:Z3fzVG4VLaAovSLS@namastenodejs.0pmqp7n.mongodb.net/devTinder",
  );
};

module.exports = connectDB

