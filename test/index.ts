import * as b58c from "../";

const fixtures = require("./fixtures.json");

describe("valid decodes", () => {
  for (const f of fixtures.valid) {
    it(`decodes ${f.string}`, async () => {
      expect.assertions(2);

      const actual = await b58c.decode(f.string);
      expect(toHex(actual)).toBe(f.payload);

      const actualUnsafe = await b58c.decodeUnsafe(f.string);
      expect(toHex(actualUnsafe!)).toBe(f.payload);
    });
  }
});

describe("invalid decodes", () => {
  for (const f of fixtures.invalid) {
    it(`decode throws on ${f.string}`, async () => {
      expect.assertions(2);

      try {
        await b58c.decode(f.string);
      } catch (err) {
        expect(err).toEqual(new Error(f.exception));
      }

      const actualUnsafe = await b58c.decodeUnsafe(f.string);
      expect(actualUnsafe).toBeUndefined();
    });
  }
});

describe("valid encodes", () => {
  for (const f of fixtures.valid) {
    expect.assertions(1);

    it(`encodes ${f.string}`, async () => {
      const actual = await b58c.encode(fromHex(f.payload));
      expect(actual).toBe(f.string);
    });
  }
});

function toHex(uint8a: Uint8Array) {
  return Array.from(uint8a)
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hash: string) {
  hash = hash.length & 1 ? `0${hash}` : hash;
  const len = hash.length;
  const result = new Uint8Array(len / 2);
  for (let i = 0, j = 0; i < len - 1; i += 2, j++) {
    result[j] = parseInt(hash[i] + hash[i + 1], 16);
  }
  return result;
}
