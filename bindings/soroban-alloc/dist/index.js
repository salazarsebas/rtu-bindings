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
        contractId: "CA6V2ZCAQDGFZHE2ABMAFWCC6EE27RIPLTZ64UOTG6N5LXKILK2OC5KG",
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
        super(new ContractSpec(["AAAAAAAAAFxBbGxvY2F0ZXMgYSB0ZW1wb3JhcnkgdmVjdG9yIGhvbGRpbmcgdmFsdWVzICgwLi5jb3VudCksIHRoZW4gY29tcHV0ZXMgYW5kIHJldHVybnMgdGhlaXIgc3VtLgAAAANzdW0AAAAAAQAAAAAAAAAFY291bnQAAAAAAAAEAAAAAQAAAAQ="]), options);
        this.options = options;
    }
    fromJSON = {
        sum: (this.txFromJSON)
    };
}
