var Bearer = require("permit").Bearer;
var userModel = require("../models/user");

var users = require("../controllers/user");
var device = require("../controllers/device");
var packet = require("../controllers/packet");

const permit = new Bearer({
  basic: String,
  //header: String,
  query: String
});

function authenticate(req, res, next) {
  const token = permit.check(req);

  if (!token) {
    permit.fail(res);
    return next(new Error(`Authentication required!`));
  }

  userModel.findByToken(token, (err, user) => {
    if (err) return next(err);
    if (!user) {
      permit.fail(res);
      return next(new Error(`Authentication invalid!`));
    }

    req.user = user;
    next();
  });
}

module.exports = function(app) {
  app.post("/signup", users.signup);
  app.post("/login", users.login);

  app.get("/users/me", authenticate, users.me);

  app.get("/devices/", authenticate, device.list);
  app.get("/devices/:id", authenticate, device.getById);
  app.post("/devices/", authenticate, device.create);

  app.get("/packet/", authenticate, packet.list);
  app.post("/packet/", authenticate, packet.create);
};
