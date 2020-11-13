/*! noble-base58check - MIT License (c) Serhii Pashchenko (serh11p.com) */

// https://en.bitcoin.it/wiki/Base58Check_encoding

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE_MAP = new Uint8Array(256);

for (let j = 0; j < BASE_MAP.length; j++) {
  BASE_MAP[j] = 255;
}

for (let i = 0; i < ALPHABET.length; i++) {
  const x = ALPHABET.charAt(i);
  const xc = x.charCodeAt(0);
  BASE_MAP[xc] = i;
}

const BASE = ALPHABET.length;
const LEADER = ALPHABET.charAt(0);
const FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
const iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up

export function encodePlain(source: Uint8Array): string {
  if (!(source instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (source.length === 0) return "";

  // Skip & count leading zeroes.
  let zeroes = 0;
  let length = 0;
  let pbegin = 0;
  const pend = source.length;

  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++;
    zeroes++;
  }

  // Allocate enough space in big-endian base58 representation.
  const size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
  const b58 = new Uint8Array(size);

  // Process the bytes.
  while (pbegin !== pend) {
    let carry = source[pbegin];

    // Apply "b58 = b58 * 256 + ch".
    let i = 0;
    for (
      let it1 = size - 1;
      (carry !== 0 || i < length) && it1 !== -1;
      it1--, i++
    ) {
      carry += (256 * b58[it1]) >>> 0;
      b58[it1] = carry % BASE >>> 0;
      carry = (carry / BASE) >>> 0;
    }

    if (carry !== 0) throw new Error("Non-zero carry");
    length = i;
    pbegin++;
  }

  // Skip leading zeroes in base58 result.
  let it2 = size - length;
  while (it2 !== size && b58[it2] === 0) {
    it2++;
  }

  // Translate the result into a string.
  let str = LEADER.repeat(zeroes);
  for (; it2 < size; ++it2) str += ALPHABET.charAt(b58[it2]);

  return str;
}

export function decodePlainUnsafe(source: string): Uint8Array | undefined {
  if (typeof source !== "string") throw new TypeError("Expected String");
  if (source.length === 0) return new Uint8Array(0);

  let psz = 0;

  // Skip leading spaces.
  if (source[psz] === " ") return;

  // Skip and count leading '1's.
  let zeroes = 0;
  let length = 0;
  while (source[psz] === LEADER) {
    zeroes++;
    psz++;
  }

  // Allocate enough space in big-endian base256 representation.
  const size = ((source.length - psz) * FACTOR + 1) >>> 0; // log(58) / log(256), rounded up.
  const b256 = new Uint8Array(size);

  // Process the characters.
  while (source[psz]) {
    // Decode character
    let carry = BASE_MAP[source.charCodeAt(psz)];

    // Invalid character
    if (carry === 255) return;

    let i = 0;
    for (
      let it3 = size - 1;
      (carry !== 0 || i < length) && it3 !== -1;
      it3--, i++
    ) {
      carry += (BASE * b256[it3]) >>> 0;
      b256[it3] = carry % 256 >>> 0;
      carry = (carry / 256) >>> 0;
    }

    if (carry !== 0) throw new Error("Non-zero carry");
    length = i;
    psz++;
  }

  // Skip trailing spaces.
  if (source[psz] === " ") return;

  // Skip leading zeroes in b256.
  let it4 = size - length;
  while (it4 !== size && b256[it4] === 0) {
    it4++;
  }

  const vch = new Uint8Array(zeroes + (size - it4));
  vch.fill(0x00, 0, zeroes);

  let j = zeroes;
  while (it4 !== size) {
    vch[j++] = b256[it4++];
  }

  return vch;
}

export function decodePlain(string: string): Uint8Array {
  const buffer = decodePlainUnsafe(string);
  if (buffer) return buffer;

  throw new Error("Non base58 character");
}

// Encode a buffer as a base58-check encoded string
export async function encode(payload: Uint8Array) {
  const checksum = await getChecksum(payload);
  const buffer = new Uint8Array(payload.length + 4);
  buffer.set(payload);
  buffer.set(checksum.slice(0, 4), payload.length);
  return encodePlain(new Uint8Array(buffer));
}

export async function decodeRaw(buffer: Uint8Array) {
  const payload = buffer.slice(0, -4);
  const checksum = buffer.slice(-4);
  const newChecksum = await getChecksum(payload);

  if (
    (checksum[0] ^ newChecksum[0]) |
    (checksum[1] ^ newChecksum[1]) |
    (checksum[2] ^ newChecksum[2]) |
    (checksum[3] ^ newChecksum[3])
  )
    return;

  return payload;
}

// Decode a base58-check encoded string to a buffer, no result if checksum is wrong
export async function decodeUnsafe(string: string) {
  const buffer = decodePlainUnsafe(string);
  if (!buffer) return;

  return decodeRaw(buffer);
}

export async function decode(string: string) {
  const buffer = decodePlain(string);
  const payload = await decodeRaw(buffer);
  if (!payload) throw new Error("Invalid checksum");
  return payload;
}

export async function getChecksum(buffer: Uint8Array) {
  return utils.sha256(buffer).then(utils.sha256);
}

export const utils = {
  sha256: async (message: Uint8Array): Promise<Uint8Array> => {
    if (typeof window == "object" && "crypto" in window) {
      const buffer = await window.crypto.subtle.digest(
        "SHA-256",
        message.buffer
      );
      return new Uint8Array(buffer);
    } else if (typeof process === "object" && "node" in process.versions) {
      const { createHash } = require("crypto");
      const hash = createHash("sha256");
      hash.update(message);
      return Uint8Array.from(hash.digest());
    } else {
      throw new Error("The environment doesn't have sha256 function");
    }
  },
};
