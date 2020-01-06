const Device = require("../models/device");
const User = require("../models/user");

exports.create = function(req, res, next) {
  let device = new Device({
    name: req.body.name,
    createBy: req.user.id
  });

  device.save(err => {
    if (err) return res.status(400).send(err.message);
    User.findById(req.user.id).exec(function(err, user) {
      user.devices.push(device);
      user.save(err => {
        if (err) return res.status(400).send(err.message);
        res.status(201).send(device);
      });
    });
  });
};

exports.list = function(req, res, next) {
  Device.find().exec(function(err, devices) {
    if (err) res.sendStatus(404);
    res.status(200).send(devices);
  });
};

exports.getById = function(req, res, next) {
  Device.findById(req.params.id)
    .populate("createBy")
    .exec(function(err, device) {
      if (err) res.sendStatus(404);
      res.status(200).send(device);
    });
};
