import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions, Result } from "@stellar/stellar-sdk/contract";
import type { u32, i32, u64, i64, u128, i128, u256, i256, Option } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CDJCVDZB6S736YMTDKICSKKYMP6HVAMNMSNHEMBU7ZTJKA26XAMHLRSS";
    };
};
/**
 * This is from the rust doc above the struct Test
 */
export interface Test {
    a: u32;
    b: boolean;
    c: string;
}
export declare const Errors: {
    /**
     * Please provide an odd number
     */
    1: {
        message: string;
    };
};
export declare enum RoyalCard {
    Jack = 11,
    Queen = 12,
    King = 13
}
export type SimpleEnum = {
    tag: "First";
    values: void;
} | {
    tag: "Second";
    values: void;
} | {
    tag: "Third";
    values: void;
};
export type ComplexEnum = {
    tag: "Struct";
    values: readonly [Test];
} | {
    tag: "Tuple";
    values: readonly [TupleStruct];
} | {
    tag: "Enum";
    values: readonly [SimpleEnum];
} | {
    tag: "Asset";
    values: readonly [string, i128];
} | {
    tag: "Void";
    values: void;
};
export type TupleStruct = readonly [Test, SimpleEnum];
export type ComplexEnum2 = {
    tag: "Stellar";
    values: readonly [string];
} | {
    tag: "Other";
    values: readonly [string];
};
export type ComplexEnum3 = {
    tag: "Some";
    values: readonly [readonly [string, i128]];
} | {
    tag: "None";
    values: void;
};
export interface ComplexStruct {
    a32: u32;
    a64: u64;
    admin: string;
    assets_vec: Array<ComplexEnum2>;
    b32: u32;
    base_asset: ComplexEnum2;
    c32: u32;
    complex_enum3: ComplexEnum3;
}
export interface Client {
    /**
     * Construct and simulate a inc transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    inc: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a map transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    map: ({ map }: {
        map: Map<u32, boolean>;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Map<u32, boolean>>>;
    /**
     * Construct and simulate a not transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Negates a boolean value
     */
    not: ({ boolean }: {
        boolean: boolean;
    }, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a val transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    val: (options?: MethodOptions) => Promise<AssembledTransaction<any>>;
    /**
     * Construct and simulate a vec transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    vec: ({ vec }: {
        vec: Array<u32>;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Array<u32>>>;
    /**
     * Construct and simulate a auth transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    auth: ({ addr, world }: {
        addr: string;
        world: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a card transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    card: ({ card }: {
        card: RoyalCard;
    }, options?: MethodOptions) => Promise<AssembledTransaction<RoyalCard>>;
    /**
     * Construct and simulate a i128 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    i128: ({ i128 }: {
        i128: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a i256 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    i256: ({ i256 }: {
        i256: i256;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i256>>;
    /**
     * Construct and simulate a i32_ transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    i32_: ({ i32_ }: {
        i32_: i32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i32>>;
    /**
     * Construct and simulate a i64_ transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    i64_: ({ i64_ }: {
        i64_: i64;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i64>>;
    /**
     * Construct and simulate a u128 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    u128: ({ u128 }: {
        u128: u128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u128>>;
    /**
     * Construct and simulate a u256 transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    u256: ({ u256 }: {
        u256: u256;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u256>>;
    /**
     * Construct and simulate a u32_ transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    u32_: ({ u32_ }: {
        u32_: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a woid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    woid: (options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a bytes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    bytes: ({ bytes }: {
        bytes: Buffer;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Buffer>>;
    /**
     * Construct and simulate a hello transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    hello: ({ hello }: {
        hello: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a tuple transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    tuple: ({ tuple }: {
        tuple: readonly [string, u32];
    }, options?: MethodOptions) => Promise<AssembledTransaction<readonly [string, u32]>>;
    /**
     * Construct and simulate a option transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Example of an optional argument
     */
    option: ({ option }: {
        option: Option<u32>;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Option<u32>>>;
    /**
     * Construct and simulate a simple transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    simple: ({ simple }: {
        simple: SimpleEnum;
    }, options?: MethodOptions) => Promise<AssembledTransaction<SimpleEnum>>;
    /**
     * Construct and simulate a string transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    string: ({ string }: {
        string: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a strukt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    strukt: ({ strukt }: {
        strukt: Test;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Test>>;
    /**
     * Construct and simulate a boolean transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    boolean: ({ boolean }: {
        boolean: boolean;
    }, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a bytes_n transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    bytes_n: ({ bytes_n }: {
        bytes_n: Buffer;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Buffer>>;
    /**
     * Construct and simulate a complex transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    complex: ({ complex }: {
        complex: ComplexEnum;
    }, options?: MethodOptions) => Promise<AssembledTransaction<ComplexEnum>>;
    /**
     * Construct and simulate a addresse transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    addresse: ({ addresse }: {
        addresse: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a get_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_count: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a multi_args transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    multi_args: ({ a, b }: {
        a: u32;
        b: boolean;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a strukt_hel transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Example contract method which takes a struct
     */
    strukt_hel: ({ strukt }: {
        strukt: Test;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>;
    /**
     * Construct and simulate a tuple_strukt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    tuple_strukt: ({ tuple_strukt }: {
        tuple_strukt: TupleStruct;
    }, options?: MethodOptions) => Promise<AssembledTransaction<TupleStruct>>;
    /**
     * Construct and simulate a complex_struct transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    complex_struct: ({ config }: {
        config: ComplexStruct;
    }, options?: MethodOptions) => Promise<AssembledTransaction<ComplexStruct>>;
    /**
     * Construct and simulate a u32_fail_on_even transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    u32_fail_on_even: ({ u32_ }: {
        u32_: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<Result<u32>>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        inc: (json: string) => AssembledTransaction<number>;
        map: (json: string) => AssembledTransaction<Map<number, boolean>>;
        not: (json: string) => AssembledTransaction<boolean>;
        val: (json: string) => AssembledTransaction<any>;
        vec: (json: string) => AssembledTransaction<number[]>;
        auth: (json: string) => AssembledTransaction<string>;
        card: (json: string) => AssembledTransaction<RoyalCard>;
        i128: (json: string) => AssembledTransaction<bigint>;
        i256: (json: string) => AssembledTransaction<bigint>;
        i32_: (json: string) => AssembledTransaction<number>;
        i64_: (json: string) => AssembledTransaction<bigint>;
        u128: (json: string) => AssembledTransaction<bigint>;
        u256: (json: string) => AssembledTransaction<bigint>;
        u32_: (json: string) => AssembledTransaction<number>;
        woid: (json: string) => AssembledTransaction<null>;
        bytes: (json: string) => AssembledTransaction<Buffer>;
        hello: (json: string) => AssembledTransaction<string>;
        tuple: (json: string) => AssembledTransaction<readonly [string, number]>;
        option: (json: string) => AssembledTransaction<Option<number>>;
        simple: (json: string) => AssembledTransaction<SimpleEnum>;
        string: (json: string) => AssembledTransaction<string>;
        strukt: (json: string) => AssembledTransaction<Test>;
        boolean: (json: string) => AssembledTransaction<boolean>;
        bytes_n: (json: string) => AssembledTransaction<Buffer>;
        complex: (json: string) => AssembledTransaction<ComplexEnum>;
        addresse: (json: string) => AssembledTransaction<string>;
        get_count: (json: string) => AssembledTransaction<number>;
        multi_args: (json: string) => AssembledTransaction<number>;
        strukt_hel: (json: string) => AssembledTransaction<string[]>;
        tuple_strukt: (json: string) => AssembledTransaction<TupleStruct>;
        complex_struct: (json: string) => AssembledTransaction<ComplexStruct>;
        u32_fail_on_even: (json: string) => AssembledTransaction<Result<number, import("@stellar/stellar-sdk/contract").ErrorMessage>>;
    };
}
