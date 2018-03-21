import {Ice} from 'ice';

export function valueToBuffer(value: Ice.Value): Uint8Array;

export function bufferToValue<V extends Ice.Value>(buffer: Uint8Array): V;

export type IcePrimitive = string | number | boolean;
export interface IceSimpleDictionary
  extends Map<IcePrimitive, IcePrimitive | IceValue> {}
export interface IceComplexDictionary
  extends Ice.HashMap<Ice.HashMapKey, IcePrimitive | IceValue> {}
export type IceDictionary = IceSimpleDictionary | IceComplexDictionary;
export interface IceSequence extends Array<IcePrimitive | IceValue> {}

export type IceValue = Ice.Value | Ice.Struct | IceDictionary | IceSequence;

export function iceToBuffer(value: IceValue, type: string): Uint8Array;
export function bufferToIce<V extends IceValue>(
  buffer: Uint8Array,
  type: string,
): V;
