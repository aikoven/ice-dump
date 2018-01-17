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

  return stream._buf.b.slice(0, stream._buf.limit);
}

function bufferToValue(buffer) {
  var stream = new Ice.InputStream(Ice.Encoding_1_1, new Ice.Buffer(buffer));
  stream._instance = fakeInstance;
  stream._valueFactoryManager = fakeValueFactoryManager;

  stream._buf.resize(buffer.length);

  var object;

  stream.readValue(function(obj) {
    object = obj;
  }, Ice.Value);
  stream.readPendingValues();

  return object;
}
