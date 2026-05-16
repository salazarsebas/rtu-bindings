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
    contractId: "CBWMKDIH75GKQJABO3MJUYUVF6QZMTQA32XTGOLY5GPDRP34A6LU2JM2",
  }
} as const


export interface Client {
  /**
   * Construct and simulate a deploy transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deploys the contract on behalf of the `Deployer` contract.
   * 
   * This has to be authorized by the `Deployer`s administrator.
   */
  deploy: ({wasm_hash, salt, constructor_args}: {wasm_hash: Buffer, salt: Buffer, constructor_args: Array<any>}, options?: MethodOptions) => Promise<AssembledTransaction<string>>

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
      new ContractSpec([ "AAAAAAAAAHdEZXBsb3lzIHRoZSBjb250cmFjdCBvbiBiZWhhbGYgb2YgdGhlIGBEZXBsb3llcmAgY29udHJhY3QuCgpUaGlzIGhhcyB0byBiZSBhdXRob3JpemVkIGJ5IHRoZSBgRGVwbG95ZXJgcyBhZG1pbmlzdHJhdG9yLgAAAAAGZGVwbG95AAAAAAADAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAEc2FsdAAAA+4AAAAgAAAAAAAAABBjb25zdHJ1Y3Rvcl9hcmdzAAAD6gAAAAAAAAABAAAAEw==",
        "AAAAAAAAADVDb25zdHJ1Y3QgdGhlIGRlcGxveWVyIHdpdGggYSBwcm92aWRlZCBhZG1pbmlzdHJhdG9yLgAAAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    deploy: this.txFromJSON<string>
  }
}