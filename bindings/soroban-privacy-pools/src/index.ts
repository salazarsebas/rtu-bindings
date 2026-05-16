import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export const Errors = {
  1: {message:"NullifierUsed"},
  2: {message:"InsufficientBalance"},
  3: {message:"CoinOwnershipProofFailed"},
  4: {message:"OnlyAdmin"},
  5: {message:"TreeAtCapacity"},
  6: {message:"AssociationRootMismatch"}
}

export const Groth16Error = {
  0: {message:"MalformedVerifyingKey"}
}

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
  deposit: ({from, commitment}: {from: string, commitment: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>

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
  withdraw: ({to, proof_bytes, pub_signals_bytes}: {to: string, proof_bytes: Buffer, pub_signals_bytes: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a get_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets the admin address (the contract deployer)
   * 
   * # Returns
   * 
   * * The address of the admin (contract deployer)
   */
  get_admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets the balance of the configured token held by the contract
   */
  get_balance: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_nullifiers transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_nullifiers: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Buffer>>>

  /**
   * Construct and simulate a get_commitments transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets all commitments (leaves) in the merkle tree
   */
  get_commitments: (options?: MethodOptions) => Promise<AssembledTransaction<Array<Buffer>>>

  /**
   * Construct and simulate a get_merkle_root transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets the current merkle root of the commitment tree
   */
  get_merkle_root: (options?: MethodOptions) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_merkle_depth transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets the current depth of the merkle tree
   */
  get_merkle_depth: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a has_association_set transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Checks if an association set is currently configured
   * 
   * # Returns
   * 
   * * `true` if an association set root is configured, `false` otherwise
   */
  has_association_set: (options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_association_root transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets the current association set root
   * 
   * # Returns
   * 
   * * The current association set root, or zero bytes if not set
   */
  get_association_root: (options?: MethodOptions) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a get_commitment_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Gets the number of commitments (leaves) in the merkle tree
   */
  get_commitment_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

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
  set_association_root: ({caller, association_root}: {caller: string, association_root: Buffer}, options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {vk_bytes, token_address, admin, groth16_verifier}: {vk_bytes: Buffer, token_address: string, admin: string, groth16_verifier: string},
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({vk_bytes, token_address, admin, groth16_verifier}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABgAAAAAAAAANTnVsbGlmaWVyVXNlZAAAAAAAAAEAAAAAAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAAAgAAAAAAAAAYQ29pbk93bmVyc2hpcFByb29mRmFpbGVkAAAAAwAAAAAAAAAJT25seUFkbWluAAAAAAAABAAAAAAAAAAOVHJlZUF0Q2FwYWNpdHkAAAAAAAUAAAAAAAAAF0Fzc29jaWF0aW9uUm9vdE1pc21hdGNoAAAAAAY=",
        "AAAAAAAAA+dEZXBvc2l0cyBmdW5kcyBpbnRvIHRoZSBwcml2YWN5IHBvb2wgYW5kIHN0b3JlcyBhIGNvbW1pdG1lbnQgaW4gdGhlIG1lcmtsZSB0cmVlLgoKVGhpcyBmdW5jdGlvbiBhbGxvd3MgYSB1c2VyIHRvIGRlcG9zaXQgYSBmaXhlZCBhbW91bnQgKDEgWExNKSBvZiB0aGUgY29uZmlndXJlZCB0b2tlbiBpbnRvIHRoZSBwcml2YWN5IHBvb2wKd2hpbGUgcHJvdmlkaW5nIGEgY3J5cHRvZ3JhcGhpYyBjb21taXRtZW50IHRoYXQgd2lsbCBiZSB1c2VkIGZvciB6ZXJvLWtub3dsZWRnZSBwcm9vZgp2ZXJpZmljYXRpb24gZHVyaW5nIHdpdGhkcmF3YWwuCgojIEFyZ3VtZW50cwoKKiBgZW52YCAtIFRoZSBTb3JvYmFuIGVudmlyb25tZW50CiogYGZyb21gIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIGRlcG9zaXRvciAobXVzdCBiZSBhdXRoZW50aWNhdGVkKQoqIGBjb21taXRtZW50YCAtIEEgMzItYnl0ZSBjcnlwdG9ncmFwaGljIGNvbW1pdG1lbnQgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcHJvdmUKb3duZXJzaGlwIGR1cmluZyB3aXRoZHJhd2FsIHdpdGhvdXQgcmV2ZWFsaW5nIHRoZSBhY3R1YWwgY29pbiBkZXRhaWxzCgojIFJldHVybnMKCiogVGhlIGxlYWYgaW5kZXggd2hlcmUgdGhlIGNvbW1pdG1lbnQgd2FzIHN0b3JlZCBpbiB0aGUgbWVya2xlIHRyZWUKCiMgU2VjdXJpdHkKCiogUmVxdWlyZXMgYXV0aGVudGljYXRpb24gZnJvbSB0aGUgYGZyb21gIGFkZHJlc3MKKiBUaGUgY29tbWl0bWVudCBpcyBzdG9yZWQgaW4gYSBtZXJrbGUgdHJlZSBmb3IgZWZmaWNpZW50IGluY2x1c2lvbiBwcm9vZnMKKiBUcmFuc2ZlcnMgZXhhY3RseSBgRklYRURfQU1PVU5UYCBvZiB0aGUgY29uZmlndXJlZCB0b2tlbiBmcm9tIHRoZSBkZXBvc2l0b3IgdG8gdGhlIGNvbnRyYWN0CgojIFN0b3JhZ2UKCiogVXBkYXRlcyB0aGUgbWVya2xlIHRyZWUgd2l0aCB0aGUgbmV3IGNvbW1pdG1lbnQKKiBUcmFuc2ZlcnMgdGhlIGFzc2V0IGZyb20gdGhlIGRlcG9zaXRvciB0byB0aGUgY29udHJhY3QAAAAAB2RlcG9zaXQAAAAAAgAAAAAAAAAEZnJvbQAAABMAAAAAAAAACmNvbW1pdG1lbnQAAAAAA+4AAAAgAAAAAQAAA+kAAAAEAAAAAw==",
        "AAAAAAAABABXaXRoZHJhd3MgZnVuZHMgZnJvbSB0aGUgcHJpdmFjeSBwb29sIHVzaW5nIGEgemVyby1rbm93bGVkZ2UgcHJvb2YuCgpUaGlzIGZ1bmN0aW9uIGFsbG93cyBhIHVzZXIgdG8gd2l0aGRyYXcgYSBmaXhlZCBhbW91bnQgKDEgWExNKSBvZiB0aGUgY29uZmlndXJlZCB0b2tlbiBmcm9tIHRoZSBwcml2YWN5IHBvb2wKYnkgcHJvdmlkaW5nIGEgY3J5cHRvZ3JhcGhpYyBwcm9vZiB0aGF0IGRlbW9uc3RyYXRlcyBvd25lcnNoaXAgb2YgYSBwcmV2aW91c2x5IGRlcG9zaXRlZApjb21taXRtZW50IHdpdGhvdXQgcmV2ZWFsaW5nIHdoaWNoIHNwZWNpZmljIGNvbW1pdG1lbnQgaXQgY29ycmVzcG9uZHMgdG8uCgojIEFyZ3VtZW50cwoKKiBgZW52YCAtIFRoZSBTb3JvYmFuIGVudmlyb25tZW50CiogYHRvYCAtIFRoZSBhZGRyZXNzIG9mIHRoZSByZWNpcGllbnQgKG11c3QgYmUgYXV0aGVudGljYXRlZCkKKiBgcHJvb2ZfYnl0ZXNgIC0gVGhlIHNlcmlhbGl6ZWQgemVyby1rbm93bGVkZ2UgcHJvb2YgZGVtb25zdHJhdGluZyBvd25lcnNoaXAgb2YgYQpjb21taXRtZW50IHdpdGhvdXQgcmV2ZWFsaW5nIHRoZSBjb21taXRtZW50IGl0c2VsZgoqIGBwdWJfc2lnbmFsc19ieXRlc2AgLSBUaGUgc2VyaWFsaXplZCBwdWJsaWMgc2lnbmFscyBhc3NvY2lhdGVkIHdpdGggdGhlIHByb29mCgojIFJldHVybnMKClJldHVybnMgYSB2ZWN0b3IgY29udGFpbmluZyBzdGF0dXMgbWVzc2FnZXM6CiogRW1wdHkgdmVjdG9yIGBbXWAgb24gc3VjY2Vzc2Z1bCB3aXRoZHJhd2FsIChzdWNjZXNzIGlzIGxvZ2dlZCBhcyBhIGRpYWdub3N0aWMgZXZlbnQpCiogYFsiTnVsbGlmaWVyIGFscmVhZHkgdXNlZCJdYCBpZiB0aGUgbnVsbGlmaWVyIGhhcyBiZWVuIHVzZWQgYmVmb3JlCiogYFsiQ291bGRuJ3QgdmVyaWZ5IGNvaW4gb3duZXJzaGlwIHByb29mIl1gIGlmIHRoZSB6ZXJvLWtub3dsZWRnZSBwcm9vZiB2ZXJpZmljYXRpb24gZmFpbHMKKiBgWyJJbnN1ZmZpY2llbnQgYmFsYW5jZSJdYCBpZiB0aGUgY29udHJhY3QgZG9lc24ndCBoAAAACHdpdGhkcmF3AAAAAwAAAAAAAAACdG8AAAAAABMAAAAAAAAAC3Byb29mX2J5dGVzAAAAAA4AAAAAAAAAEXB1Yl9zaWduYWxzX2J5dGVzAAAAAAAADgAAAAEAAAPqAAAAEA==",
        "AAAAAAAAAGlHZXRzIHRoZSBhZG1pbiBhZGRyZXNzICh0aGUgY29udHJhY3QgZGVwbG95ZXIpCgojIFJldHVybnMKCiogVGhlIGFkZHJlc3Mgb2YgdGhlIGFkbWluIChjb250cmFjdCBkZXBsb3llcikAAAAAAAAJZ2V0X2FkbWluAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAD1HZXRzIHRoZSBiYWxhbmNlIG9mIHRoZSBjb25maWd1cmVkIHRva2VuIGhlbGQgYnkgdGhlIGNvbnRyYWN0AAAAAAAAC2dldF9iYWxhbmNlAAAAAAAAAAABAAAACw==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAACHZrX2J5dGVzAAAADgAAAAAAAAANdG9rZW5fYWRkcmVzcwAAAAAAABMAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAQZ3JvdGgxNl92ZXJpZmllcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAOZ2V0X251bGxpZmllcnMAAAAAAAAAAAABAAAD6gAAA+4AAAAg",
        "AAAAAAAAADBHZXRzIGFsbCBjb21taXRtZW50cyAobGVhdmVzKSBpbiB0aGUgbWVya2xlIHRyZWUAAAAPZ2V0X2NvbW1pdG1lbnRzAAAAAAAAAAABAAAD6gAAA+4AAAAg",
        "AAAAAAAAADNHZXRzIHRoZSBjdXJyZW50IG1lcmtsZSByb290IG9mIHRoZSBjb21taXRtZW50IHRyZWUAAAAAD2dldF9tZXJrbGVfcm9vdAAAAAAAAAAAAQAAA+4AAAAg",
        "AAAAAAAAAClHZXRzIHRoZSBjdXJyZW50IGRlcHRoIG9mIHRoZSBtZXJrbGUgdHJlZQAAAAAAABBnZXRfbWVya2xlX2RlcHRoAAAAAAAAAAEAAAAE",
        "AAAAAAAAAIVDaGVja3MgaWYgYW4gYXNzb2NpYXRpb24gc2V0IGlzIGN1cnJlbnRseSBjb25maWd1cmVkCgojIFJldHVybnMKCiogYHRydWVgIGlmIGFuIGFzc29jaWF0aW9uIHNldCByb290IGlzIGNvbmZpZ3VyZWQsIGBmYWxzZWAgb3RoZXJ3aXNlAAAAAAAAE2hhc19hc3NvY2lhdGlvbl9zZXQAAAAAAAAAAAEAAAAB",
        "AAAAAAAAAG5HZXRzIHRoZSBjdXJyZW50IGFzc29jaWF0aW9uIHNldCByb290CgojIFJldHVybnMKCiogVGhlIGN1cnJlbnQgYXNzb2NpYXRpb24gc2V0IHJvb3QsIG9yIHplcm8gYnl0ZXMgaWYgbm90IHNldAAAAAAAFGdldF9hc3NvY2lhdGlvbl9yb290AAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAADpHZXRzIHRoZSBudW1iZXIgb2YgY29tbWl0bWVudHMgKGxlYXZlcykgaW4gdGhlIG1lcmtsZSB0cmVlAAAAAAAUZ2V0X2NvbW1pdG1lbnRfY291bnQAAAAAAAAAAQAAAAQ=",
        "AAAAAAAAAvJTZXRzIHRoZSBhc3NvY2lhdGlvbiBzZXQgcm9vdCBmb3IgY29tcGxpYW5jZSB2ZXJpZmljYXRpb24KClRoaXMgZnVuY3Rpb24gYWxsb3dzIHRoZSBhZG1pbiB0byB1cGRhdGUgdGhlIGFzc29jaWF0aW9uIHNldCByb290LAp3aGljaCBpcyB1c2VkIHRvIHZlcmlmeSB0aGF0IHdpdGhkcmF3YWxzIGFyZSBhc3NvY2lhdGVkIHdpdGggYXBwcm92ZWQKc3Vic2V0cyBvZiBkZXBvc2l0cyBmb3IgY29tcGxpYW5jZSBwdXJwb3Nlcy4KCiMgQXJndW1lbnRzCgoqIGBlbnZgIC0gVGhlIFNvcm9iYW4gZW52aXJvbm1lbnQKKiBgY2FsbGVyYCAtIFRoZSBhZGRyZXNzIG9mIHRoZSBjYWxsZXIgKG11c3QgYmUgYXV0aGVudGljYXRlZCBhbmQgYmUgdGhlIGFkbWluKQoqIGBhc3NvY2lhdGlvbl9yb290YCAtIFRoZSBuZXcgYXNzb2NpYXRpb24gc2V0IHJvb3QgKDMyLWJ5dGUgaGFzaCkKCiMgUmV0dXJucwoKUmV0dXJucyBhIHZlY3RvciBjb250YWluaW5nIHN0YXR1cyBtZXNzYWdlczoKKiBgWyJBc3NvY2lhdGlvbiByb290IHNldCBzdWNjZXNzZnVsbHkiXWAgb24gc3VjY2Vzc2Z1bCB1cGRhdGUKKiBgWyJPbmx5IHRoZSBhZG1pbiBjYW4gc2V0IGFzc29jaWF0aW9uIHJvb3QiXWAgaWYgdGhlIGNhbGxlciBpcyBub3QgdGhlIGFkbWluCgojIFNlY3VyaXR5CgoqIFJlcXVpcmVzIGF1dGhlbnRpY2F0aW9uIGZyb20gdGhlIGNhbGxlcgoqIE9ubHkgdGhlIGNvbnRyYWN0IGRlcGxveWVyIChhZG1pbikgY2FuIHVwZGF0ZSBhc3NvY2lhdGlvbiBzZXRzAAAAAAAUc2V0X2Fzc29jaWF0aW9uX3Jvb3QAAAACAAAAAAAAAAZjYWxsZXIAAAAAABMAAAAAAAAAEGFzc29jaWF0aW9uX3Jvb3QAAAPuAAAAIAAAAAEAAAPqAAAAEA==",
        "AAAABAAAAAAAAAAAAAAADEdyb3RoMTZFcnJvcgAAAAEAAAAAAAAAFU1hbGZvcm1lZFZlcmlmeWluZ0tleQAAAAAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    deposit: this.txFromJSON<Result<u32>>,
        withdraw: this.txFromJSON<Array<string>>,
        get_admin: this.txFromJSON<string>,
        get_balance: this.txFromJSON<i128>,
        get_nullifiers: this.txFromJSON<Array<Buffer>>,
        get_commitments: this.txFromJSON<Array<Buffer>>,
        get_merkle_root: this.txFromJSON<Buffer>,
        get_merkle_depth: this.txFromJSON<u32>,
        has_association_set: this.txFromJSON<boolean>,
        get_association_root: this.txFromJSON<Buffer>,
        get_commitment_count: this.txFromJSON<u32>,
        set_association_root: this.txFromJSON<Array<string>>
  }
}