const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Client = new Schema({
  id: String,
  //connection: String,
  server: String,
  // logger: any,
  //subscriptions: String;
  nextId: Number
  //inflight: any;
  //inflightCounter: number;
});

module.exports = mongoose.model("client", Client);
