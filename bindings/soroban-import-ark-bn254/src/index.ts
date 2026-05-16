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
    contractId: "CACTGA64NNSP2I6U4WAKT2WIA6HFPKZJY2DG7GO6IAATX6NPJWPM46LV",
  }
} as const


export interface MockProof {
  g1: Buffer;
  g2: Buffer;
}

export interface Client {
  /**
   * Construct and simulate a mock_verify transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mock_verify: ({proof}: {proof: MockProof}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

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
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAACU1vY2tQcm9vZgAAAAAAAAIAAAAAAAAAAmcxAAAAAAPuAAAAQAAAAAAAAAACZzIAAAAAA+4AAACA",
        "AAAAAAAAAAAAAAALbW9ja192ZXJpZnkAAAAAAQAAAAAAAAAFcHJvb2YAAAAAAAfQAAAACU1vY2tQcm9vZgAAAAAAAAEAAAAB" ]),
      options
    )
  }
  public readonly fromJSON = {
    mock_verify: this.txFromJSON<boolean>
  }
}