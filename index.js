var Ice = require('ice/src/Ice/Stream').Ice;

module.exports.valueToBuffer = valueToBuffer;
module.exports.bufferToValue = bufferToValue;

var defaultsAndOverrides = {
  defaultFormat: Ice.FormatType.CompactFormat,
};

var fakeValueFactoryManager = {
  find: function() {},
};

var fakeInstance = {
  defaultsAndOverrides: function() {
    return defaultsAndOverrides;
  },
};

function valueToBuffer(object) {
  var stream = new Ice.OutputStream(Ice.Encoding_1_1);
  stream._instance = fakeInstance;
  stream._valueFactoryManager = fakeValueFactoryManager;

  stream.writeValue(object);
  stream.writePendingValues();

  return new Uint8Array(stream._buf.b, 0, stream._buf.limit);
}

function bufferToValue(uint8array) {
  var iceBuffer = new Ice.Buffer(uint8array.buffer);
  iceBuffer.limit = uint8array.byteLength + uint8array.byteOffset;
  iceBuffer.position = uint8array.byteOffset;

  var stream = new Ice.InputStream(Ice.Encoding_1_1, iceBuffer);
  stream._instance = fakeInstance;
  stream._valueFactoryManager = fakeValueFactoryManager;

  var object;

  stream.readValue(function(obj) {
    object = obj;
  }, Ice.Value);
  stream.readPendingValues();

  return object;
}
