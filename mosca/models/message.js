const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
  topic: String,
  payload: String,
  qos: Number,
  retain: Boolean
});

module.exports = mongoose.model("message", Message);
