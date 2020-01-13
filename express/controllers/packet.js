const Packet = require("../models/packet");

exports.create = function(req, res, next) {
  let packet = new Packet({
    payload: req.body.payload,
    user: req.body.userId,
    deviceName: req.body.deviceName
  });

  packet.save(err => {
    if (err) return res.status(400).send(err.message);
    res.sendStatus(201);
  });
};

exports.list = function(req, res, next) {
  Packet.find({ user: req.user.id }).exec(function(err, packet) {
    if (err) res.sendStatus(404);
    res.status(200).json(packet);
  });
};

function lastPackage(userId) {
  Packet.find({ user: userId })
    .limit(1)
    .exec(function(err, packet) {
      if (err || !user) return "Ops!";
      return packet;
    });
}

// exports.monitor = function(ws) {
//   let id;
//   ws.on("message", function incoming(data) {
//     let userId = data;
//     id = setInterval(function() {
//       ws.send(JSON.stringify(lastPackage(userId)), function() {
//         //
//         // Ignore errors.
//         //
//       });
//     }, 100);
//   });
//   console.log("started client interval");

//   ws.on("close", function() {
//     console.log("stopping client interval");
//     clearInterval(id);
//   });
// };
