import {Ice} from "ice";

export function objectToBuffer(object: Ice.Object,
                               communicator?: Ice.Communicator): Buffer;

export function bufferToObject(buffer: Buffer,
                               communicator?: Ice.Communicator): Ice.Object;
