import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CD5GI7C5YAYJB6IP4KS75RAA7WGGLEHSW462NDX7WY5DDQP4FSMXHDQN";
    };
};
export type DataKey = {
    tag: "Init";
    values: void;
} | {
    tag: "Balance";
    values: void;
};
export interface TimeBound {
    kind: TimeBoundKind;
    timestamp: u64;
}
export type TimeBoundKind = {
    tag: "Before";
    values: void;
} | {
    tag: "After";
    values: void;
};
export interface ClaimableBalance {
    amount: i128;
    claimants: Array<string>;
    time_bound: TimeBound;
    token: string;
}
export interface Client {
    /**
     * Construct and simulate a claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    claim: ({ claimant, amount }: {
        claimant: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    deposit: ({ from, token, amount, claimants, time_bound }: {
        from: string;
        token: string;
        amount: i128;
        claimants: Array<string>;
        time_bound: TimeBound;
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
        claim: (json: string) => AssembledTransaction<null>;
        deposit: (json: string) => AssembledTransaction<null>;
    };
}
