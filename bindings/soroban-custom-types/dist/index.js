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
        contractId: "CBVRBMD7ZVSAX36IFCFS4OOZA23D6FKU2NVAZGPXII4MKUNSMQD2M5BV",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABVN0YXRlAAAAAAAAAgAAAAAAAAAFY291bnQAAAAAAAAEAAAAAAAAAAlsYXN0X2luY3IAAAAAAAAE",
            "AAAAAAAAABlSZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUuAAAAAAAACWdldF9zdGF0ZQAAAAAAAAAAAAABAAAH0AAAAAVTdGF0ZQAAAA==",
            "AAAAAAAAAEBJbmNyZW1lbnQgaW5jcmVtZW50cyBhbiBpbnRlcm5hbCBjb3VudGVyLCBhbmQgcmV0dXJucyB0aGUgdmFsdWUuAAAACWluY3JlbWVudAAAAAAAAAEAAAAAAAAABGluY3IAAAAEAAAAAQAAAAQ="]), options);
        this.options = options;
    }
    fromJSON = {
        get_state: (this.txFromJSON),
        increment: (this.txFromJSON)
    };
}
