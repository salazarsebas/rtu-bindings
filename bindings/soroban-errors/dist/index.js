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
        contractId: "CDEWGBRLXPU6SELOMLH2UDTYONVOKVSS3LP4ZRX3BHI4PCCRS5JJHMNF",
    }
};
export const Errors = {
    1: { message: "LimitReached" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAQAAAAAAAAAMTGltaXRSZWFjaGVkAAAAAQ==",
            "AAAAAAAAAHtJbmNyZW1lbnQgaW5jcmVtZW50cyBhbiBpbnRlcm5hbCBjb3VudGVyLCBhbmQgcmV0dXJucyB0aGUgdmFsdWUuIEVycm9ycwppZiB0aGUgdmFsdWUgaXMgYXR0ZW1wdGVkIHRvIGJlIGluY3JlbWVudGVkIHBhc3QgNS4AAAAACWluY3JlbWVudAAAAAAAAAAAAAABAAAD6QAAAAQAAAAD"]), options);
        this.options = options;
    }
    fromJSON = {
        increment: (this.txFromJSON)
    };
}
