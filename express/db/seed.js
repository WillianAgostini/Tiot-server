var mongoose = require("mongoose");
const User = require("../models/user");

createUser = () => {
    var user = new User();
    user.username = "eu@gmail.com";
    user.password = "123456";
    user.fullName = "Willian";
    user.save(err => {
        if (err) console.log(err.message);
        console.log(user);
    });
}

mongoose
  .connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(
    () => {
      console.log("mongoose ready to use!");

      createUser();
    },
    err => {
      console.error(err);
    }
  );

  