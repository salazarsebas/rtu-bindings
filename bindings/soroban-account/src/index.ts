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




export const AccError = {
  1: {message:"NotEnoughSigners"},
  2: {message:"NegativeAmount"},
  3: {message:"BadSignatureOrder"},
  4: {message:"UnknownSigner"}
}


export interface AccSignature {
  public_key: Buffer;
  signature: Buffer;
}

export interface Client {
  /**
   * Construct and simulate a add_limit transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  add_limit: ({token, limit}: {token: string, limit: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {signers}: {signers: Array<Buffer>},
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
    return ContractClient.deploy({signers}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAABAAAAAAAAAAAAAAACEFjY0Vycm9yAAAABAAAAAAAAAAQTm90RW5vdWdoU2lnbmVycwAAAAEAAAAAAAAADk5lZ2F0aXZlQW1vdW50AAAAAAACAAAAAAAAABFCYWRTaWduYXR1cmVPcmRlcgAAAAAAAAMAAAAAAAAADVVua25vd25TaWduZXIAAAAAAAAE",
        "AAAAAQAAAAAAAAAAAAAADEFjY1NpZ25hdHVyZQAAAAIAAAAAAAAACnB1YmxpY19rZXkAAAAAA+4AAAAgAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQA==",
        "AAAAAAAAAAAAAAAJYWRkX2xpbWl0AAAAAAAAAgAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAAAAAAVsaW1pdAAAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAD6gAAB9AAAAAMQWNjU2lnbmF0dXJlAAAAAAAAAAxhdXRoX2NvbnRleHQAAAPqAAAH0AAAAAdDb250ZXh0AAAAAAEAAAPpAAAAAgAAB9AAAAAIQWNjRXJyb3I=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAAB3NpZ25lcnMAAAAD6gAAA+4AAAAgAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    add_limit: this.txFromJSON<null>
  }
}