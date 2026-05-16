import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const AccError = {
    1: { message: "NotEnoughSigners" },
    2: { message: "NegativeAmount" },
    3: { message: "BadSignatureOrder" },
    4: { message: "UnknownSigner" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { signers }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ signers }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAACEFjY0Vycm9yAAAABAAAAAAAAAAQTm90RW5vdWdoU2lnbmVycwAAAAEAAAAAAAAADk5lZ2F0aXZlQW1vdW50AAAAAAACAAAAAAAAABFCYWRTaWduYXR1cmVPcmRlcgAAAAAAAAMAAAAAAAAADVVua25vd25TaWduZXIAAAAAAAAE",
            "AAAAAQAAAAAAAAAAAAAADEFjY1NpZ25hdHVyZQAAAAIAAAAAAAAACnB1YmxpY19rZXkAAAAAA+4AAAAgAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQA==",
            "AAAAAAAAAAAAAAAJYWRkX2xpbWl0AAAAAAAAAgAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAVsaW1pdAAAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAD6gAAB9AAAAAMQWNjU2lnbmF0dXJlAAAAAAAAAAxhdXRoX2NvbnRleHQAAAPqAAAH0AAAAAdDb250ZXh0AAAAAAEAAAPpAAAAAgAAB9AAAAAIQWNjRXJyb3I=",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAAB3NpZ25lcnMAAAAD6gAAA+4AAAAgAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        add_limit: (this.txFromJSON)
    };
}
