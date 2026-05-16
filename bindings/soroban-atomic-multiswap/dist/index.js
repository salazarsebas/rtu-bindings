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
        contractId: "CA6LG6ZIUYCWRZTYU3LQG4KYYFETV55B7LJZB7PBC5P65J3E5G5E3T7U",
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
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAACFN3YXBTcGVjAAAAAwAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACG1pbl9yZWN2AAAACw==",
            "AAAAAAAAAAAAAAAKbXVsdGlfc3dhcAAAAAAABQAAAAAAAAANc3dhcF9jb250cmFjdAAAAAAAABMAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAAAAAAAdzd2Fwc19hAAAAA+oAAAfQAAAACFN3YXBTcGVjAAAAAAAAAAdzd2Fwc19iAAAAA+oAAAfQAAAACFN3YXBTcGVjAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        multi_swap: (this.txFromJSON)
    };
}
