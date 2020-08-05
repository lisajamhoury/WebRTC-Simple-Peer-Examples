const io = require('socket.io-client');
const socket = io.connect('http://localhost:80');

const room = 'foo'; // Could prompt for room name: // room = prompt('Enter room name:');
const socketClient = require('./socketClient.js');
socketClient.initSocketClient(room, socket);

let localVideo = document.querySelector('#localVideo');
let remoteVideo = document.querySelector('#remoteVideo');
let localStream;

/////////////////// getUserMedia starts video and starts Simple Peer on Connection  ///////////////////

navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: true,
  })
  .then(gotStream)
  .catch(function (e) {
    alert('getUserMedia() error: ' + e.name);
  });

function gotStream(stream) {
  console.log('Adding local stream.');
  localStream = stream;
  localVideo.srcObject = stream;
  socketClient.sendMessage('got user media');
  if (socketClient.isInitiator) {
    socketClient.maybeStart();
  }
}
