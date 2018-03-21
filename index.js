const Ice = require('ice/src/Ice/Stream').Ice;
require('ice/src/Ice/Identity');

module.exports.valueToBuffer = valueToBuffer;
module.exports.bufferToValue = bufferToValue;
module.exports.iceToBuffer = iceToBuffer;
module.exports.bufferToIce = bufferToIce;

const defaultsAndOverrides = {
  defaultFormat: Ice.FormatType.CompactFormat,
};

const fakeValueFactoryManager = {
  find: function() {},
};

const fakeInstance = {
  defaultsAndOverrides: function() {
    return defaultsAndOverrides;
  },
};

function createOutputStream() {
  const stream = new Ice.OutputStream(Ice.Encoding_1_1);
  stream._instance = fakeInstance;
  stream._valueFactoryManager = fakeValueFactoryManager;
  return stream;
}

function outputStreamToBuffer(stream) {
  return new Uint8Array(stream._buf.b, 0, stream._buf.limit);
}

function createInputStream(uint8array) {
  const iceBuffer = new Ice.Buffer(uint8array.buffer);
  iceBuffer.limit = uint8array.byteLength + uint8array.byteOffset;
  iceBuffer.position = uint8array.byteOffset;

  const stream = new Ice.InputStream(Ice.Encoding_1_1, iceBuffer);
  stream._instance = fakeInstance;
  stream._valueFactoryManager = fakeValueFactoryManager;

  return stream;
}

function isStructConstructor(constructor) {
  return constructor.prototype.equals === Ice.Identity.prototype.equals;
}

function normalizeType(type) {
  return type.replace(/^::/, '').replace(/::/g, '.');
}

function valueToBuffer(value) {
  const stream = createOutputStream();

  stream.writeValue(value);
  stream.writePendingValues();

  return outputStreamToBuffer(stream);
}

function bufferToValue(uint8array) {
  const stream = createInputStream(uint8array);

  let value;

  stream.readValue(function(obj) {
    value = obj;
  }, Ice.Value);
  stream.readPendingValues();

  return value;
}

function iceToBuffer(iceValue, type) {
  const stream = createOutputStream();

  type = normalizeType(type);

  // sequences and dictionaries are serialized via helper
  const helper = Ice._ModuleRegistry.type(type + 'Helper');

  if (helper != null) {
    helper.write(stream, iceValue);
  } else {
    const iceType = Ice._ModuleRegistry.type(type);

    if (iceType == null) {
      throw new Error('Could not find type ' + type);
    }

    if (iceType.prototype instanceof Ice.Value) {
      stream.writeValue(iceValue);
      stream.writePendingValues();
    } else if (isStructConstructor(iceType)) {
      iceType.write(stream, iceValue);
    } else {
      throw new Error('Unsupported type ' + type);
    }
  }

  return outputStreamToBuffer(stream);
}

function bufferToIce(uint8array, type) {
  const stream = createInputStream(uint8array);

  type = normalizeType(type);

  // sequences and dictionaries are serialized via helper
  const helper = Ice._ModuleRegistry.type(type + 'Helper');

  if (helper != null) {
    return helper.read(stream);
  } else {
    const iceType = Ice._ModuleRegistry.type(type);

    if (iceType == null) {
      throw new Error('Could not find type ' + type);
    }

    if (iceType.prototype instanceof Ice.Value) {
      let value;

      stream.readValue(function(obj) {
        value = obj;
      }, iceType);
      stream.readPendingValues();

      return value;
    } else if (isStructConstructor(iceType)) {
      return iceType.read(stream);
    } else {
      throw new Error('Unsupported type ' + type);
    }
  }
}