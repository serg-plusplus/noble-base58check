# noble-base58check ![Node CI](https://github.com/serh11p/noble-base58check/workflows/Node%20CI/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

[Base58Check](https://en.bitcoin.it/wiki/Base58Check_encoding), a modified Base 58 binary-to-text encoding known as Base58Check is used for encoding Bitcoin addresses. More generically, Base58Check encoding is used for encoding byte arrays in Bitcoin into human-typable strings.

Port of [bs58check](https://www.npmjs.com/package/bs58check) module.

## Usage

Node:

> npm install noble-base58check

```js
import * as b58c from "noble-base58check";

const hash = "1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i";
(async () => {
  const bytes = await b58c.decode(hash);
  const sameHash = await b58c.encode(bytes);
  assert.strictEqual(sameHash, hash);
})();
```

Deno:

```typescript
import { assertEquals } from "https://deno.land/x/testing/asserts.ts";
import * as b58c from "https://deno.land/x/base58check/mod.ts";

const hash = "1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i";
const bytes = await b58c.decode(hash);
const sameHash = await b58c.encode(bytes);
assertEquals(sameHash, hash);
```

## API

- [`encode(payload)`](#encodepayload)
- [`decode(string)`](#decodestring)
- [`decodeUnsafe(string)`](#decodeunsafestring)
- [`decodeRaw(buffer)`](#decoderawbuffer)
- [`getChecksum(buffer)`](#getchecksumbuffer)
- [`encodePlain(payload)`](#encodeplainpayload)
- [`decodePlain(string)`](#decodeplainstring)
- [`decodePlainUnsafe(string)`](#decodeplainunsafestring)

##### `encode(payload)`

```typescript
function encode(payload: Uint8Array): Promise<string>;
```

##### `decode(string)`

```typescript
function decode(string: string): Promise<Uint8Array>;
```

##### `decodeUnsafe(string)`

```typescript
function decodeUnsafe(string: string): Promise<Uint8Array | undefined>;
```

##### `decodeRaw(buffer)`

```typescript
function decodeRaw(buffer: Uint8Array): Promise<Uint8Array | undefined>;
```

##### `getChecksum(buffer)`

```typescript
function getChecksum(buffer: Uint8Array): Promise<Uint8Array>;
```

##### `encodePlain(payload)`

```typescript
function encodePlain(payload: Uint8Array): Promise<string>;
```

##### `decodePlain(string)`

```typescript
function decodePlain(string: string): Promise<Uint8Array>;
```

##### `decodePlainUnsafe(string)`

```typescript
function decodePlainUnsafe(string: string): Promise<Uint8Array | undefined>;
```

## Inspiration

- [bs58check](https://github.com/bitcoinjs/bs58check)
- **noble-crypto** libraries by [Paul Miller](https://github.com/paulmillr):
  [secp256k1](https://github.com/paulmillr/noble-secp256k1),
  [ed25519](https://github.com/paulmillr/noble-ed25519),
  [bls12-381](https://github.com/paulmillr/noble-bls12-381),
  [ripemd160](https://github.com/paulmillr/noble-ripemd160)

## Contributing

1. Clone the repository.
2. `npm install` to install build dependencies like TypeScript
3. `npm run compile` to compile TypeScript code
4. `npm run test` to run jest on `test/index.ts`

## License

MIT (c) Serhii Pashchenko [(https://serh11p.com)](https://serh11p.com), see LICENSE file.
