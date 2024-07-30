const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      // useNewParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => console.log("Db  Connected successfully"))
    .catch((err) => {
      console.log("Something went wrong while connecting to Db");
      console.log(err);
      process.exit(1);
    });
};
