# RTU Bindings

TypeScript SDKs for the Stellar example smart contracts.

- Stellar example smart contracts deployed on testnet.
- TypeScript bindings generated from the deployed contracts and WASM specs.
- Published as npm SDKs under `@rtu-bindings/*`.
- Ready to install in apps, scripts, tests, and demos.
- Useful for faster experiments without building, deploying, or generating bindings from scratch.

> **Note:** The core example contracts come from [stellar/soroban-examples](https://github.com/stellar/soroban-examples) without any modifications. They were deployed as-is on testnet and TypeScript bindings were generated from the deployed contracts and published as npm packages.

> **Cougr example games:** `tic_tac_toe`, `connect_four`, `checkers`, `chess`, `reversi`, `battleship`, `rock_paper_scissors`, `minesweeper`, `snake`, `tetris`, `pong`, `asteroids`, `memory_match`, `murdoku`, and `hidden_hand` are a curated selection of on-chain games from [salazarsebas/Cougr](https://github.com/salazarsebas/Cougr), an ECS game engine for Stellar Soroban, unmodified from their source and licensed MIT OR Apache-2.0 (see [LICENSE-cougr](./LICENSE-cougr)). `murdoku` and `hidden_hand` showcase Cougr's on-chain hidden-state/ZK capabilities.

## Published SDKs

### Stellar example contracts

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
- [@rtu-bindings/soroban-modular-account](https://www.npmjs.com/package/@rtu-bindings/soroban-modular-account)
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

### Cougr example games

- [@rtu-bindings/soroban-asteroids](https://www.npmjs.com/package/@rtu-bindings/soroban-asteroids)
- [@rtu-bindings/soroban-battleship](https://www.npmjs.com/package/@rtu-bindings/soroban-battleship)
- [@rtu-bindings/soroban-checkers](https://www.npmjs.com/package/@rtu-bindings/soroban-checkers)
- [@rtu-bindings/soroban-chess](https://www.npmjs.com/package/@rtu-bindings/soroban-chess)
- [@rtu-bindings/soroban-connect-four](https://www.npmjs.com/package/@rtu-bindings/soroban-connect-four)
- [@rtu-bindings/soroban-hidden-hand](https://www.npmjs.com/package/@rtu-bindings/soroban-hidden-hand)
- [@rtu-bindings/soroban-memory-match](https://www.npmjs.com/package/@rtu-bindings/soroban-memory-match)
- [@rtu-bindings/soroban-minesweeper](https://www.npmjs.com/package/@rtu-bindings/soroban-minesweeper)
- [@rtu-bindings/soroban-murdoku](https://www.npmjs.com/package/@rtu-bindings/soroban-murdoku)
- [@rtu-bindings/soroban-pong](https://www.npmjs.com/package/@rtu-bindings/soroban-pong)
- [@rtu-bindings/soroban-reversi](https://www.npmjs.com/package/@rtu-bindings/soroban-reversi)
- [@rtu-bindings/soroban-rock-paper-scissors](https://www.npmjs.com/package/@rtu-bindings/soroban-rock-paper-scissors)
- [@rtu-bindings/soroban-snake](https://www.npmjs.com/package/@rtu-bindings/soroban-snake)
- [@rtu-bindings/soroban-tetris](https://www.npmjs.com/package/@rtu-bindings/soroban-tetris)
- [@rtu-bindings/soroban-tic-tac-toe](https://www.npmjs.com/package/@rtu-bindings/soroban-tic-tac-toe)

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
