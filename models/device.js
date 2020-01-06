const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const Device = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  createBy: { type: Schema.Types.ObjectId, ref: 'user' }
});
Device.plugin(uniqueValidator);

module.exports = mongoose.model('device', Device);
