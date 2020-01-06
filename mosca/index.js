var mosca = require("mosca");
const axios = require("axios").default;

var ascoltatore = {
  //using ascoltatore
  type: "mongo",
  url: "mongodb://localhost:27017/mqtt",
  pubsubCollection: "ascoltatori",
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on("clientConnected", function(client) {
  console.log("client connected", client.id);
});

// fired when a message is received
server.on("published", function(packet, client) {
  console.log("Published", packet.payload);

  // axios
  //   .post("/user", {
  //     firstName: "Fred",
  //     lastName: "Flintstone"
  //   })
  //   .then(function(response) {
  //     console.log(response);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });
});

server.on("ready", setup);

// fired when the mqtt server is ready
function setup() {
  console.log("Mosca server is up and running");
}
