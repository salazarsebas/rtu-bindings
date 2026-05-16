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
        contractId: "CAZS3KV5LTPO6FJRKONJFE6CQX4US6NLXKOHJDW3QYFX5ERLSHIV6YRE",
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
        super(new ContractSpec(["AAAAAAAAAAAAAAAEc3dhcAAAAAgAAAAAAAAAAWEAAAAAAAATAAAAAAAAAAFiAAAAAAAAEwAAAAAAAAAHdG9rZW5fYQAAAAATAAAAAAAAAAd0b2tlbl9iAAAAABMAAAAAAAAACGFtb3VudF9hAAAACwAAAAAAAAALbWluX2JfZm9yX2EAAAAACwAAAAAAAAAIYW1vdW50X2IAAAALAAAAAAAAAAttaW5fYV9mb3JfYgAAAAALAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        swap: (this.txFromJSON)
    };
}
