var mosca = require("mosca");
// const MongoClient = require('mongodb').MongoClient;
const Message = require("./models/message");
const User = require("./models/user");
const Client = require("./models/client");

const mongoose = require("mongoose");
let urlMongoDB = "mongodb://localhost:27017/user";

var SECURE_KEY = __dirname + "/tls-key.pem";
var SECURE_CERT = __dirname + "/tls-cert.pem";

var moscaSetting = {
  interfaces: [
    { type: "mqtt", port: 1883 },
    // { type: "mqtts", port: 8883, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } },
    { type: "http", port: 3000, bundle: true }
    //{ type: "https", port: 3001, bundle: true, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } }
  ],
  stats: false,
  //   onQoS2publish: 'noack', // can set to 'disconnect', or to 'dropToQoS1' if using a client which will eat puback for QOS 2; e.g. mqtt.js
  //    logger: { name: 'MoscaServer', level: 'debug' },
  persistence: {
    factory: mosca.persistence.Mongo,
    url: urlMongoDB + "mosca"
  }
};

var authenticate = function(client, username, password, callback) {
  console.log("auth");
  if (username == "test" && password.toString() == "test") callback(null, true);
  else callback(null, false);
};

var authorizePublish = function(client, topic, payload, callback) {
  var auth = true;
  // set auth to :
  //  true to allow
  //  false to deny and disconnect
  //  'ignore' to puback but not publish msg.
  callback(null, auth);
};

var authorizeSubscribe = function(client, topic, callback) {
  var auth = true;
  // set auth to :
  //  true to allow
  //  false to deny
  callback(null, auth);
};

var server = new mosca.Server(moscaSetting);
//mongoose.connect(urlMongoDB, { useNewUrlParser: true });
mongoose.set("useFindAndModify", true);
mongoose.set("useCreateIndex", true);
mongoose
  .connect(urlMongoDB, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

server.on("ready", setup);

function setup() {
  // server.authenticate = authenticate;
  server.authorizePublish = authorizePublish;
  server.authorizeSubscribe = authorizeSubscribe;

  console.log("Mosca server is up and running.");
}

server.on("error", function(err) {
  console.log(err);
});

server.on("clientConnected", function(client) {
  console.log("Client Connected \t:= ", client.id);
});

server.on("published", function(packet, client) {
  console.log("Published :=", packet);
  if (!client) return;

  let message = new Message();
  let clientRef = new Client();
  Object.assign(message, packet);
  Object.assign(clientRef, client);

  message
    .save()
    .then(x => {
      clientRef
        .save()
        .then(y => {
          User.find({ deviceNames: packet.topic })
            //User.find({ username: "willian_agostini" })
            .exec()
            .then(user => {
              user[0].message.push(message);
              user[0].client.push(clientRef);
              //user[0].deviceNames.push(packet.topic);
              user[0].save();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));

  server.on("subscribed", function(topic, client) {
    console.log("Subscribed :=", client.packet);
  });

  server.on("unsubscribed", function(topic, client) {
    console.log("unsubscribed := ", topic);
  });

  server.on("clientDisconnecting", function(client) {
    console.log("clientDisconnecting := ", client.id);
  });

  server.on("clientDisconnected", function(client) {
    console.log("Client Disconnected     := ", client.id);
  });
});
