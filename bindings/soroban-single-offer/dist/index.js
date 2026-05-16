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
        contractId: "CBHL4CHK67TS4ZQVOKKMR243X5QNNQSLSUDPBCZ2B76MWNV6GDC5T7WX",
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
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAABU9mZmVyAAAAAAAABQAAAAAAAAAJYnV5X3ByaWNlAAAAAAAABAAAAAAAAAAJYnV5X3Rva2VuAAAAAAAAEwAAAAAAAAAKc2VsbF9wcmljZQAAAAAABAAAAAAAAAAKc2VsbF90b2tlbgAAAAAAEwAAAAAAAAAGc2VsbGVyAAAAAAAT",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAABU9mZmVyAAAA",
            "AAAAAAAAAAAAAAAFdHJhZGUAAAAAAAADAAAAAAAAAAVidXllcgAAAAAAABMAAAAAAAAAEGJ1eV90b2tlbl9hbW91bnQAAAALAAAAAAAAABVtaW5fc2VsbF90b2tlbl9hbW91bnQAAAAAAAALAAAAAA==",
            "AAAAAAAAAAAAAAAGY3JlYXRlAAAAAAAFAAAAAAAAAAZzZWxsZXIAAAAAABMAAAAAAAAACnNlbGxfdG9rZW4AAAAAABMAAAAAAAAACWJ1eV90b2tlbgAAAAAAABMAAAAAAAAACnNlbGxfcHJpY2UAAAAAAAQAAAAAAAAACWJ1eV9wcmljZQAAAAAAAAQAAAAA",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAACAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAAAAAAAJZ2V0X29mZmVyAAAAAAAAAAAAAAEAAAfQAAAABU9mZmVyAAAA",
            "AAAAAAAAAAAAAAAKdXBkdF9wcmljZQAAAAAAAgAAAAAAAAAKc2VsbF9wcmljZQAAAAAABAAAAAAAAAAJYnV5X3ByaWNlAAAAAAAABAAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        trade: (this.txFromJSON),
        create: (this.txFromJSON),
        withdraw: (this.txFromJSON),
        get_offer: (this.txFromJSON),
        updt_price: (this.txFromJSON)
    };
}
