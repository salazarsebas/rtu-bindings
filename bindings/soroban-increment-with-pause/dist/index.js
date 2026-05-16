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
        contractId: "CBZVJFMJ66IMXIGNA5XVVAJ4FTA6BLIVDHAPLCRMGMRGCS4BQXF2TKA5",
    }
};
export const Errors = {
    1: { message: "Paused" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { pause }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ pause }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAQAAAAAAAAAGUGF1c2VkAAAAAAAB",
            "AAAAAAAAAEBJbmNyZW1lbnQgaW5jcmVtZW50cyBhbiBpbnRlcm5hbCBjb3VudGVyLCBhbmQgcmV0dXJucyB0aGUgdmFsdWUuAAAACWluY3JlbWVudAAAAAAAAAAAAAABAAAD6QAAAAQAAAAD",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABXBhdXNlAAAAAAAAEwAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        increment: (this.txFromJSON)
    };
}
