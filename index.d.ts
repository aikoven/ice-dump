import {Ice} from "ice";

export function valueToBuffer(object: Ice.Value): Uint8Array;

export function bufferToValue<V extends Ice.Value>(buffer: Uint8Array): V;
