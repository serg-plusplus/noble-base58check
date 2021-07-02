/*! noble-base58check - MIT License (c) Serhii Pashchenko (serh11p.com) */
export declare function encodePlain(source: Uint8Array): string;
export declare function decodePlainUnsafe(source: string): Uint8Array | undefined;
export declare function decodePlain(string: string): Uint8Array;
export declare function encode(payload: Uint8Array): Promise<string>;
export declare function decodeRaw(buffer: Uint8Array): Promise<Uint8Array | undefined>;
export declare function decodeUnsafe(string: string): Promise<Uint8Array | undefined>;
export declare function decode(string: string): Promise<Uint8Array>;
export declare function getChecksum(buffer: Uint8Array): Promise<Uint8Array>;
export declare const utils: {
    sha256: (_message: Uint8Array) => Promise<Uint8Array>;
};
