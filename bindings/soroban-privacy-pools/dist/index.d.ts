import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions, Result } from "@stellar/stellar-sdk/contract";
import type { u32, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
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
    4: {
        message: string;
    };
    5: {
        message: string;
    };
    6: {
        message: string;
    };
};
export declare const Groth16Error: {
    0: {
        message: string;
    };
};
export interface Client {
    /**
     * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Deposits funds into the privacy pool and stores a commitment in the merkle tree.
     *
     * This function allows a user to deposit a fixed amount (1 XLM) of the configured token into the privacy pool
     * while providing a cryptographic commitment that will be used for zero-knowledge proof
     * verification during withdrawal.
     *
     * # Arguments
     *
     * * `env` - The Soroban environment
     * * `from` - The address of the depositor (must be authenticated)
     * * `commitment` - A 32-byte cryptographic commitment that will be used to prove
     * ownership during withdrawal without revealing the actual coin details
     *
     * # Returns
     *
     * * The leaf index where the commitment was stored in the merkle tree
     *
     * # Security
     *
     * * Requires authentication from the `from` address
     * * The commitment is stored in a merkle tree for efficient inclusion proofs
     * * Transfers exactly `FIXED_AMOUNT` of the configured token from the depositor to the contract
     *
     * # Storage
     *
     * * Updates the merkle tree with the new commitment
     * * Transfers the asset from the depositor to the contract
     */
    deposit: ({ from, commitment }: {
        from: string;
        commitment: Buffer;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>;
    /**
     * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Withdraws funds from the privacy pool using a zero-knowledge proof.
     *
     * This function allows a user to withdraw a fixed amount (1 XLM) of the configured token from the privacy pool
     * by providing a cryptographic proof that demonstrates ownership of a previously deposited
     * commitment without revealing which specific commitment it corresponds to.
     *
     * # Arguments
     *
     * * `env` - The Soroban environment
     * * `to` - The address of the recipient (must be authenticated)
     * * `proof_bytes` - The serialized zero-knowledge proof demonstrating ownership of a
     * commitment without revealing the commitment itself
     * * `pub_signals_bytes` - The serialized public signals associated with the proof
     *
     * # Returns
     *
     * Returns a vector containing status messages:
     * * Empty vector `[]` on successful withdrawal (success is logged as a diagnostic event)
     * * `["Nullifier already used"]` if the nullifier has been used before
     * * `["Couldn't verify coin ownership proof"]` if the zero-knowledge proof verification fails
     * * `["Insufficient balance"]` if the contract doesn't h
     */
    withdraw: ({ to, proof_bytes, pub_signals_bytes }: {
        to: string;
        proof_bytes: Buffer;
        pub_signals_bytes: Buffer;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>;
    /**
     * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the admin address (the contract deployer)
     *
     * # Returns
     *
     * * The address of the admin (contract deployer)
     */
    get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a get_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the balance of the configured token held by the contract
     */
    get_balance: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a get_nullifiers transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_nullifiers: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Buffer>>>;
    /**
     * Construct and simulate a get_commitments transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets all commitments (leaves) in the merkle tree
     */
    get_commitments: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Buffer>>>;
    /**
     * Construct and simulate a get_merkle_root transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the current merkle root of the commitment tree
     */
    get_merkle_root: (options?: MethodOptions) => Promise<AssembledTransaction<Buffer>>;
    /**
     * Construct and simulate a get_merkle_depth transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the current depth of the merkle tree
     */
    get_merkle_depth: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a has_association_set transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Checks if an association set is currently configured
     *
     * # Returns
     *
     * * `true` if an association set root is configured, `false` otherwise
     */
    has_association_set: (options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a get_association_root transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the current association set root
     *
     * # Returns
     *
     * * The current association set root, or zero bytes if not set
     */
    get_association_root: (options?: MethodOptions) => Promise<AssembledTransaction<Buffer>>;
    /**
     * Construct and simulate a get_commitment_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the number of commitments (leaves) in the merkle tree
     */
    get_commitment_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a set_association_root transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Sets the association set root for compliance verification
     *
     * This function allows the admin to update the association set root,
     * which is used to verify that withdrawals are associated with approved
     * subsets of deposits for compliance purposes.
     *
     * # Arguments
     *
     * * `env` - The Soroban environment
     * * `caller` - The address of the caller (must be authenticated and be the admin)
     * * `association_root` - The new association set root (32-byte hash)
     *
     * # Returns
     *
     * Returns a vector containing status messages:
     * * `["Association root set successfully"]` on successful update
     * * `["Only the admin can set association root"]` if the caller is not the admin
     *
     * # Security
     *
     * * Requires authentication from the caller
     * * Only the contract deployer (admin) can update association sets
     */
    set_association_root: ({ caller, association_root }: {
        caller: string;
        association_root: Buffer;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { vk_bytes, token_address, admin, groth16_verifier }: {
        vk_bytes: Buffer;
        token_address: string;
        admin: string;
        groth16_verifier: string;
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
        deposit: (json: string) => AssembledTransaction<Result<number, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
        withdraw: (json: string) => AssembledTransaction<string[]>;
        get_admin: (json: string) => AssembledTransaction<string>;
        get_balance: (json: string) => AssembledTransaction<bigint>;
        get_nullifiers: (json: string) => AssembledTransaction<Buffer[]>;
        get_commitments: (json: string) => AssembledTransaction<Buffer[]>;
        get_merkle_root: (json: string) => AssembledTransaction<Buffer>;
        get_merkle_depth: (json: string) => AssembledTransaction<number>;
        has_association_set: (json: string) => AssembledTransaction<boolean>;
        get_association_root: (json: string) => AssembledTransaction<Buffer>;
        get_commitment_count: (json: string) => AssembledTransaction<number>;
        set_association_root: (json: string) => AssembledTransaction<string[]>;
    };
}
