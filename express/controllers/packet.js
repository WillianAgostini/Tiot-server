const Packet = require("../models/packet");
const User = require("../models/user");

exports.create = function(req, res, next) {
  let packet = new Packet({
    payload: req.body.payload,
    user: req.user.id
  });
  let user = req.user;
  packet.save(err => {
    if (err) return res.status(400).send(err.message);
    user.packets.push(packet);
    user.save(err => {
      if (err) return res.status(400).send(err.message);
      res.status(201).send(packet);
    });
  });
};

exports.list = function(req, res, next) {
  Packet.find().exec(function(err, packet) {
    if (err) res.sendStatus(404);
    res.status(200).send(packet);
  });
};

function lastPackage(userId) {
  User.findById(userId)
    .populate("packets")
    .exec(function(err, user) {
      if (err || !user) return "Ops!";
      return user.packet[-1];
    });
}

exports.monitor = function(ws) {
  let id;
  ws.on("message", function incoming(data) {
    let userId = data;
    id = setInterval(function() {
      ws.send(JSON.stringify(lastPackage(userId)), function() {
        //
        // Ignore errors.
        //
      });
    }, 100);
  });
  console.log("started client interval");

  ws.on("close", function() {
    console.log("stopping client interval");
    clearInterval(id);
  });
};
