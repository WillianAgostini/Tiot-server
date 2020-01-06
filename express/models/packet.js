const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Packet = new Schema({
  payload: String,
  deviceName: String,
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Packet", Packet);
