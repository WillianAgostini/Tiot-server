const Packet = require("../models/packet");
const Device = require("../models/device");

exports.create = function (req, res, next) {
  Device.findOne({ name: req.body.deviceName }).exec(function (err, device) {
    if (err || device == null) return res.sendStatus(404);

    let packet = new Packet({
      payload: req.body.payload,
      user: device.user,
      deviceName: req.body.deviceName
    });

    packet.save(err => {
      if (err) return res.status(400).send(err.message);
      res.sendStatus(201);
    });
  });
};

exports.list = function (req, res, next) {
  let name = req.params.name;
  limit = 12;

  if (req.params.limit)
    limit = parseInt(req.params.limit);


  Packet.find({ user: req.user.id, deviceName: name, createDate:{$gte: new Date(), $lte: new Date()}})
    .sort({ createDate: -1 })
    .exec(function (err, packet) {
      if (err) res.sendStatus(404);
      res.status(200).json(packet);
    });
};
