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
        contractId: "CDEQV2C3QTYZSTPOWZXCQY7KVJK4V2TJJZBT3EQWP7XJ3OQ6JHVQAU3L",
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
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABEluaXQAAAAAAAAAAAAAAAdCYWxhbmNlAA==",
            "AAAAAQAAAAAAAAAAAAAACVRpbWVCb3VuZAAAAAAAAAIAAAAAAAAABGtpbmQAAAfQAAAADVRpbWVCb3VuZEtpbmQAAAAAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
            "AAAAAgAAAAAAAAAAAAAADVRpbWVCb3VuZEtpbmQAAAAAAAACAAAAAAAAAAAAAAAGQmVmb3JlAAAAAAAAAAAAAAAAAAVBZnRlcgAAAA==",
            "AAAAAQAAAAAAAAAAAAAAEENsYWltYWJsZUJhbGFuY2UAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACWNsYWltYW50cwAAAAAAA+oAAAATAAAAAAAAAAp0aW1lX2JvdW5kAAAAAAfQAAAACVRpbWVCb3VuZAAAAAAAAAAAAAAFdG9rZW4AAAAAAAAT",
            "AAAAAAAAAAAAAAAFY2xhaW0AAAAAAAABAAAAAAAAAAhjbGFpbWFudAAAABMAAAAA",
            "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAAFAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACWNsYWltYW50cwAAAAAAA+oAAAATAAAAAAAAAAp0aW1lX2JvdW5kAAAAAAfQAAAACVRpbWVCb3VuZAAAAAAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        claim: (this.txFromJSON),
        deposit: (this.txFromJSON)
    };
}
