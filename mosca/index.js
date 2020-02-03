var mosca = require("mosca");
const axios = require("axios").default;
var http = require("http");
var httpServ = http.createServer();

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
server.attachHttpServer(httpServ);
httpServ.listen(8080);

server.on("clientConnected", function(client) {
  // console.log("client connected", client.id);
});

// fired when a message is received
server.on("published", function(packet, client) {
  // console.log("Published", packet);

  if (!client) return;

  let payload = String(packet.payload);
  let topic = packet.topic.split("/");
  console.log(topic);

  let data = {
    payload: payload,
    deviceName: topic[1]
  };

  axios
    .post("http://localhost:3000/packet", data)
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
});

server.on("ready", setup);

// fired when the mqtt server is ready
function setup() {
  console.log("Mosca server is up and running");
}
