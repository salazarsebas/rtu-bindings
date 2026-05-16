#!/usr/bin/env bash
# Deploy all Soroban example contracts to testnet.
# Saves a map of alias → contractId to testnet-contracts.json.
#
# Prerequisites:
#   stellar keys generate acachete --network testnet --fund
#
# Usage:
#   bash scripts/deploy-contracts.sh
#   STELLAR_NETWORK=testnet STELLAR_SOURCE=acachete bash scripts/deploy-contracts.sh

set -euo pipefail

NETWORK="${STELLAR_NETWORK:-testnet}"
SOURCE="${STELLAR_SOURCE:-acachete}"
OUTPUT_FILE="testnet-contracts.json"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"

RESULTS="{}"
DEPLOYED=0
FAILED=0

# ── helpers ──────────────────────────────────────────────────────────────────

log()    { echo "▶  $*"; }
ok()     { echo "✓  $*"; }
warn()   { echo "⚠  $*" >&2; }
section(){ echo ""; echo "══ $* ══"; }

# Derive WASM path from a package's Cargo.toml directory.
# $1 = directory containing the contract's Cargo.toml
# $2 = (optional) directory where target/ lives (defaults to $1; use for workspace members)
cargo_wasm_path() {
  local pkg_dir="$1"
  local target_dir="${2:-$1}"
  local pkg_name
  pkg_name=$(grep -m1 '^name = ' "$pkg_dir/Cargo.toml" 2>/dev/null \
    | sed 's/name = "\(.*\)"/\1/' | tr '-' '_')
  echo "$target_dir/target/wasm32v1-none/release/${pkg_name}.wasm"
}

save_id() {
  RESULTS=$(echo "$RESULTS" | jq --arg a "$1" --arg id "$2" '.[$a] = $id')
}

get_id() {
  echo "$RESULTS" | jq -r --arg a "$1" '.[$a] // empty'
}

# deploy ALIAS PKG_DIR [TARGET_DIR] [-- CONSTRUCTOR_ARGS...]
# TARGET_DIR is only needed for Rust workspace members (defaults to PKG_DIR).
deploy() {
  local alias="$1" pkg_dir="$2"
  local target_dir="$pkg_dir"
  shift 2

  # Optional third positional arg: target_dir (if it doesn't start with --)
  if [[ "${1:-}" != "--" && "${1:-}" != "" && "${1:-}" != -* ]]; then
    target_dir="$1"; shift
  fi

  local wasm
  wasm=$(cargo_wasm_path "$pkg_dir" "$target_dir")

  if [ ! -f "$wasm" ]; then
    warn "WASM not found: $wasm — did you run 'make build'? Skipping $alias"
    FAILED=$((FAILED + 1))
    return 1
  fi

  local constructor_args=()
  if [[ "${1:-}" == "--" ]]; then
    shift
    constructor_args=("$@")
  fi

  log "Deploying $alias ..."
  log "  wasm: $wasm"

  local cmd=(stellar contract deploy
    --wasm "$wasm"
    --source-account "$SOURCE"
    --network "$NETWORK"
    --alias "$alias"
    --inclusion-fee 1000000)

  [ ${#constructor_args[@]} -gt 0 ] && cmd+=(-- "${constructor_args[@]}")

  local contract_id
  # Progress info goes to stderr (visible in terminal), contract ID to stdout (captured)
  if contract_id=$("${cmd[@]}"); then
    save_id "$alias" "$contract_id"
    ok "$alias → $contract_id"
    DEPLOYED=$((DEPLOYED + 1))
  else
    warn "Deploy failed for $alias (see error above)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# ── setup ─────────────────────────────────────────────────────────────────────

section "Setup"

SOURCE_ADDRESS=$(stellar keys public-key "$SOURCE" 2>/dev/null) \
  || { echo "ERROR: Identity '$SOURCE' not found. Run: stellar keys generate $SOURCE --network $NETWORK --fund"; exit 1; }

log "Network:  $NETWORK"
log "Source:   $SOURCE"
log "Address:  $SOURCE_ADDRESS"

log "Funding account via Friendbot (no-op if already funded) ..."
stellar keys fund "$SOURCE" --network "$NETWORK" 2>/dev/null || true

# ── stage 1: standalone contracts (no constructor args) ───────────────────────

section "Stage 1 — Standalone (no constructor)"

deploy "rtu-hello-world"         "hello_world"             || true
deploy "rtu-increment"           "increment"               || true
deploy "rtu-auth"                "auth"                    || true
deploy "rtu-custom-types"        "custom_types"            || true
deploy "rtu-errors"              "errors"                  || true
deploy "rtu-events"              "events"                  || true
deploy "rtu-logging"             "logging"                 || true
deploy "rtu-ttl"                 "ttl"                     || true
deploy "rtu-alloc"               "alloc"                   || true
deploy "rtu-other-custom-types"  "other_custom_types"      || true
deploy "rtu-pause"               "pause"                   || true
deploy "rtu-atomic-swap"         "atomic_swap"             || true
deploy "rtu-atomic-multiswap"    "atomic_multiswap"        || true
deploy "rtu-timelock"            "timelock"                || true
deploy "rtu-single-offer"        "single_offer"            || true
deploy "rtu-deep-contract-auth"  "deep_contract_auth"      || true
deploy "rtu-eth-abi"             "eth_abi"                 || true
deploy "rtu-fuzzing"             "fuzzing"                 || true
deploy "rtu-groth16-verifier"    "groth16_verifier"        || true
deploy "rtu-import-ark-bn254"    "import_ark_bn254"        || true
deploy "rtu-increment-with-fuzz" "increment_with_fuzz"     || true

# Workspace members: target/ lives in the workspace root
deploy "rtu-cross-contract-a"     "cross_contract/contract_a"                        || true
deploy "rtu-workspace-contract-a" "workspace/contract_a"   "workspace"               || true

# ── stage 2: contracts that need source/admin address ─────────────────────────

section "Stage 2 — Constructor with source/admin address"

deploy "rtu-token"  "token" -- \
  --admin "$SOURCE_ADDRESS" --decimal 7 --name "RTU Token" --symbol RTU             || true

# Deploy token twice more for contracts that need two different token addresses
deploy "rtu-token-a" "token" -- \
  --admin "$SOURCE_ADDRESS" --decimal 7 --name "RTU Token A" --symbol RTUA          || true
deploy "rtu-token-b" "token" -- \
  --admin "$SOURCE_ADDRESS" --decimal 7 --name "RTU Token B" --symbol RTUB          || true

deploy "rtu-mint-lock" "mint-lock" -- \
  --admin "$SOURCE_ADDRESS"                                                         || true

deploy "rtu-deployer-contract" "deployer/contract" -- \
  --value 42                                                                          || true

deploy "rtu-deployer" "deployer/deployer" -- \
  --admin "$SOURCE_ADDRESS"                                                         || true

deploy "rtu-upgradeable-old" "upgradeable_contract/old_contract" -- \
  --admin "$SOURCE_ADDRESS"                                                         || true

deploy "rtu-upgradeable-new" "upgradeable_contract/new_contract" -- \
  --admin "$SOURCE_ADDRESS"                                                         || true

# ── stage 3: contracts that depend on prior deployments ───────────────────────

section "Stage 3 — Dependent contracts"

# cross_contract_b calls contract_a at runtime (no constructor arg needed)
deploy "rtu-cross-contract-b" "cross_contract/contract_b"                            || true

# workspace_contract_b calls workspace_a at runtime (no constructor arg needed)
deploy "rtu-workspace-contract-b" "workspace/contract_b" "workspace"                 || true

# increment_with_pause needs the pause contract address
PAUSE_ID=$(get_id "rtu-pause")
if [ -n "$PAUSE_ID" ]; then
  deploy "rtu-increment-with-pause" "increment_with_pause" -- --pause "$PAUSE_ID"   || true
else
  warn "rtu-pause not deployed — skipping rtu-increment-with-pause"
  FAILED=$((FAILED + 1))
fi

# liquidity_pool needs token_a < token_b lexicographically
TOKEN_A=$(get_id "rtu-token-a")
TOKEN_B=$(get_id "rtu-token-b")
if [ -n "$TOKEN_A" ] && [ -n "$TOKEN_B" ]; then
  # Sort tokens: the contract requires token_wasm_a < token_wasm_b
  if [[ "$TOKEN_A" < "$TOKEN_B" ]]; then
    FIRST="$TOKEN_A"; SECOND="$TOKEN_B"
  else
    FIRST="$TOKEN_B"; SECOND="$TOKEN_A"
  fi
  deploy "rtu-liquidity-pool" "liquidity_pool" -- \
    --token-a "$FIRST" --token-b "$SECOND"                                           || true
else
  warn "Token contracts not deployed — skipping rtu-liquidity-pool"
  FAILED=$((FAILED + 1))
fi

# ── stage 4: complex contracts (best-effort deploy) ───────────────────────────

section "Stage 4 — Complex (best effort)"

# account needs Vec<BytesN<32>> — raw 32-byte ed25519 public keys, not G-addresses.
# Attempting deploy; will likely fail without raw key bytes.
deploy "rtu-account"        "account"                             || true
deploy "rtu-simple-account" "simple_account"                      || true

# bls_signature needs 96-byte BLS12-381 aggregate public key
deploy "rtu-bls-signature"  "bls_signature"                       || true

# merkle_distribution needs root_hash + funded token
deploy "rtu-merkle-distribution" "merkle_distribution"            || true

# privacy-pools: ZK workspace — uses workspace root as target dir
deploy "rtu-privacy-pools"  "privacy-pools/contract" "privacy-pools" || true

# multisig_1_of_n_account
deploy "rtu-multisig-1-of-n" "multisig_1_of_n_account/contract"  || true

# ── save results ──────────────────────────────────────────────────────────────

section "Results"

echo "$RESULTS" | jq '.' > "$OUTPUT_FILE"

echo ""
echo "Deployed: $DEPLOYED contracts"
echo "Failed:   $FAILED contracts"
echo "Saved contract IDs to: $OUTPUT_FILE"
echo ""
echo "Next: bash scripts/generate-bindings.sh"
