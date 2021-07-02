"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.getChecksum = exports.decode = exports.decodeUnsafe = exports.decodeRaw = exports.encode = exports.decodePlain = exports.decodePlainUnsafe = exports.encodePlain = void 0;
const base_1 = require("./base");
Object.defineProperty(exports, "encodePlain", { enumerable: true, get: function () { return base_1.encodePlain; } });
Object.defineProperty(exports, "decodePlainUnsafe", { enumerable: true, get: function () { return base_1.decodePlainUnsafe; } });
Object.defineProperty(exports, "decodePlain", { enumerable: true, get: function () { return base_1.decodePlain; } });
Object.defineProperty(exports, "encode", { enumerable: true, get: function () { return base_1.encode; } });
Object.defineProperty(exports, "decodeRaw", { enumerable: true, get: function () { return base_1.decodeRaw; } });
Object.defineProperty(exports, "decodeUnsafe", { enumerable: true, get: function () { return base_1.decodeUnsafe; } });
Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return base_1.decode; } });
Object.defineProperty(exports, "getChecksum", { enumerable: true, get: function () { return base_1.getChecksum; } });
Object.defineProperty(exports, "utils", { enumerable: true, get: function () { return base_1.utils; } });
base_1.utils.sha256 = async (message) => {
    if (typeof window == "object" && "crypto" in window) {
        const buffer = await window.crypto.subtle.digest("SHA-256", message.buffer);
        return new Uint8Array(buffer);
    }
    else if (typeof process === "object" && "node" in process.versions) {
        const { createHash } = require("crypto");
        const hash = createHash("sha256");
        hash.update(message);
        return Uint8Array.from(hash.digest());
    }
    else {
        throw new Error("The environment doesn't have sha256 function");
    }
};
