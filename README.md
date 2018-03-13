# Ice Dump [![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

Encode and decode ZeroC Ice values manually into Ice binary format.

## Installation

```bash
npm install ice-dump
```

## Usage

```js
import {valueToBuffer, bufferToValue} from 'ice-dump';

const buffer = valueToBuffer(iceValue);  // Uint8Array

const iceValue = bufferToValue(buffer);
```

[npm-image]: https://badge.fury.io/js/ice-dump.svg
[npm-url]: https://badge.fury.io/js/ice-dump
[travis-image]: https://travis-ci.org/aikoven/ice-dump.svg?branch=master
[travis-url]: https://travis-ci.org/aikoven/ice-dump