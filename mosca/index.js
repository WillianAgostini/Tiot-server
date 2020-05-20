var mosca = require('mosca');
const axios = require('axios').default;
var http = require('http');
var httpServ = http.createServer();

var ascoltatore = {
  // using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {port: 1883, backend: ascoltatore};

var server = new mosca.Server(settings);
server.attachHttpServer(httpServ);
httpServ.listen(3001);

server.on('clientConnected', function(client) {
  // console.log("client connected", client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  if (!client) return;

  if (packet.topic.endsWith('min') || packet.topic.endsWith('max') ||
      packet.topic.endsWith('action') || packet.topic.endsWith('status'))
    return;


  let payload = String(packet.payload);
  let topic = packet.topic;
  console.log(topic, payload);


  if (packet.topic.endsWith('ip')) {
    let url = 'http://localhost:3000/device/' + topic + '/' + payload
    axios.put(url, {})
        .then(function(response) {
          console.log(response.status);
        })
        .catch(function(error) {
          console.log(error);
        });

  } else {
    let data = {payload: payload, deviceName: topic};

    axios.post('http://localhost:3000/packet', data)
        .then(function(response) {
          console.log(response.status);
        })
        .catch(function(error) {
          console.log(error);
        });
  }
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}
