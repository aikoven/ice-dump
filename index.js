const Ice = require('ice/src/Ice/Stream').Ice;
require('ice/src/Ice/Identity');

module.exports.valueToBuffer = valueToBuffer;
module.exports.bufferToValue = bufferToValue;
module.exports.iceToBuffer = iceToBuffer;
module.exports.bufferToIce = bufferToIce;

const fakeValueFactoryManager = {
  find: function() {},
};

function createFakeInstance(format) {
  const defaultsAndOverrides = {
    defaultFormat: format || Ice.FormatType.CompactFormat,
  };

  return {
    defaultsAndOverrides: function() {
      return defaultsAndOverrides;
    },
  };
}

function createOutputStream(format) {
  const stream = new Ice.OutputStream(Ice.Encoding_1_1);
  stream._instance = createFakeInstance(format);
  stream._valueFactoryManager = fakeValueFactoryManager;
  return stream;
}

function outputStreamToBuffer(stream) {
  return new Uint8Array(stream._buf.b, 0, stream._buf.limit);
}

function createInputStream(uint8array, communicator) {
  const iceBuffer = new Ice.Buffer(uint8array.buffer);
  iceBuffer.limit = uint8array.byteLength + uint8array.byteOffset;
  iceBuffer.position = uint8array.byteOffset;

  const stream = new Ice.InputStream(Ice.Encoding_1_1, iceBuffer);
  stream._instance = communicator ? communicator._instance : createFakeInstance();
  stream._valueFactoryManager = communicator
    ? communicator._instance._initData.valueFactoryManager
    : fakeValueFactoryManager;

  return stream;
}

function isStructConstructor(constructor) {
  return constructor.prototype.equals === Ice.Identity.prototype.equals;
}

function normalizeType(type) {
  return type.replace(/^::/, '').replace(/::/g, '.');
}

function valueToBuffer(value, format) {
  const stream = createOutputStream(format);

  stream.writeValue(value);
  stream.writePendingValues();

  return outputStreamToBuffer(stream);
}

function bufferToValue(uint8array, communicator) {
  const stream = createInputStream(uint8array, communicator);

  let value;

  stream.readValue(function(obj) {
    value = obj;
  }, Ice.Value);
  stream.readPendingValues();

  return value;
}

function iceToBuffer(iceValue, type, format) {
  const stream = createOutputStream(format);

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

function bufferToIce(uint8array, type, communicator) {
  const stream = createInputStream(uint8array, communicator);

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
