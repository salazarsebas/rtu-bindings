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
        contractId: "CDXTVXFFK636U55AWKKMZEYV7GCVW6L4EEXY72LNKEFG3SX3QNVOCUYV",
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
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAABU15S2V5AAAA",
            "AAAAAAAAADJDcmVhdGVzIGEgY29udHJhY3QgZW50cnkgaW4gZXZlcnkga2luZCBvZiBzdG9yYWdlLgAAAAAABXNldHVwAAAAAAAAAAAAAAA=",
            "AAAAAAAAAGpFeHRlbmQgdGhlIGluc3RhbmNlIGVudHJ5IFRUTCB0byBiZWNvbWUgYXQgbGVhc3QgMTAwMDAgbGVkZ2VycywKd2hlbiBpdHMgVFRMIGlzIHNtYWxsZXIgdGhhbiAyMDAwIGxlZGdlcnMuAAAAAAAPZXh0ZW5kX2luc3RhbmNlAAAAAAAAAAAA",
            "AAAAAAAAAGpFeHRlbmQgdGhlIHRlbXBvcmFyeSBlbnRyeSBUVEwgdG8gYmVjb21lIGF0IGxlYXN0IDcwMDAgbGVkZ2VycywKd2hlbiBpdHMgVFRMIGlzIHNtYWxsZXIgdGhhbiAzMDAwIGxlZGdlcnMuAAAAAAAQZXh0ZW5kX3RlbXBvcmFyeQAAAAAAAAAA",
            "AAAAAAAAAFtFeHRlbmQgdGhlIHBlcnNpc3RlbnQgZW50cnkgVFRMIHRvIDUwMDAgbGVkZ2Vycywgd2hlbiBpdHMKVFRMIGlzIHNtYWxsZXIgdGhhbiAxMDAwIGxlZGdlcnMuAAAAABFleHRlbmRfcGVyc2lzdGVudAAAAAAAAAAAAAAA"]), options);
        this.options = options;
    }
    fromJSON = {
        setup: (this.txFromJSON),
        extend_instance: (this.txFromJSON),
        extend_temporary: (this.txFromJSON),
        extend_persistent: (this.txFromJSON)
    };
}
