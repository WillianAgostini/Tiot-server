const Packet = require("../models/packet");

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
