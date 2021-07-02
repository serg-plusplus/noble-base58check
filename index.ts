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
} from "./base";

utils.sha256 = async (message: Uint8Array): Promise<Uint8Array> => {
  if (typeof window == "object" && "crypto" in window) {
    const buffer = await window.crypto.subtle.digest("SHA-256", message.buffer);
    return new Uint8Array(buffer);
  } else if (typeof process === "object" && "node" in process.versions) {
    const { createHash } = require("crypto");
    const hash = createHash("sha256");
    hash.update(message);
    return Uint8Array.from(hash.digest());
  } else {
    throw new Error("The environment doesn't have sha256 function");
  }
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
