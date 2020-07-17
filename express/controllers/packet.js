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

exports.list = async (req, res, next) => {
  let name = req.params.name;
  let min_date = new Date(req.params.min_date);
  const diffTime = Math.abs(new Date() - min_date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const now = new Date();
  let response = [];

  try {
    for (let index = 0; index < diffDays; index++) {
      let indexDateStart =
          new Date(now.getFullYear(), now.getMonth(), now.getDate() - index);
      let indexDateEnd = new Date(
          now.getFullYear(), now.getMonth(), now.getDate() - index + 1);
      let packet =
          await Packet
              .findOne({createDate: {$gte: indexDateStart, $lt: indexDateEnd}})
              .exec()
      if (packet) {
        response.push(packet);
      }
      else {
        if (response.length > 0) {
          response.push(new Packet({
            payload: undefined,
            deviceName: undefined,
            status: undefined,
            createDate: indexDateStart
          }))
        }
      }
    }

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json(error);
  }
  // Packet.find({deviceName: name, createDate: {$gte: min_date}})
  //     .sort('createDate')
  //     .exec(function(err, packets) {
  //       if (err) res.sendStatus(404);



  //       for (let index = 0; index < diffDays; index++) {
  //         let indexDate = new Date(
  //             now.getFullYear(), now.getMonth(), now.getDate() - index);

  //         let packet = packets.find(
  //             x => x.createDate.getFullYear() == indexDate.getFullYear() &&
  //                 x.createDate.getMonth() == indexDate.getMonth() &&
  //                 x.createDate.getDay() == indexDate.getDay());

  //         if (packet != undefined) {
  //           response.push(packet);
  //         } else {
  //           response.push(new Packet({
  //             payload: undefined,
  //             deviceName: undefined,
  //             status: undefined,
  //             createDate: indexDate
  //           }))
  //         }
  //       }

  //       return res.status(200).json(response);
  //     });
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
