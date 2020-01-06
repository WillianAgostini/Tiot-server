const Device = require('../models/device');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.create = function(req, res, next) {
  let device = new Device({
    name: req.body.name,
    createBy: req.user.id
  });

  device.save(err => {
    if (err) return res.status(201).send(err.message);
    req.user.devices.push(device);
    User.findById(req.user.id).exec(function(err, user) {
      user.devices.push(device);
      user.save(err => {
        if (err) return res.status(201).send(err.message);
        res.sendStatus(201);
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
