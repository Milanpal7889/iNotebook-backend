const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectToMongo;
