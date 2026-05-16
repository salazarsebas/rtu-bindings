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
        contractId: "CDJWUNQYC3OLXEQK2RLHG6I36VHNDH3NYZV2MW5Q6EYSLICNISMAV3YS",
    }
};
export const Groth16Error = {
    0: { message: "MalformedVerifyingKey" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABVByb29mAAAAAAAAAwAAAAAAAAABYQAAAAAAA+4AAABgAAAAAAAAAAFiAAAAAAAD7gAAAMAAAAAAAAAAAWMAAAAAAAPuAAAAYA==",
            "AAAABAAAAAAAAAAAAAAADEdyb3RoMTZFcnJvcgAAAAEAAAAAAAAAFU1hbGZvcm1lZFZlcmlmeWluZ0tleQAAAAAAAAA=",
            "AAAAAQAAAAAAAAAAAAAAD1ZlcmlmaWNhdGlvbktleQAAAAAFAAAAAAAAAAVhbHBoYQAAAAAAA+4AAABgAAAAAAAAAARiZXRhAAAD7gAAAMAAAAAAAAAABWRlbHRhAAAAAAAD7gAAAMAAAAAAAAAABWdhbW1hAAAAAAAD7gAAAMAAAAAAAAAAAmljAAAAAAPqAAAD7gAAAGA=",
            "AAAAAAAAAAAAAAAMdmVyaWZ5X3Byb29mAAAAAwAAAAAAAAACdmsAAAAAB9AAAAAPVmVyaWZpY2F0aW9uS2V5AAAAAAAAAAAFcHJvb2YAAAAAAAfQAAAABVByb29mAAAAAAAAAAAAAAtwdWJfc2lnbmFscwAAAAPqAAAADAAAAAEAAAPpAAAAAQAAB9AAAAAMR3JvdGgxNkVycm9y"]), options);
        this.options = options;
    }
    fromJSON = {
        verify_proof: (this.txFromJSON)
    };
}
