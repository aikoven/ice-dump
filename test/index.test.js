const {Ice} = require('ice');
const _ = require('lodash');

const {
  valueToBuffer,
  bufferToValue,
  iceToBuffer,
  bufferToIce
} = require('../index');
const {Test} = require('./Test');

test('any value', () => {
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
  expect(obj).toEqual(readObject);

  const shiftedBuffer = new Uint8Array(buffer.length + 8).fill(1);
  shiftedBuffer.set(buffer, 4);

  const shiftedReadObject = bufferToValue(
    shiftedBuffer.subarray(4, buffer.length + 4)
  );
  expect(obj).toEqual(shiftedReadObject);
});

test('value', () => {
  const obj = new Test.TestObj(
    42,
    new Test.SomeStruct(true),
    'foo',
    ['bar', 'baz'],
    new Test.Base(24),
    new Test.SomeStruct(true),
    [1, 2, 3]
  );

  const buffer = iceToBuffer(obj, 'Test.TestObj');

  const readObject = bufferToIce(buffer, 'Test.TestObj');
  expect(obj).toEqual(readObject);
});

test('struct', () => {
  const struct = new Test.SomeStruct(true);

  const buffer = iceToBuffer(struct, 'Test.SomeStruct');

  const readStruct = bufferToIce(buffer, 'Test.SomeStruct');
  expect(struct).toEqual(readStruct);
});

test('value sequence', () => {
  const obj1 = new Test.Base(42);
  const obj2 = new Test.Base(24, new Test.SomeStruct(true));

  const seq = [obj1, obj1, obj2];

  const buffer = iceToBuffer(seq, 'Test.BaseSeq');

  const readSeq = bufferToIce(buffer, 'Test.BaseSeq');
  expect(seq).toEqual(readSeq);
});

test('struct sequence', () => {
  const seq = [new Test.SomeStruct(true), new Test.SomeStruct(false)];

  const buffer = iceToBuffer(seq, 'Test.SomeStructSeq');

  const readSeq = bufferToIce(buffer, 'Test.SomeStructSeq');
  expect(seq).toEqual(readSeq);
});

test('simple dictionary', () => {
  const dict = new Map();
  dict.set('lol', new Test.SomeStruct(true));
  dict.set('kek', new Test.SomeStruct(false));

  const buffer = iceToBuffer(dict, 'Test.SimpleDict');

  const readDict = bufferToIce(buffer, 'Test.SimpleDict');
  expect(dict).toEqual(readDict);
});

test('complex dictionary', () => {
  const dict = new Ice.HashMap();
  dict.set(new Test.SomeStruct(true), new Test.Base(42));
  dict.set(new Test.SomeStruct(false), new Test.Base(24));

  const buffer = iceToBuffer(dict, 'Test.ComplexDict');

  const readDict = bufferToIce(buffer, 'Test.ComplexDict');
  expect(dict.equals(readDict, _.isEqual)).toBe(true);
});

test('proxies', () => {
  const communicator = Ice.initialize();
  const routerPrx = communicator.stringToProxy(
    'Test/Router:tcp -h 1.2.3.4 -p 5678'
  );
  const instance = new Test.ClassWithProxy(routerPrx);

  const buffer = valueToBuffer(instance);
  const readInstance = bufferToValue(buffer, communicator);

  expect(readInstance.router.equals(instance.router)).toBe(true);
});
