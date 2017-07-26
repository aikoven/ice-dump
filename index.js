var Ice = require('ice/src/Ice/BasicStream').Ice;
var trimEnd = require('buffertrim').trimEnd;

module.exports.objectToBuffer = objectToBuffer;
module.exports.bufferToObject = bufferToObject;

var defaultsAndOverrides = {
  defaultFormat: Ice.FormatType.CompactFormat
};

var objectFactoryManager = {
  find: function() {}
};

var dummyInstance = {
  defaultsAndOverrides: function () {
    return defaultsAndOverrides;
  },

  servantFactoryManager: function() {
    return objectFactoryManager;
  }
};

function objectToBuffer(object) {
  var stream = new Ice.BasicStream(
    dummyInstance,
    Ice.Encoding_1_1
  );

  stream.writeObject(object);
  stream.writePendingObjects();

  return trimEnd(stream._buf.b);
}

function bufferToObject(buffer) {
  var stream = new Ice.BasicStream(
    dummyInstance,
    Ice.Encoding_1_1,
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
