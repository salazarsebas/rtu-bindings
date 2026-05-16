# RTU Bindings

TypeScript SDKs for the Stellar example smart contracts.

- Stellar example smart contracts deployed on testnet.
- TypeScript bindings generated from the deployed contracts and WASM specs.
- Published as npm SDKs under `@rtu-bindings/*`.
- Ready to install in apps, scripts, tests, and demos.
- Useful for faster experiments without building, deploying, or generating bindings from scratch.

> **Note:** The smart contracts come entirely from [stellar/soroban-examples](https://github.com/stellar/soroban-examples) without any modifications. They were deployed as-is on testnet and TypeScript bindings were generated from the deployed contracts and published as npm packages.

## Published SDKs

- [@rtu-bindings/soroban-account](https://www.npmjs.com/package/@rtu-bindings/soroban-account)
- [@rtu-bindings/soroban-alloc](https://www.npmjs.com/package/@rtu-bindings/soroban-alloc)
- [@rtu-bindings/soroban-atomic-multiswap](https://www.npmjs.com/package/@rtu-bindings/soroban-atomic-multiswap)
- [@rtu-bindings/soroban-atomic-swap](https://www.npmjs.com/package/@rtu-bindings/soroban-atomic-swap)
- [@rtu-bindings/soroban-auth](https://www.npmjs.com/package/@rtu-bindings/soroban-auth)
- [@rtu-bindings/soroban-bls-signature](https://www.npmjs.com/package/@rtu-bindings/soroban-bls-signature)
- [@rtu-bindings/soroban-cross-contract-a](https://www.npmjs.com/package/@rtu-bindings/soroban-cross-contract-a)
- [@rtu-bindings/soroban-cross-contract-b](https://www.npmjs.com/package/@rtu-bindings/soroban-cross-contract-b)
- [@rtu-bindings/soroban-custom-types](https://www.npmjs.com/package/@rtu-bindings/soroban-custom-types)
- [@rtu-bindings/soroban-deep-contract-auth](https://www.npmjs.com/package/@rtu-bindings/soroban-deep-contract-auth)
- [@rtu-bindings/soroban-deployer-contract](https://www.npmjs.com/package/@rtu-bindings/soroban-deployer-contract)
- [@rtu-bindings/soroban-deployer](https://www.npmjs.com/package/@rtu-bindings/soroban-deployer)
- [@rtu-bindings/soroban-errors](https://www.npmjs.com/package/@rtu-bindings/soroban-errors)
- [@rtu-bindings/soroban-eth-abi](https://www.npmjs.com/package/@rtu-bindings/soroban-eth-abi)
- [@rtu-bindings/soroban-events](https://www.npmjs.com/package/@rtu-bindings/soroban-events)
- [@rtu-bindings/soroban-fuzzing](https://www.npmjs.com/package/@rtu-bindings/soroban-fuzzing)
- [@rtu-bindings/soroban-groth16-verifier](https://www.npmjs.com/package/@rtu-bindings/soroban-groth16-verifier)
- [@rtu-bindings/soroban-hello-world](https://www.npmjs.com/package/@rtu-bindings/soroban-hello-world)
- [@rtu-bindings/soroban-import-ark-bn254](https://www.npmjs.com/package/@rtu-bindings/soroban-import-ark-bn254)
- [@rtu-bindings/soroban-increment-with-fuzz](https://www.npmjs.com/package/@rtu-bindings/soroban-increment-with-fuzz)
- [@rtu-bindings/soroban-increment-with-pause](https://www.npmjs.com/package/@rtu-bindings/soroban-increment-with-pause)
- [@rtu-bindings/soroban-increment](https://www.npmjs.com/package/@rtu-bindings/soroban-increment)
- [@rtu-bindings/soroban-liquidity-pool](https://www.npmjs.com/package/@rtu-bindings/soroban-liquidity-pool)
- [@rtu-bindings/soroban-logging](https://www.npmjs.com/package/@rtu-bindings/soroban-logging)
- [@rtu-bindings/soroban-merkle-distribution](https://www.npmjs.com/package/@rtu-bindings/soroban-merkle-distribution)
- [@rtu-bindings/soroban-mint-lock](https://www.npmjs.com/package/@rtu-bindings/soroban-mint-lock)
- [@rtu-bindings/soroban-multisig-1-of-n](https://www.npmjs.com/package/@rtu-bindings/soroban-multisig-1-of-n)
- [@rtu-bindings/soroban-other-custom-types](https://www.npmjs.com/package/@rtu-bindings/soroban-other-custom-types)
- [@rtu-bindings/soroban-pause](https://www.npmjs.com/package/@rtu-bindings/soroban-pause)
- [@rtu-bindings/soroban-privacy-pools](https://www.npmjs.com/package/@rtu-bindings/soroban-privacy-pools)
- [@rtu-bindings/soroban-simple-account](https://www.npmjs.com/package/@rtu-bindings/soroban-simple-account)
- [@rtu-bindings/soroban-single-offer](https://www.npmjs.com/package/@rtu-bindings/soroban-single-offer)
- [@rtu-bindings/soroban-timelock](https://www.npmjs.com/package/@rtu-bindings/soroban-timelock)
- [@rtu-bindings/soroban-token](https://www.npmjs.com/package/@rtu-bindings/soroban-token)
- [@rtu-bindings/soroban-ttl](https://www.npmjs.com/package/@rtu-bindings/soroban-ttl)
- [@rtu-bindings/soroban-upgradeable-new](https://www.npmjs.com/package/@rtu-bindings/soroban-upgradeable-new)
- [@rtu-bindings/soroban-upgradeable-old](https://www.npmjs.com/package/@rtu-bindings/soroban-upgradeable-old)
- [@rtu-bindings/soroban-workspace-contract-a](https://www.npmjs.com/package/@rtu-bindings/soroban-workspace-contract-a)
- [@rtu-bindings/soroban-workspace-contract-b](https://www.npmjs.com/package/@rtu-bindings/soroban-workspace-contract-b)

## Install

```bash
npm install @rtu-bindings/soroban-hello-world
# or
bun add @rtu-bindings/soroban-hello-world
```

## Usage

```ts
import { Client, networks } from "@rtu-bindings/soroban-hello-world";

const client = new Client({
  ...networks.testnet,
  rpcUrl: "https://soroban-testnet.stellar.org",
});

const tx = await client.hello({ to: "world" });
console.log(tx.result);
```

## Original Stellar Examples README

The original repository README is preserved in [README-stellar-examples.md](./README-stellar-examples.md).
