const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mahikumawat121998:1639506@cluster0.xexcn.mongodb.net/jwt?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
  }
};

module.exports = { connection };
