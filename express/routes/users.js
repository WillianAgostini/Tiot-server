const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

/* GET users listing. */
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});

router.post(
  "/deviceName",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res, next) => {
    req.session.save(err => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
);

module.exports = router;
