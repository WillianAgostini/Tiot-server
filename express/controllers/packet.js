const Packet = require('../models/packet');
const Device = require('../models/device');

exports.create = function(req, res, next) {
  Device.findOne({name: req.body.deviceName}).exec(function(err, device) {
    if (err || device == null) return res.sendStatus(404);

    Packet.findOne(
        {deviceName: req.body.deviceName}, {}, {sort: {'createDate': -1}},
        function(err, lastPacket) {
          if (err) return res.status(400).send(err.message);

          let packet = new Packet({
            payload: req.body.payload,
            // user: device.user,
            deviceName: req.body.deviceName,
            status: req.body.status
          });

          if (lastPacket) {
            let nowMin = packet.createDate.getMinutes()
            let lastMin = lastPacket.createDate.getMinutes()

            if (lastMin == nowMin) {
              return res.sendStatus(202);
            }
          }
          packet.save(err => {
            if (err) return res.status(400).send(err.message);
            res.sendStatus(201);
          });
        });
  });
};

exports.list = function(req, res, next) {
  let name = req.params.name;
  limit = 60;

  if (req.params.limit) limit = parseInt(req.params.limit);

  Packet.find({deviceName: name})
      .limit(limit)
      .sort({'createDate': -1})
      .exec(function(err, packet) {
        if (err) res.sendStatus(404);
        res.status(200).json(packet);
      });
};

exports.getPackets =
    function(req, res, next) {
  Packet.find({deviceName: name}).exec(function(err, device) {
    if (err) res.sendStatus(404);
    res.status(200).send(device);
  });
}

    exports.deleteAll = function(req, res, next) {
  Packet.deleteMany().exec(function(err, device) {
    if (err) res.sendStatus(404);
    res.status(200).send(device);
  });
};
