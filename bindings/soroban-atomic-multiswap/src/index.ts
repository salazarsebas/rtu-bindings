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
    contractId: "CA6LG6ZIUYCWRZTYU3LQG4KYYFETV55B7LJZB7PBC5P65J3E5G5E3T7U",
  }
} as const


export interface SwapSpec {
  address: string;
  amount: i128;
  min_recv: i128;
}

export interface Client {
  /**
   * Construct and simulate a multi_swap transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  multi_swap: ({swap_contract, token_a, token_b, swaps_a, swaps_b}: {swap_contract: string, token_a: string, token_b: string, swaps_a: Array<SwapSpec>, swaps_b: Array<SwapSpec>}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAACFN3YXBTcGVjAAAAAwAAAAAAAAAHYWRkcmVzcwAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACG1pbl9yZWN2AAAACw==",
        "AAAAAAAAAAAAAAAKbXVsdGlfc3dhcAAAAAAABQAAAAAAAAANc3dhcF9jb250cmFjdAAAAAAAABMAAAAAAAAAB3Rva2VuX2EAAAAAEwAAAAAAAAAHdG9rZW5fYgAAAAATAAAAAAAAAAdzd2Fwc19hAAAAA+oAAAfQAAAACFN3YXBTcGVjAAAAAAAAAAdzd2Fwc19iAAAAA+oAAAfQAAAACFN3YXBTcGVjAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    multi_swap: this.txFromJSON<null>
  }
}