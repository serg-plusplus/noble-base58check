import {
  encodePlain,
  decodePlainUnsafe,
  decodePlain,
  encode,
  decodeRaw,
  decodeUnsafe,
  decode,
  getChecksum,
  utils,
} from "./index.ts";
import { SHA256 } from "https://denopkg.com/chiefbiiko/sha256/mod.ts";

utils.sha256 = async (message: Uint8Array): Promise<Uint8Array> => {
  return new SHA256().update(message).digest() as Uint8Array;
};

export {
  encodePlain,
  decodePlainUnsafe,
  decodePlain,
  encode,
  decodeRaw,
  decodeUnsafe,
  decode,
  getChecksum,
  utils,
};
