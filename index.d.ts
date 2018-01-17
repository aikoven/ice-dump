import {Ice} from "ice";

export function valueToBuffer(object: Ice.Value): Buffer;

export function bufferToValue<V extends Ice.Value>(buffer: Buffer): V;
