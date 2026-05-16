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
        contractId: "CACTGA64NNSP2I6U4WAKT2WIA6HFPKZJY2DG7GO6IAATX6NPJWPM46LV",
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
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAACU1vY2tQcm9vZgAAAAAAAAIAAAAAAAAAAmcxAAAAAAPuAAAAQAAAAAAAAAACZzIAAAAAA+4AAACA",
            "AAAAAAAAAAAAAAALbW9ja192ZXJpZnkAAAAAAQAAAAAAAAAFcHJvb2YAAAAAAAfQAAAACU1vY2tQcm9vZgAAAAAAAAEAAAAB"]), options);
        this.options = options;
    }
    fromJSON = {
        mock_verify: (this.txFromJSON)
    };
}
