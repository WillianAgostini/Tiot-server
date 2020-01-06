const User = require("../models/user");

exports.me = function(req, res, next) {
  User.findById(req.user.id)
    .populate("devices")
    .populate("packets")
    .exec(function(err, user) {
      if (err) res.sendStatus(404);
      res.status(200).send(user);
    });
};

exports.signup = function(req, res, next) {
  let password = req.body.password;
  let username = req.body.username;

  let user = new User({
    username: username,
    password: password
  });

  user.save(err => {
    if (err) return res.status(201).send(err.message);
    let token = user.generateJWT();
    res.status(201).send(token);
  });
};

exports.login = function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ username: username, password: password }).exec(function(
    err,
    user
  ) {
    if (err) res.sendStatus(404);
    let token = user.generateJWT();
    res.status(200).send(token);
  });
};