const Device = require("../models/device");
const User = require("../models/user");

exports.create = function(req, res, next) {
  let device = new Device({
    name: req.body.name,
    user: req.user.id
  });

  device.save(err => {
    if (err) return res.status(400).send(err.message);
    User.findById(req.user.id).exec(function(err, user) {
      user.devices.push(device);
      user.save(err => {
        if (err) return res.status(400).send(err.message);
        res.status(201).json(device);
      });
    });
  });
};

exports.list = function(req, res, next) {
  User.findById(req.user.id)
    .populate("devices")
    .exec(function(err, user) {
      if (err) res.sendStatus(404);
      res.status(200).json(user.devices);
    });

  // Device.find().exec(function(err, devices) {
  //   if (err) res.sendStatus(404);
  //   res.status(200).send(devices);
  // });
};

exports.getById = function(req, res, next) {
  Device.findById(req.params.id)
    .populate("user")
    .exec(function(err, device) {
      if (err) res.sendStatus(404);
      res.status(200).send(device);
    });
};

exports.delete = function(req, res, next) {
  let deviceId = req.params.id;
  Device.findByIdAndRemove(deviceId).exec(function(err, device) {
    if (err) res.sendStatus(404);
    User.findById(req.user.id)
      .populate("devices")
      .exec(function(err, user) {
        if (err) res.sendStatus(404);
        user.devices = removeById(user.devices, deviceId);
        user.save(err => {
          if (err) return res.status(400).send(err.message);
          res.sendStatus(204);
        });
      });
  });
};

function removeById(arr, id) {
  return arr.filter(function name(value) {
    if (value._id != id) return value;
  });
}
