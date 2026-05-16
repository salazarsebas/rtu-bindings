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
    contractId: "CBHL4CHK67TS4ZQVOKKMR243X5QNNQSLSUDPBCZ2B76MWNV6GDC5T7WX",
  }
} as const


export interface Offer {
  buy_price: u32;
  buy_token: string;
  sell_price: u32;
  sell_token: string;
  seller: string;
}

export type DataKey = {tag: "Offer", values: void};

export interface Client {
  /**
   * Construct and simulate a trade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  trade: ({buyer, buy_token_amount, min_sell_token_amount}: {buyer: string, buy_token_amount: i128, min_sell_token_amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a create transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create: ({seller, sell_token, buy_token, sell_price, buy_price}: {seller: string, sell_token: string, buy_token: string, sell_price: u32, buy_price: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({token, amount}: {token: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_offer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_offer: (options?: MethodOptions) => Promise<AssembledTransaction<Offer>>

  /**
   * Construct and simulate a updt_price transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  updt_price: ({sell_price, buy_price}: {sell_price: u32, buy_price: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABU9mZmVyAAAAAAAABQAAAAAAAAAJYnV5X3ByaWNlAAAAAAAABAAAAAAAAAAJYnV5X3Rva2VuAAAAAAAAEwAAAAAAAAAKc2VsbF9wcmljZQAAAAAABAAAAAAAAAAKc2VsbF90b2tlbgAAAAAAEwAAAAAAAAAGc2VsbGVyAAAAAAAT",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAABU9mZmVyAAAA",
        "AAAAAAAAAAAAAAAFdHJhZGUAAAAAAAADAAAAAAAAAAVidXllcgAAAAAAABMAAAAAAAAAEGJ1eV90b2tlbl9hbW91bnQAAAALAAAAAAAAABVtaW5fc2VsbF90b2tlbl9hbW91bnQAAAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAGY3JlYXRlAAAAAAAFAAAAAAAAAAZzZWxsZXIAAAAAABMAAAAAAAAACnNlbGxfdG9rZW4AAAAAABMAAAAAAAAACWJ1eV90b2tlbgAAAAAAABMAAAAAAAAACnNlbGxfcHJpY2UAAAAAAAQAAAAAAAAACWJ1eV9wcmljZQAAAAAAAAQAAAAA",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAACAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAAAAAAAJZ2V0X29mZmVyAAAAAAAAAAAAAAEAAAfQAAAABU9mZmVyAAAA",
        "AAAAAAAAAAAAAAAKdXBkdF9wcmljZQAAAAAAAgAAAAAAAAAKc2VsbF9wcmljZQAAAAAABAAAAAAAAAAJYnV5X3ByaWNlAAAAAAAABAAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    trade: this.txFromJSON<null>,
        create: this.txFromJSON<null>,
        withdraw: this.txFromJSON<null>,
        get_offer: this.txFromJSON<Offer>,
        updt_price: this.txFromJSON<null>
  }
}