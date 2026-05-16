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
    contractId: "CCOHJ73X2R54KNXX4L232SJMVOCXB7MLU5YD36HD6T76LGWNDEUTZGE5",
  }
} as const

export type DataKey = {tag: "Counter", values: readonly [string]};

export interface Client {
  /**
   * Construct and simulate a increment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Increment increments a counter for the user, and returns the value.
   */
  increment: ({user, value}: {user: string, value: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAAB0NvdW50ZXIAAAAAAQAAABM=",
        "AAAAAAAAAENJbmNyZW1lbnQgaW5jcmVtZW50cyBhIGNvdW50ZXIgZm9yIHRoZSB1c2VyLCBhbmQgcmV0dXJucyB0aGUgdmFsdWUuAAAAAAlpbmNyZW1lbnQAAAAAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAFdmFsdWUAAAAAAAAEAAAAAQAAAAQ=" ]),
      options
    )
  }
  public readonly fromJSON = {
    increment: this.txFromJSON<u32>
  }
}