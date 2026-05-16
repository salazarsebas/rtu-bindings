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


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDXTVXFFK636U55AWKKMZEYV7GCVW6L4EEXY72LNKEFG3SX3QNVOCUYV",
  }
} as const

export type DataKey = {tag: "MyKey", values: void};

export interface Client {
  /**
   * Construct and simulate a setup transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Creates a contract entry in every kind of storage.
   */
  setup: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a extend_instance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Extend the instance entry TTL to become at least 10000 ledgers,
   * when its TTL is smaller than 2000 ledgers.
   */
  extend_instance: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a extend_temporary transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Extend the temporary entry TTL to become at least 7000 ledgers,
   * when its TTL is smaller than 3000 ledgers.
   */
  extend_temporary: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a extend_persistent transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Extend the persistent entry TTL to 5000 ledgers, when its
   * TTL is smaller than 1000 ledgers.
   */
  extend_persistent: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
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
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAABU15S2V5AAAA",
        "AAAAAAAAADJDcmVhdGVzIGEgY29udHJhY3QgZW50cnkgaW4gZXZlcnkga2luZCBvZiBzdG9yYWdlLgAAAAAABXNldHVwAAAAAAAAAAAAAAA=",
        "AAAAAAAAAGpFeHRlbmQgdGhlIGluc3RhbmNlIGVudHJ5IFRUTCB0byBiZWNvbWUgYXQgbGVhc3QgMTAwMDAgbGVkZ2VycywKd2hlbiBpdHMgVFRMIGlzIHNtYWxsZXIgdGhhbiAyMDAwIGxlZGdlcnMuAAAAAAAPZXh0ZW5kX2luc3RhbmNlAAAAAAAAAAAA",
        "AAAAAAAAAGpFeHRlbmQgdGhlIHRlbXBvcmFyeSBlbnRyeSBUVEwgdG8gYmVjb21lIGF0IGxlYXN0IDcwMDAgbGVkZ2VycywKd2hlbiBpdHMgVFRMIGlzIHNtYWxsZXIgdGhhbiAzMDAwIGxlZGdlcnMuAAAAAAAQZXh0ZW5kX3RlbXBvcmFyeQAAAAAAAAAA",
        "AAAAAAAAAFtFeHRlbmQgdGhlIHBlcnNpc3RlbnQgZW50cnkgVFRMIHRvIDUwMDAgbGVkZ2Vycywgd2hlbiBpdHMKVFRMIGlzIHNtYWxsZXIgdGhhbiAxMDAwIGxlZGdlcnMuAAAAABFleHRlbmRfcGVyc2lzdGVudAAAAAAAAAAAAAAA" ]),
      options
    )
  }
  public readonly fromJSON = {
    setup: this.txFromJSON<null>,
        extend_instance: this.txFromJSON<null>,
        extend_temporary: this.txFromJSON<null>,
        extend_persistent: this.txFromJSON<null>
  }
}