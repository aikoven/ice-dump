const test = require('tape');

const {objectToBuffer, bufferToObject} = require('../index');
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

  const buffer = objectToBuffer(obj);

  const readObject = bufferToObject(buffer);

  obj.__address = 0;
  obj.nestedObject.__address = 0;
  readObject.__address = 0;
  readObject.nestedObject.__address = 0;

  assert.deepEquals(obj, readObject);
  assert.end();
});
