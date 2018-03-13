const test = require('tape');

const {valueToBuffer, bufferToValue} = require('../index');
const {Test} = require('./Test');

test('dump', assert => {
  const obj = new Test.TestObj(
    42,
    new Test.SomeStruct(true),
    'foo',
    ['bar', 'baz'],
    new Test.Base(24),
    new Test.SomeStruct(true),
    [1, 2, 3]
  );

  const buffer = valueToBuffer(obj);

  const readObject = bufferToValue(buffer);
  assert.deepEquals(obj, readObject);

  const shiftedBuffer = new Uint8Array(buffer.length + 8).fill(1);
  shiftedBuffer.set(buffer, 4);

  const shiftedReadObject = bufferToValue(
    shiftedBuffer.subarray(4, buffer.length + 4)
  );
  assert.deepEquals(obj, shiftedReadObject);

  assert.end();
});
