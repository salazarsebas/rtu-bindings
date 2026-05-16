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
        contractId: "CBXXCCYARKZ2JMODKSDNDVLAUA32D43PXA2WDCW6PK4NCVBCRESQ4YXN",
    }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { value }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ value }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAFdmFsdWUAAAAAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABXZhbHVlAAAAAAAABAAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        value: (this.txFromJSON)
    };
}
