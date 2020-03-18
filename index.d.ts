import {Ice} from 'ice';

export function valueToBuffer(value: Ice.Value, format?: Ice.FormatType): Uint8Array;

export function bufferToValue<V extends Ice.Value>(
  buffer: Uint8Array,
  communicator?: Ice.Communicator,
): V;

export type IcePrimitive = string | number | boolean;
export interface IceSimpleDictionary
  extends Map<IcePrimitive, IcePrimitive | Ice.EnumBase<string> | IceValue> {}
export interface IceComplexDictionary
  extends Ice.HashMap<
    Ice.HashMapKey,
    IcePrimitive | Ice.EnumBase<string> | IceValue
  > {}
export type IceDictionary = IceSimpleDictionary | IceComplexDictionary;
export interface IceSequence
  extends Array<IcePrimitive | Ice.EnumBase<string> | IceValue> {}

export type IceValue = Ice.Value | Ice.Struct | IceDictionary | IceSequence;

export function iceToBuffer(value: IceValue, type: string, format?: Ice.FormatType): Uint8Array;
export function bufferToIce<V extends IceValue>(
  buffer: Uint8Array,
  type: string,
  communicator?: Ice.Communicator,
): V;
