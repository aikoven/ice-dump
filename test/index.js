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
  assert.end();
});
