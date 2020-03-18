# Ice Dump [![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Encode and decode ZeroC Ice values manually into Ice binary format.

## Installation

```bash
npm install ice-dump
```

## Usage

Serializing instances of Ice.Value:

```js
import {valueToBuffer, bufferToValue} from 'ice-dump';

const buffer = valueToBuffer(iceValue); // Uint8Array

const readValue = bufferToValue(buffer);
```

Using Sliced format:

```js
import {Ice} from 'ice';

const buffer = valueToBuffer(iceValue, Ice.FormatType.SlicedFormat);
```

If you need to deal with proxies, pass `Communicator` as a second parameter to
`bufferToValue`.

To serialize structs, sequences or dictionaries you must provide Ice type name
in form `MyModule.MySeq` or `::MyModule::MySeq`:

```js
import {iceToBuffer, bufferToIce} from 'ice-dump';

const buffer = iceToBuffer(sequence, 'MyModule.MySeq'); // Uint8Array

const readSequence = bufferToIce(buffer, 'MyModule.MySeq');
```

[npm-image]: https://badge.fury.io/js/ice-dump.svg
[npm-url]: https://badge.fury.io/js/ice-dump
[travis-image]: https://travis-ci.org/aikoven/ice-dump.svg?branch=master
[travis-url]: https://travis-ci.org/aikoven/ice-dump
