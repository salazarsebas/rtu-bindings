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
    contractId: "CAYHFWCJDGL2WEMJI4SLEYCAZHSFEMT2REOSMYVKV5Z2KAEZKN3UPA4X",
  }
} as const


export interface Client {
  /**
   * Construct and simulate a call_b transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  call_b: ({contract_b_address, contract_c_address}: {contract_b_address: string, contract_c_address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a authorized_fn_b transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  authorized_fn_b: ({authorizer, contract_c_address}: {authorizer: string, contract_c_address: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a authorized_fn_c transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  authorized_fn_c: ({authorizer}: {authorizer: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAAAAAAAAAAAGY2FsbF9iAAAAAAACAAAAAAAAABJjb250cmFjdF9iX2FkZHJlc3MAAAAAABMAAAAAAAAAEmNvbnRyYWN0X2NfYWRkcmVzcwAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAPYXV0aG9yaXplZF9mbl9iAAAAAAIAAAAAAAAACmF1dGhvcml6ZXIAAAAAABMAAAAAAAAAEmNvbnRyYWN0X2NfYWRkcmVzcwAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAPYXV0aG9yaXplZF9mbl9jAAAAAAEAAAAAAAAACmF1dGhvcml6ZXIAAAAAABMAAAAA" ]),
      options
    )
  }
  public readonly fromJSON = {
    call_b: this.txFromJSON<null>,
        authorized_fn_b: this.txFromJSON<null>,
        authorized_fn_c: this.txFromJSON<null>
  }
}