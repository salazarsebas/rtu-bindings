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
    contractId: "CDEQV2C3QTYZSTPOWZXCQY7KVJK4V2TJJZBT3EQWP7XJ3OQ6JHVQAU3L",
  }
} as const

export type DataKey = {tag: "Init", values: void} | {tag: "Balance", values: void};


export interface TimeBound {
  kind: TimeBoundKind;
  timestamp: u64;
}

export type TimeBoundKind = {tag: "Before", values: void} | {tag: "After", values: void};


export interface ClaimableBalance {
  amount: i128;
  claimants: Array<string>;
  time_bound: TimeBound;
  token: string;
}

export interface Client {
  /**
   * Construct and simulate a claim transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  claim: ({claimant}: {claimant: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a deposit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  deposit: ({from, token, amount, claimants, time_bound}: {from: string, token: string, amount: i128, claimants: Array<string>, time_bound: TimeBound}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABEluaXQAAAAAAAAAAAAAAAdCYWxhbmNlAA==",
        "AAAAAQAAAAAAAAAAAAAACVRpbWVCb3VuZAAAAAAAAAIAAAAAAAAABGtpbmQAAAfQAAAADVRpbWVCb3VuZEtpbmQAAAAAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAgAAAAAAAAAAAAAADVRpbWVCb3VuZEtpbmQAAAAAAAACAAAAAAAAAAAAAAAGQmVmb3JlAAAAAAAAAAAAAAAAAAVBZnRlcgAAAA==",
        "AAAAAQAAAAAAAAAAAAAAEENsYWltYWJsZUJhbGFuY2UAAAAEAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACWNsYWltYW50cwAAAAAAA+oAAAATAAAAAAAAAAp0aW1lX2JvdW5kAAAAAAfQAAAACVRpbWVCb3VuZAAAAAAAAAAAAAAFdG9rZW4AAAAAAAAT",
        "AAAAAAAAAAAAAAAFY2xhaW0AAAAAAAABAAAAAAAAAAhjbGFpbWFudAAAABMAAAAA",
        "AAAAAAAAAAAAAAAHZGVwb3NpdAAAAAAFAAAAAAAAAARmcm9tAAAAEwAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAACWNsYWltYW50cwAAAAAAA+oAAAATAAAAAAAAAAp0aW1lX2JvdW5kAAAAAAfQAAAACVRpbWVCb3VuZAAAAAAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    claim: this.txFromJSON<null>,
        deposit: this.txFromJSON<null>
  }
}