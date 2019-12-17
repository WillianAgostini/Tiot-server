const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  password: String,
  message: [{ type: Schema.Types.ObjectId, ref: "message" }],
  client: [{ type: Schema.Types.ObjectId, ref: "client" }],
  deviceNames: [String]
});

module.exports = mongoose.model("users", User);
