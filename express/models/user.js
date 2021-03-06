const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

const User = new Schema({
  username: {type: String, unique: true, required: true},
  password: String,
  fullName: String,
  devices: [{type: Schema.Types.ObjectId, ref: 'Device'}],
  recipes: [{type: Schema.Types.ObjectId, ref: 'Recipe'}]
  // packets: [{ type: Schema.Types.ObjectId, ref: "Packet" }]
});

User.plugin(uniqueValidator);

User.methods.generateJWT = function() {
  return jwt.sign({id: this.id, password: this.password}, '123');
};

User.statics.findByToken = function(token, done) {
  jwt.verify(token, '123', (err, decoded) => {
    if (err) return done(new Error('User Not Found'));
    this.findById(decoded.id, (err, user) => {
      if (err) return done(new Error('error'));

      if (user && user.password != decoded.password)
        return done(new Error('Password Changed'));

      return done(null, user);
    });
  });
};

module.exports = mongoose.model('User', User);
