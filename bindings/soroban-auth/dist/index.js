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
        contractId: "CCOHJ73X2R54KNXX4L232SJMVOCXB7MLU5YD36HD6T76LGWNDEUTZGE5",
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
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAAB0NvdW50ZXIAAAAAAQAAABM=",
            "AAAAAAAAAENJbmNyZW1lbnQgaW5jcmVtZW50cyBhIGNvdW50ZXIgZm9yIHRoZSB1c2VyLCBhbmQgcmV0dXJucyB0aGUgdmFsdWUuAAAAAAlpbmNyZW1lbnQAAAAAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAFdmFsdWUAAAAAAAAEAAAAAQAAAAQ="]), options);
        this.options = options;
    }
    fromJSON = {
        increment: (this.txFromJSON)
    };
}
