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
    1: { message: "InvalidSignature" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { agg_pk }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ agg_pk }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABk93bmVycwAAAAAAAAAAAAAAAAAHQ291bnRlcgAAAAAAAAAAAAAAAANEc3QA",
            "AAAABAAAAAAAAAAAAAAACEFjY0Vycm9yAAAAAQAAAAAAAAAQSW52YWxpZFNpZ25hdHVyZQAAAAE=",
            "AAAAAAAAAAAAAAAJaW5jcmVtZW50AAAAAAAAAAAAAAEAAAAE",
            "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAHYWdnX3NpZwAAAAPuAAAAwAAAAAAAAAANYXV0aF9jb250ZXh0cwAAAAAAA+oAAAfQAAAAB0NvbnRleHQAAAAAAQAAA+kAAAACAAAH0AAAAAhBY2NFcnJvcg==",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABmFnZ19wawAAAAAD7gAAAGAAAAAA"]), options);
        this.options = options;
    }
    fromJSON = {
        increment: (this.txFromJSON)
    };
}
