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
        contractId: "CBLCP6P73ROWYCIZYUDYCNO3PE6UPFU47HXXFEKZH5J42GAEXS2Y7CAX",
    }
};
export const Errors = {
    1: { message: "Decode" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAQAAAAAAAAAGRGVjb2RlAAAAAAAB",
            "AAAAAAAAAAAAAAAEZXhlYwAAAAEAAAAAAAAABWlucHV0AAAAAAAADgAAAAEAAAPpAAAADgAAAAM="]), options);
        this.options = options;
    }
    fromJSON = {
        exec: (this.txFromJSON)
    };
}
