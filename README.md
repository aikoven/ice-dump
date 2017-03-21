# Ice Dump [![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Encode and decode ZeroC Ice objects manually into Ice binary format.

## Installation

```bash
npm install ice-dump
```

## Usage

```js
import {objectToBuffer, bufferToObject} from 'ice-dump';

const buffer = objectToBuffer(iceObject, communicator);  // NodeJS buffer

const readIceObject = bufferToObject(buffer, communicator);
```

[npm-image]: https://badge.fury.io/js/ice-dump.svg
[npm-url]: https://badge.fury.io/js/ice-dump
[travis-image]: https://travis-ci.org/aikoven/ice-dump.svg?branch=master
[travis-url]: https://travis-ci.org/aikoven/ice-dump