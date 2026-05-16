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
        contractId: "CAYHFWCJDGL2WEMJI4SLEYCAZHSFEMT2REOSMYVKV5Z2KAEZKN3UPA4X",
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
        super(new ContractSpec(["AAAAAAAAAAAAAAAGY2FsbF9iAAAAAAACAAAAAAAAABJjb250cmFjdF9iX2FkZHJlc3MAAAAAABMAAAAAAAAAEmNvbnRyYWN0X2NfYWRkcmVzcwAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAPYXV0aG9yaXplZF9mbl9iAAAAAAIAAAAAAAAACmF1dGhvcml6ZXIAAAAAABMAAAAAAAAAEmNvbnRyYWN0X2NfYWRkcmVzcwAAAAAAEwAAAAA=",
            "AAAAAAAAAAAAAAAPYXV0aG9yaXplZF9mbl9jAAAAAAEAAAAAAAAACmF1dGhvcml6ZXIAAAAAABMAAAAA"]), options);
        this.options = options;
    }
    fromJSON = {
        call_b: (this.txFromJSON),
        authorized_fn_b: (this.txFromJSON),
        authorized_fn_c: (this.txFromJSON)
    };
}
