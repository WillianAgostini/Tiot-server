const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const Device = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  createDate: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User" }
});
Device.plugin(uniqueValidator);

module.exports = mongoose.model("Device", Device);
