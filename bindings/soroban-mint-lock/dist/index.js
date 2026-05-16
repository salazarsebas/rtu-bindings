import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBU6EKQOP5XPZMIR5CXFDNR2OGTSAKDNP2T722HU4YWWRXWNP4OUIJIG",
    }
};
export const Errors = {
    1: { message: "NotAuthorizedMinter" },
    2: { message: "DailyLimitInsufficient" },
    3: { message: "NegativeAmount" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ admin }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAATTm90QXV0aG9yaXplZE1pbnRlcgAAAAABAAAAAAAAABZEYWlseUxpbWl0SW5zdWZmaWNpZW50AAAAAAACAAAAAAAAAA5OZWdhdGl2ZUFtb3VudAAAAAAAAw==",
            "AAAAAAAAAJxDYWxscyB0aGUgJ21pbnQnIGZ1bmN0aW9uIG9mIHRoZSAnY29udHJhY3QnIHdpdGggJ3RvJyBhbmQgJ2Ftb3VudCcuCkF1dGhvcml6ZWQgYnkgdGhlICdtaW50ZXInLiBVc2VzIHNvbWUgb2YgdGhlIGF1dGhvcml6ZWQgJ21pbnRlcidzCmN1cnJlbnQgZXBvY2gncyBsaW1pdC4AAAAEbWludAAAAAQAAAAAAAAACGNvbnRyYWN0AAAAEwAAAAAAAAAGbWludGVyAAAAAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+kAAAACAAAAAw==",
            "AAAAAAAAABlSZXR1cm4gdGhlIGFkbWluIGFkZHJlc3MuAAAAAAAABWFkbWluAAAAAAAAAAAAAAEAAAAT",
            "AAAAAAAAAEpSZXR1cm5zIHRoZSBjb25maWcsIGN1cnJlbnQgZXBvY2gsIGFuZCBjdXJyZW50IGVwb2NoJ3Mgc3RhdHMgZm9yIGEKbWludGVyLgAAAAAABm1pbnRlcgAAAAAAAgAAAAAAAAAIY29udHJhY3QAAAATAAAAAAAAAAZtaW50ZXIAAAAAABMAAAABAAAD6QAAA+0AAAADAAAH0AAAAAxNaW50ZXJDb25maWcAAAAEAAAH0AAAAAtNaW50ZXJTdGF0cwAAAAAD",
            "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAMAAAAAAAAAG0FkbWluLiBWYWx1ZSBpcyBhbiBBZGRyZXNzLgAAAAAFQWRtaW4AAAAAAAABAAAAV01pbnRlcnMgYXJlIHN0b3JlZCBrZXllZCBieSB0aGUgY29udHJhY3QgYW5kIG1pbnRlciBhZGRyZXNzZXMuIFZhbHVlIGlzCmEgTWludGVyQ29uZmlnLgAAAAAGTWludGVyAAAAAAACAAAAEwAAABMAAAABAAAAu01pbnRlciBzdGF0cyBhcmUgc3RvcmVkIGtleWVkIGJ5IGNvbnRyYWN0IGFuZCBtaW50ZXIgYWRkcmVzc2VzLCBlcG9jaApsZW5ndGgsIGFuZCBlcG9jaCwgd2hpY2ggaXMgdGhlIGxlZGdlciBudW1iZXIgZGl2aWRlZCBieSB0aGUgbnVtYmVyIG9mCmxlZGdlcnMgaW4gdGhlIGVwb2NoLiAgVmFsdWUgaXMgYSBNaW50ZXJTdGF0cy4AAAAAC01pbnRlclN0YXRzAAAAAAQAAAATAAAAEwAAAAQAAAAE",
            "AAAAAAAAAA5TZXQgdGhlIGFkbWluLgAAAAAACXNldF9hZG1pbgAAAAAAAAEAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
            "AAAAAQAAAAAAAAAAAAAAC01pbnRlclN0YXRzAAAAAAEAAAAAAAAADmNvbnN1bWVkX2xpbWl0AAAAAAAL",
            "AAAAAAAAAFBTZXQgdGhlIGNvbmZpZyBvZiBhIG1pbnRlciBmb3IgdGhlIGdpdmVuIGNvbnRyYWN0LiBSZXF1aXJlcyBhdXRoIGZyb20KdGhlIGFkbWluLgAAAApzZXRfbWludGVyAAAAAAADAAAAAAAAAAhjb250cmFjdAAAABMAAAAAAAAABm1pbnRlcgAAAAAAEwAAAAAAAAAGY29uZmlnAAAAAAfQAAAADE1pbnRlckNvbmZpZwAAAAA=",
            "AAAAAQAAAAAAAAAAAAAADE1pbnRlckNvbmZpZwAAAAIAAAAAAAAADGVwb2NoX2xlbmd0aAAAAAQAAAAAAAAABWxpbWl0AAAAAAAACw==",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        mint: (this.txFromJSON),
        admin: (this.txFromJSON),
        minter: (this.txFromJSON),
        set_admin: (this.txFromJSON),
        set_minter: (this.txFromJSON)
    };
}
