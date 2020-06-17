const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Recipe = new Schema({
  name: String,
  description: String,
  start: Date,
  end: Date,
  createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Recipe', Recipe);
