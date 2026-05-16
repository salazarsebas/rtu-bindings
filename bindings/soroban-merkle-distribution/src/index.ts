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
  1: {message:"AlreadyClaimed"},
  2: {message:"InvalidProof"}
}

export interface Client {
  /**
   * Construct and simulate a claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Claim tokens if the receiver is part of the Merkle tree defined by the root hash.
   * 
   * # Arguments
   * * `env` - The Soroban environment.
   * * `index` - The index of the receiver in the original list.
   * * `receiver` - The address of the receiver claiming the tokens.
   * * `amount` - The amount of tokens the receiver is claiming.
   * * `proof` - The Merkle proof (a list of sibling hashes)
   */
  claim: ({index, receiver, amount, proof}: {index: u32, receiver: string, amount: i128, proof: Array<Buffer>}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {root_hash, token, funding_amount, funding_source}: {root_hash: Buffer, token: string, funding_amount: i128, funding_source: string},
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
    return ContractClient.deploy({root_hash, token, funding_amount, funding_source}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAgAAAAAAAAAOQWxyZWFkeUNsYWltZWQAAAAAAAEAAAAAAAAADEludmFsaWRQcm9vZgAAAAI=",
        "AAAAAAAAAXFDbGFpbSB0b2tlbnMgaWYgdGhlIHJlY2VpdmVyIGlzIHBhcnQgb2YgdGhlIE1lcmtsZSB0cmVlIGRlZmluZWQgYnkgdGhlIHJvb3QgaGFzaC4KCiMgQXJndW1lbnRzCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudC4KKiBgaW5kZXhgIC0gVGhlIGluZGV4IG9mIHRoZSByZWNlaXZlciBpbiB0aGUgb3JpZ2luYWwgbGlzdC4KKiBgcmVjZWl2ZXJgIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHJlY2VpdmVyIGNsYWltaW5nIHRoZSB0b2tlbnMuCiogYGFtb3VudGAgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0aGUgcmVjZWl2ZXIgaXMgY2xhaW1pbmcuCiogYHByb29mYCAtIFRoZSBNZXJrbGUgcHJvb2YgKGEgbGlzdCBvZiBzaWJsaW5nIGhhc2hlcykAAAAAAAAFY2xhaW0AAAAAAAAEAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAVwcm9vZgAAAAAAA+oAAAPuAAAAIAAAAAEAAAPpAAAAAgAAAAM=",
        "AAAAAAAAAVtDb25zdHJ1Y3RvciB0byBpbml0aWFsaXplIHRoZSBNZXJrbGUgZGlzdHJpYnV0aW9uIGNvbnRyYWN0LgoKIyBBcmd1bWVudHMKCiogYGVudmAgLSBUaGUgU29yb2JhbiBlbnZpcm9ubWVudC4KKiBgcm9vdF9oYXNoYCAtIFRoZSByb290IGhhc2ggb2YgdGhlIE1lcmtsZSB0cmVlLgoqIGB0b2tlbmAgLSBUaGUgYWRkcmVzcyBvZiB0aGUgdG9rZW4gdG8gYmUgZGlzdHJpYnV0ZWQuCiogYGZ1bmRpbmdfYW1vdW50YCAtIFRoZSB0b3RhbCBhbW91bnQgb2YgdG9rZW5zIHRvIGZ1bmQgdGhlIGNvbnRyYWN0IHdpdGguCiogYGZ1bmRpbmdfc291cmNlYCAtIFRoZSBhZGRyZXNzIHRoYXQgZnVuZHMgdGhlIGNvbnRyYWN0LgAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAQAAAAAAAAACXJvb3RfaGFzaAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAADmZ1bmRpbmdfYW1vdW50AAAAAAALAAAAAAAAAA5mdW5kaW5nX3NvdXJjZQAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    claim: this.txFromJSON<Result<void>>
  }
}