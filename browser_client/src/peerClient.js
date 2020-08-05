let started = false;

const createPeerConnection = function (Peer, isInit) {
  console.log('creating simple peer');
  const peer = new Peer({
    initiator: isInit,
    stream: localStream,
  });

  started = true;

  // If isInitiator,peer.on'signal' will fire right away, if not it waits for signal
  // https://github.com/feross/simple-peer#peeronsignal-data--
  peer.on('signal', (data) => sendSignal(data));
  peer.on('connect', (data) => logConnection(data));
  peer.on('stream', (stream) => handleStream(stream));
  peer.on('error', (err) => handleError(err));
  peer.on('close', (peer) => handleClose(peer));
};

const startSignal = function (data) {
  peer.signal(message.data);
};

const sendSignal = function (data) {
  console.log('sending signal');

  sendMessage({
    type: 'sending signal',
    data: JSON.stringify(data),
  });
};

const logConnection = function (data) {
  console.log('SIMPLE PEER IS CONNECTED', data);
};

const handleStream = function (stream) {
  remoteVideo.srcObject = stream;
};

const handleError = function (err) {
  console.log(err);
};

const handleClose = function (peer) {
  console.log('Hanging up.');
  stopPeerConnection(peer);
  sendMessage('bye'); // this deoesn't do anything right now
};

const handleRemoteHangup = function (peer) {
  console.log('Session terminated.');
  stopPeerConnection(peer);
  isInitiator = false;
};

const stopPeerConnection = function (peer) {
  started = false;
  peer.destroy();
  peer = null;
};

const isStarted = function () {
  return started;
};

module.exports = {
  createPeerConnection: createPeerConnection,
  isStarted: isStarted,
};
