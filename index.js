var Ice = require('ice').Ice;

module.exports.objectToBuffer = objectToBuffer;
module.exports.bufferToObject = bufferToObject;

function objectToBuffer(object, communicator) {
  var stream = new Ice.BasicStream(
    communicator._instance,
    Ice.Protocol.currentProtocolEncoding
  );

  stream.writeObject(object);
  stream.writePendingObjects();

  return stream._buf.b;
}

function bufferToObject(buffer, communicator) {
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