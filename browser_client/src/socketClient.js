/////////////////// Client Signal Server Using Socket IO ///////////////////
// starts socket client communication with signal server automatically
const Peer = require('simple-peer');
const peerClient = require('./peerClient.js');

let channelReady = false;
let initiator = false;

const initSocketClient = function (room, socket) {
  // create a room
  socket.on('created', (room) => handleCreated(room));

  // room only holds two clients, can be changed in signal_socket.js
  socket.on('full', (room) => handleFull(room));

  // called by initiator client only
  socket.on('join', (room) => handleJoin(room));

  // called by non-initiator client only
  socket.on('joined', (room) => handleJoined(room));

  // log messages from server
  socket.on('log', (array) => logServerMessage(array));

  // handle messages received by client
  socket.on('message', (message) => handleMessage(message));

  // can I put this here ?
  window.onbeforeunload = initClose();

  // start the connection
  createOrJoinRoom(room);
};

// this initiaties the connection
const createOrJoinRoom = function (room) {
  if (room !== '') {
    socket.emit('create or join', room);
    console.log('Attempted to create or join room', room);
  }
};

const handleCreated = function (room) {
  console.log('Created room ' + room);
  initiator = true;
};

const handleFull = function (room) {
  console.log('Room ' + room + ' is full');
};

const handleJoin = function (room) {
  console.log('Another peer made a request to join room ' + room);
  console.log('This peer is the initiator of room ' + room + '!');
  channelReady = true;
};

const handleJoined = function (room) {
  console.log('joined: ' + room);
  channelReady = true;
};

const logServerMessage = function (array) {
  console.log.apply(console, array);
};

const handleMessage = function (message) {
  console.log('MESSAGE', message);

  if (message.type) {
    console.log('received msg typ ', message.type);
  } else {
    console.log('Client received message:', message);
  }

  if (message === 'got user media') {
    maybeStart();
  } else if (message.type === 'sending signal') {
    console.log('receiving simple signal data');

    if (!peerClient.isStarted()) {
      peerClient.createPeerConnection(Peer, initiator);
      peerClient.startSignal(message.data);
      //peer.signal(message.data);
    } else {
      peerClient.startSignal(message.data);
      //   peer.signal(message.data);
    }
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  }
};

const sendMessage = function (message) {
  console.log('Client sending message: ', message);
  socket.emit('message', message);
};

const initClose = function () {
  sendMessage('bye');
};

const maybeStart = function () {
  console.log(
    '>>>>>>> maybeStart() ',
    peerClient.isStarted(),
    localStream,
    channelReady,
  );
  if (
    !peerClient.isStarted() &&
    typeof localStream !== 'undefined' &&
    channelReady
  ) {
    console.log('>>>>>> creating peer connection');
    console.log('isInitiator', initiator);

    peerClient.createPeerConnection(Peer, initiator);
  }
};

const isChannelReady = function () {
  return channelReady;
};

const isInitiator = function () {
  return initiator;
};

module.exports = {
  initSocketClient: initSocketClient,
  sendMessage: sendMessage,
  maybeStart: maybeStart,
  isChannelReady: isChannelReady,
  isInitiator: isInitiator,
};
