import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CBHL4CHK67TS4ZQVOKKMR243X5QNNQSLSUDPBCZ2B76MWNV6GDC5T7WX";
    };
};
export interface Offer {
    buy_price: u32;
    buy_token: string;
    sell_price: u32;
    sell_token: string;
    seller: string;
}
export type DataKey = {
    tag: "Offer";
    values: void;
};
export interface Client {
    /**
     * Construct and simulate a trade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    trade: ({ buyer, buy_token_amount, min_sell_token_amount }: {
        buyer: string;
        buy_token_amount: i128;
        min_sell_token_amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a create transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    create: ({ seller, sell_token, buy_token, sell_price, buy_price }: {
        seller: string;
        sell_token: string;
        buy_token: string;
        sell_price: u32;
        buy_price: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    withdraw: ({ token, amount }: {
        token: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_offer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_offer: (options?: MethodOptions) => Promise<AssembledTransaction<Offer>>;
    /**
     * Construct and simulate a updt_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    updt_price: ({ sell_price, buy_price }: {
        sell_price: u32;
        buy_price: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        trade: (json: string) => AssembledTransaction<null>;
        create: (json: string) => AssembledTransaction<null>;
        withdraw: (json: string) => AssembledTransaction<null>;
        get_offer: (json: string) => AssembledTransaction<Offer>;
        updt_price: (json: string) => AssembledTransaction<null>;
    };
}
