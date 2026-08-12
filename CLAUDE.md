# CLAUDE.md

Instructions for AI agents (and human contributors) working in this repository.

## What this repo is

`rtu-bindings` does not author smart contracts. It mirrors example contracts
from two upstream sources, deploys them to Stellar testnet, and publishes
generated TypeScript bindings to npm under `@rtu-bindings/*`:

- [stellar/soroban-examples](https://github.com/stellar/soroban-examples) — official Soroban example contracts.
- [salazarsebas/Cougr](https://github.com/salazarsebas/Cougr) — a curated selection of on-chain game examples (see `README.md` for the list and attribution).

Contract source code is not modified here beyond what's needed to fit the
repo layout (adding a `Makefile`, wiring into `scripts/deploy-contracts.sh`
and `scripts/generate-bindings.sh`).

## CI/CD policy: only `publish-npm.yml` runs

This repo intentionally has a single GitHub Actions workflow:
`.github/workflows/publish-npm.yml`.

**Do not add back `rust.yml`, `build-and-test-devcontainer.yml`,
`validate-devcontainer-json.yml`, or any other build/lint/test workflow
without an explicit request from the repo owner.**

Why: the contracts' correctness, tests, and code quality are already the
responsibility of their upstream repos (soroban-examples and Cougr both run
their own CI). Re-running Rust builds/tests/fuzzing/formatting checks here
would duplicate that verification for code we don't own or modify, on every
push, for no benefit. This repo's only job is packaging and distribution —
deploy the unmodified wasm, generate bindings, publish them.

If you're tempted to add a workflow because something here looks untested:
first check whether the issue is in the copied contract source (fix it
upstream, or note it, don't add local CI to babysit it) or in this repo's
own scripts/tooling (`scripts/*.sh`, `bindings/*/package.json` generation) —
only the latter would ever justify a workflow, and even then, ask first.

## Local verification (not CI-gated)

Building, deploying, and generating bindings happen locally / on demand, not
automatically on push:

```bash
bash scripts/setup-local.sh          # build + deploy to testnet + generate bindings
bash scripts/deploy-contracts.sh     # deploy only (retries on testnet RPC flakiness)
bash scripts/generate-bindings.sh    # bindings only
```

`scripts/deploy-contracts.sh` retries every failed deploy (not just specific
error strings) — testnet RPC lag routinely produces `TxBadSeq`, submission
timeouts, and transient "wasm does not exist" errors right after a
successful upload. None of that reflects a real problem with the contract.

## Publishing

`publish-npm.yml` is `workflow_dispatch`-only (manual trigger, never on
push/PR). Trigger it with the intended version:

```bash
gh workflow run publish-npm.yml -f version=X.Y.Z -f dry_run=false
```

`NPM_TOKEN` must be configured as a repo secret with publish access to the
`@rtu-bindings` scope.
