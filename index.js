var Ice = require('ice').Ice;

module.exports.objectToBuffer = objectToBuffer;
module.exports.bufferToObject = bufferToObject;

var defaultCommunicator;

function getDefaultCommunicator() {
  return defaultCommunicator || (defaultCommunicator = Ice.initialize());
}

function objectToBuffer(object, communicator) {
  if (communicator == null)
    communicator = getDefaultCommunicator();

  var stream = new Ice.BasicStream(
    communicator._instance,
    Ice.Protocol.currentProtocolEncoding
  );

  stream.writeObject(object);
  stream.writePendingObjects();

  return stream._buf.b;
}

function bufferToObject(buffer, communicator) {
  if (communicator == null)
    communicator = getDefaultCommunicator();

  var stream = new Ice.BasicStream(
    communicator._instance,
    Ice.Protocol.currentProtocolEncoding,
    buffer
  );

  stream._buf.resize(buffer.length);

  var object;

  stream.readObject(function (obj) {
    object = obj;
  }, Ice.Object);
  stream.readPendingObjects();

  return object;
}
