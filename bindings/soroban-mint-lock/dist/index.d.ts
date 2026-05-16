import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions, Result } from "@stellar/stellar-sdk/contract";
import type { u32, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CBU6EKQOP5XPZMIR5CXFDNR2OGTSAKDNP2T722HU4YWWRXWNP4OUIJIG";
    };
};
export declare const Errors: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
};
export type StorageKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "Minter";
    values: readonly [string, string];
} | {
    tag: "MinterStats";
    values: readonly [string, string, u32, u32];
};
export interface MinterStats {
    consumed_limit: i128;
}
export interface MinterConfig {
    epoch_length: u32;
    limit: i128;
}
export interface Client {
    /**
     * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Calls the 'mint' function of the 'contract' with 'to' and 'amount'.
     * Authorized by the 'minter'. Uses some of the authorized 'minter's
     * current epoch's limit.
     */
    mint: ({ contract, minter, to, amount }: {
        contract: string;
        minter: string;
        to: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>;
    /**
     * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Return the admin address.
     */
    admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Returns the config, current epoch, and current epoch's stats for a
     * minter.
     */
    minter: ({ contract, minter }: {
        contract: string;
        minter: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<readonly [MinterConfig, u32, MinterStats]>>>;
    /**
     * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Set the admin.
     */
    set_admin: ({ new_admin }: {
        new_admin: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a set_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Set the config of a minter for the given contract. Requires auth from
     * the admin.
     */
    set_minter: ({ contract, minter, config }: {
        contract: string;
        minter: string;
        config: MinterConfig;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin }: {
        admin: string;
    }, 
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
        mint: (json: string) => AssembledTransaction<Result<void, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        admin: (json: string) => AssembledTransaction<string>;
        minter: (json: string) => AssembledTransaction<Result<readonly [MinterConfig, number, MinterStats], import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        set_admin: (json: string) => AssembledTransaction<null>;
        set_minter: (json: string) => AssembledTransaction<null>;
    };
}
