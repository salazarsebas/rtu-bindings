import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CDXTVXFFK636U55AWKKMZEYV7GCVW6L4EEXY72LNKEFG3SX3QNVOCUYV";
    };
};
export type DataKey = {
    tag: "MyKey";
    values: void;
};
export interface Client {
    /**
     * Construct and simulate a setup transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Creates a contract entry in every kind of storage.
     */
    setup: (options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a extend_instance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Extend the instance entry TTL to become at least 10000 ledgers,
     * when its TTL is smaller than 2000 ledgers.
     */
    extend_instance: (options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a extend_temporary transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Extend the temporary entry TTL to become at least 7000 ledgers,
     * when its TTL is smaller than 3000 ledgers.
     */
    extend_temporary: (options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a extend_persistent transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Extend the persistent entry TTL to 5000 ledgers, when its
     * TTL is smaller than 1000 ledgers.
     */
    extend_persistent: (options?: MethodOptions) => Promise<AssembledTransaction<null>>;
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
        setup: (json: string) => AssembledTransaction<null>;
        extend_instance: (json: string) => AssembledTransaction<null>;
        extend_temporary: (json: string) => AssembledTransaction<null>;
        extend_persistent: (json: string) => AssembledTransaction<null>;
    };
}
