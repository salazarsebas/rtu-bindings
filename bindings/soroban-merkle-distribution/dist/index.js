import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const Errors = {
    1: { message: "AlreadyClaimed" },
    2: { message: "InvalidProof" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { root_hash, token, funding_amount, funding_source }, 
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ root_hash, token, funding_amount, funding_source }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAgAAAAAAAAAOQWxyZWFkeUNsYWltZWQAAAAAAAEAAAAAAAAADEludmFsaWRQcm9vZgAAAAI=",
            "AAAAAAAAAXFDbGFpbSB0b2tlbnMgaWYgdGhlIHJlY2VpdmVyIGlzIHBhcnQgb2YgdGhlIE1lcmtsZSB0cmVlIGRlZmluZWQgYnkgdGhlIHJvb3QgaGFzaC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudC4KKiBgaW5kZXhgIC0gVGhlIGluZGV4IG9mIHRoZSByZWNlaXZlciBpbiB0aGUgb3JpZ2luYWwgbGlzdC4KKiBgcmVjZWl2ZXJgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHJlY2VpdmVyIGNsYWltaW5nIHRoZSB0b2tlbnMuCiogYGFtb3VudGAgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0aGUgcmVjZWl2ZXIgaXMgY2xhaW1pbmcuCiogYHByb29mYCAtIFRoZSBNZXJrbGUgcHJvb2YgKGEgbGlzdCBvZiBzaWJsaW5nIGhhc2hlcykAAAAAAAAFY2xhaW0AAAAAAAAEAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAVwcm9vZgAAAAAAA+oAAAPuAAAAIAAAAAEAAAPpAAAAAgAAAAM=",
            "AAAAAAAAAVtDb25zdHJ1Y3RvciB0byBpbml0aWFsaXplIHRoZSBNZXJrbGUgZGlzdHJpYnV0aW9uIGNvbnRyYWN0LgoKIyBBcmd1bWVudHMKCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudC4KKiBgcm9vdF9oYXNoYCAtIFRoZSByb290IGhhc2ggb2YgdGhlIE1lcmtsZSB0cmVlLgoqIGB0b2tlbmAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgdG9rZW4gdG8gYmUgZGlzdHJpYnV0ZWQuCiogYGZ1bmRpbmdfYW1vdW50YCAtIFRoZSB0b3RhbCBhbW91bnQgb2YgdG9rZW5zIHRvIGZ1bmQgdGhlIGNvbnRyYWN0IHdpdGguCiogYGZ1bmRpbmdfc291cmNlYCAtIFRoZSBhZGRyZXNzIHRoYXQgZnVuZHMgdGhlIGNvbnRyYWN0LgAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAACXJvb3RfaGFzaAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAADmZ1bmRpbmdfYW1vdW50AAAAAAALAAAAAAAAAA5mdW5kaW5nX3NvdXJjZQAAAAAAEwAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        claim: (this.txFromJSON)
    };
}
