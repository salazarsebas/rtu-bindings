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
    contractId: "CBU6EKQOP5XPZMIR5CXFDNR2OGTSAKDNP2T722HU4YWWRXWNP4OUIJIG",
  }
} as const

export const Errors = {
  1: {message:"NotAuthorizedMinter"},
  2: {message:"DailyLimitInsufficient"},
  3: {message:"NegativeAmount"}
}

export type StorageKey = {tag: "Admin", values: void} | {tag: "Minter", values: readonly [string, string]} | {tag: "MinterStats", values: readonly [string, string, u32, u32]};


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
  mint: ({contract, minter, to, amount}: {contract: string, minter: string, to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Return the admin address.
   */
  admin: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns the config, current epoch, and current epoch's stats for a
   * minter.
   */
  minter: ({contract, minter}: {contract: string, minter: string}, options?: MethodOptions) => Promise<AssembledTransaction<Result<readonly [MinterConfig, u32, MinterStats]>>>

  /**
   * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set the admin.
   */
  set_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a set_minter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set the config of a minter for the given contract. Requires auth from
   * the admin.
   */
  set_minter: ({contract, minter, config}: {contract: string, minter: string, config: MinterConfig}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {admin}: {admin: string},
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
    return ContractClient.deploy({admin}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAwAAAAAAAAATTm90QXV0aG9yaXplZE1pbnRlcgAAAAABAAAAAAAAABZEYWlseUxpbWl0SW5zdWZmaWNpZW50AAAAAAACAAAAAAAAAA5OZWdhdGl2ZUFtb3VudAAAAAAAAw==",
        "AAAAAAAAAJxDYWxscyB0aGUgJ21pbnQnIGZ1bmN0aW9uIG9mIHRoZSAnY29udHJhY3QnIHdpdGggJ3RvJyBhbmQgJ2Ftb3VudCcuCkF1dGhvcml6ZWQgYnkgdGhlICdtaW50ZXInLiBVc2VzIHNvbWUgb2YgdGhlIGF1dGhvcml6ZWQgJ21pbnRlcidzCmN1cnJlbnQgZXBvY2gncyBsaW1pdC4AAAAEbWludAAAAAQAAAAAAAAACGNvbnRyYWN0AAAAEwAAAAAAAAAGbWludGVyAAAAAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAQAAA+kAAAACAAAAAw==",
        "AAAAAAAAABlSZXR1cm4gdGhlIGFkbWluIGFkZHJlc3MuAAAAAAAABWFkbWluAAAAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAEpSZXR1cm5zIHRoZSBjb25maWcsIGN1cnJlbnQgZXBvY2gsIGFuZCBjdXJyZW50IGVwb2NoJ3Mgc3RhdHMgZm9yIGEKbWludGVyLgAAAAAABm1pbnRlcgAAAAAAAgAAAAAAAAAIY29udHJhY3QAAAATAAAAAAAAAAZtaW50ZXIAAAAAABMAAAABAAAD6QAAA+0AAAADAAAH0AAAAAxNaW50ZXJDb25maWcAAAAEAAAH0AAAAAtNaW50ZXJTdGF0cwAAAAAD",
        "AAAAAgAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAMAAAAAAAAAG0FkbWluLiBWYWx1ZSBpcyBhbiBBZGRyZXNzLgAAAAAFQWRtaW4AAAAAAAABAAAAV01pbnRlcnMgYXJlIHN0b3JlZCBrZXllZCBieSB0aGUgY29udHJhY3QgYW5kIG1pbnRlciBhZGRyZXNzZXMuIFZhbHVlIGlzCmEgTWludGVyQ29uZmlnLgAAAAAGTWludGVyAAAAAAACAAAAEwAAABMAAAABAAAAu01pbnRlciBzdGF0cyBhcmUgc3RvcmVkIGtleWVkIGJ5IGNvbnRyYWN0IGFuZCBtaW50ZXIgYWRkcmVzc2VzLCBlcG9jaApsZW5ndGgsIGFuZCBlcG9jaCwgd2hpY2ggaXMgdGhlIGxlZGdlciBudW1iZXIgZGl2aWRlZCBieSB0aGUgbnVtYmVyIG9mCmxlZGdlcnMgaW4gdGhlIGVwb2NoLiAgVmFsdWUgaXMgYSBNaW50ZXJTdGF0cy4AAAAAC01pbnRlclN0YXRzAAAAAAQAAAATAAAAEwAAAAQAAAAE",
        "AAAAAAAAAA5TZXQgdGhlIGFkbWluLgAAAAAACXNldF9hZG1pbgAAAAAAAAEAAAAAAAAACW5ld19hZG1pbgAAAAAAABMAAAAA",
        "AAAAAQAAAAAAAAAAAAAAC01pbnRlclN0YXRzAAAAAAEAAAAAAAAADmNvbnN1bWVkX2xpbWl0AAAAAAAL",
        "AAAAAAAAAFBTZXQgdGhlIGNvbmZpZyBvZiBhIG1pbnRlciBmb3IgdGhlIGdpdmVuIGNvbnRyYWN0LiBSZXF1aXJlcyBhdXRoIGZyb20KdGhlIGFkbWluLgAAAApzZXRfbWludGVyAAAAAAADAAAAAAAAAAhjb250cmFjdAAAABMAAAAAAAAABm1pbnRlcgAAAAAAEwAAAAAAAAAGY29uZmlnAAAAAAfQAAAADE1pbnRlckNvbmZpZwAAAAA=",
        "AAAAAQAAAAAAAAAAAAAADE1pbnRlckNvbmZpZwAAAAIAAAAAAAAADGVwb2NoX2xlbmd0aAAAAAQAAAAAAAAABWxpbWl0AAAAAAAACw==",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    mint: this.txFromJSON<Result<void>>,
        admin: this.txFromJSON<string>,
        minter: this.txFromJSON<Result<readonly [MinterConfig, u32, MinterStats]>>,
        set_admin: this.txFromJSON<null>,
        set_minter: this.txFromJSON<null>
  }
}