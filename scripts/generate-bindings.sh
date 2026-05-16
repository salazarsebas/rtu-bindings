#!/usr/bin/env bash
# Generate TypeScript bindings for all Soroban example contracts.
#
# For each contract:
#   - If deployed (found in testnet-contracts.json): uses --contract-id for rich bindings
#     that include the network and deployed contract address.
#   - If not deployed: uses --wasm for interface-only bindings (no network/address).
#
# All generated packages are placed in bindings/<slug>/ and their package.json is
# patched with the correct @rtu-bindings scope, version, and metadata.
#
# Usage:
#   bash scripts/generate-bindings.sh
#   PACKAGE_VERSION=0.2.0 bash scripts/generate-bindings.sh

set -euo pipefail

NETWORK="${STELLAR_NETWORK:-testnet}"
BINDINGS_DIR="bindings"
CONTRACTS_FILE="testnet-contracts.json"
PACKAGE_SCOPE="@rtu-bindings"
PACKAGE_VERSION="${PACKAGE_VERSION:-0.1.0}"
REPO_URL="git+https://github.com/Acachete-Labs/rtu-bindings.git"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

GENERATED=0
FAILED=0

# ── helpers ───────────────────────────────────────────────────────────────────

log()    { echo "▶  $*"; }
ok()     { echo "✓  $*"; }
warn()   { echo "⚠  $*" >&2; }
section(){ echo ""; echo "══ $* ══"; }

cargo_wasm_path() {
  local pkg_dir="$1"
  local target_dir="${2:-$1}"
  local pkg_name
  pkg_name=$(grep -m1 '^name = ' "$pkg_dir/Cargo.toml" 2>/dev/null \
    | sed 's/name = "\(.*\)"/\1/' | tr '-' '_')
  echo "$target_dir/target/wasm32v1-none/release/${pkg_name}.wasm"
}

get_contract_id() {
  jq -r --arg a "$1" '.[$a] // empty' "$CONTRACTS_FILE" 2>/dev/null
}

# patch_package_json OUT_DIR SLUG DESCRIPTION CONTRACT_DIR
patch_package_json() {
  local out_dir="$1" slug="$2" description="$3" contract_dir="$4"
  local pkg_json="$out_dir/package.json"
  local full_name="${PACKAGE_SCOPE}/${slug}"

  jq \
    --arg name    "$full_name" \
    --arg ver     "$PACKAGE_VERSION" \
    --arg desc    "$description" \
    --arg repo    "$REPO_URL" \
    --arg hmpg    "https://github.com/Acachete-Labs/rtu-bindings/tree/main/${contract_dir}" \
    '.name        = $name
     | .version   = $ver
     | .description = $desc
     | .keywords  = ["stellar","soroban","smart-contract","blockchain","typescript","rtu-bindings"]
     | .repository = {"type":"git","url":$repo}
     | .homepage  = $hmpg
     | .publishConfig = {"access":"public"}' \
    "$pkg_json" > /tmp/rtu_pkg.json \
  && mv /tmp/rtu_pkg.json "$pkg_json"
}

# generate ALIAS SLUG DESCRIPTION PKG_DIR [TARGET_DIR]
generate() {
  local alias="$1" slug="$2" description="$3" pkg_dir="$4"
  local target_dir="${5:-$pkg_dir}"
  local out_dir="$BINDINGS_DIR/$slug"

  local contract_id
  contract_id=$(get_contract_id "$alias")

  if [ -n "$contract_id" ]; then
    log "Generating $slug (from contract-id: $contract_id) ..."
    stellar contract bindings typescript \
      --contract-id "$contract_id" \
      --network "$NETWORK" \
      --output-dir "$out_dir" \
      --overwrite \
    || {
      warn "Bindings via contract-id failed for $alias — falling back to --wasm"
      contract_id=""
    }
  fi

  if [ -z "$contract_id" ]; then
    local wasm
    wasm=$(cargo_wasm_path "$pkg_dir" "$target_dir")
    if [ ! -f "$wasm" ]; then
      warn "No WASM found at $wasm and no deployed contract-id for $alias. Skipping $slug."
      FAILED=$((FAILED + 1))
      return 0
    fi
    log "Generating $slug (from wasm: $wasm) ..."
    stellar contract bindings typescript \
      --wasm "$wasm" \
      --output-dir "$out_dir" \
      --overwrite \
    || { warn "Bindings generation failed for $slug"; FAILED=$((FAILED + 1)); return 0; }
  fi

  patch_package_json "$out_dir" "$slug" "$description" "$pkg_dir" \
    || { warn "Failed to patch package.json for $slug"; FAILED=$((FAILED + 1)); return 0; }
  ok "${PACKAGE_SCOPE}/${slug}@${PACKAGE_VERSION}"
  GENERATED=$((GENERATED + 1))
}

# ── generate all bindings ─────────────────────────────────────────────────────

mkdir -p "$BINDINGS_DIR"

section "Stage 1 — Standalone contracts"

generate "rtu-hello-world" "soroban-hello-world" \
  "TypeScript bindings for the Soroban Hello World example contract" \
  "hello_world"

generate "rtu-increment" "soroban-increment" \
  "TypeScript bindings for the Soroban Increment example contract" \
  "increment"

generate "rtu-auth" "soroban-auth" \
  "TypeScript bindings for the Soroban Auth example contract" \
  "auth"

generate "rtu-custom-types" "soroban-custom-types" \
  "TypeScript bindings for the Soroban Custom Types example contract" \
  "custom_types"

generate "rtu-errors" "soroban-errors" \
  "TypeScript bindings for the Soroban Errors example contract" \
  "errors"

generate "rtu-events" "soroban-events" \
  "TypeScript bindings for the Soroban Events example contract" \
  "events"

generate "rtu-logging" "soroban-logging" \
  "TypeScript bindings for the Soroban Logging example contract" \
  "logging"

generate "rtu-ttl" "soroban-ttl" \
  "TypeScript bindings for the Soroban TTL (Time-To-Live) example contract" \
  "ttl"

generate "rtu-alloc" "soroban-alloc" \
  "TypeScript bindings for the Soroban Alloc (memory allocation) example contract" \
  "alloc"

generate "rtu-other-custom-types" "soroban-other-custom-types" \
  "TypeScript bindings for the Soroban Other Custom Types example contract" \
  "other_custom_types"

generate "rtu-pause" "soroban-pause" \
  "TypeScript bindings for the Soroban Pause example contract" \
  "pause"

generate "rtu-atomic-swap" "soroban-atomic-swap" \
  "TypeScript bindings for the Soroban Atomic Swap example contract" \
  "atomic_swap"

generate "rtu-atomic-multiswap" "soroban-atomic-multiswap" \
  "TypeScript bindings for the Soroban Atomic Multiswap example contract" \
  "atomic_multiswap"

generate "rtu-timelock" "soroban-timelock" \
  "TypeScript bindings for the Soroban Timelock example contract" \
  "timelock"

generate "rtu-single-offer" "soroban-single-offer" \
  "TypeScript bindings for the Soroban Single Offer example contract" \
  "single_offer"

generate "rtu-deep-contract-auth" "soroban-deep-contract-auth" \
  "TypeScript bindings for the Soroban Deep Contract Auth example contract" \
  "deep_contract_auth"

generate "rtu-eth-abi" "soroban-eth-abi" \
  "TypeScript bindings for the Soroban Ethereum ABI decoding example contract" \
  "eth_abi"

generate "rtu-fuzzing" "soroban-fuzzing" \
  "TypeScript bindings for the Soroban Fuzzing example contract (timelock variant)" \
  "fuzzing"

generate "rtu-groth16-verifier" "soroban-groth16-verifier" \
  "TypeScript bindings for the Soroban Groth16 zero-knowledge proof verifier contract" \
  "groth16_verifier"

generate "rtu-import-ark-bn254" "soroban-import-ark-bn254" \
  "TypeScript bindings for the Soroban Ark BN254 elliptic curve example contract" \
  "import_ark_bn254"

generate "rtu-increment-with-fuzz" "soroban-increment-with-fuzz" \
  "TypeScript bindings for the Soroban Increment with Fuzz Testing example contract" \
  "increment_with_fuzz"

generate "rtu-cross-contract-a" "soroban-cross-contract-a" \
  "TypeScript bindings for Soroban Cross Contract Call example — Contract A" \
  "cross_contract/contract_a"

generate "rtu-workspace-contract-a" "soroban-workspace-contract-a" \
  "TypeScript bindings for Soroban Workspace example — Contract A" \
  "workspace/contract_a" "workspace"

section "Stage 2 — Contracts with admin constructor"

generate "rtu-token" "soroban-token" \
  "TypeScript bindings for the Soroban Token contract implementing the Token Interface" \
  "token"

generate "rtu-mint-lock" "soroban-mint-lock" \
  "TypeScript bindings for the Soroban Mint Lock example contract" \
  "mint-lock"

generate "rtu-deployer-contract" "soroban-deployer-contract" \
  "TypeScript bindings for the Soroban Deployer test contract (stores a value)" \
  "deployer/contract"

generate "rtu-deployer" "soroban-deployer" \
  "TypeScript bindings for the Soroban Deployer factory contract" \
  "deployer/deployer"

generate "rtu-upgradeable-old" "soroban-upgradeable-old" \
  "TypeScript bindings for the Soroban Upgradeable Contract (v1 — before upgrade)" \
  "upgradeable_contract/old_contract"

generate "rtu-upgradeable-new" "soroban-upgradeable-new" \
  "TypeScript bindings for the Soroban Upgradeable Contract (v2 — after upgrade)" \
  "upgradeable_contract/new_contract"

section "Stage 3 — Dependent contracts"

generate "rtu-cross-contract-b" "soroban-cross-contract-b" \
  "TypeScript bindings for Soroban Cross Contract Call example — Contract B (calls Contract A)" \
  "cross_contract/contract_b"

generate "rtu-workspace-contract-b" "soroban-workspace-contract-b" \
  "TypeScript bindings for Soroban Workspace example — Contract B (calls Contract A)" \
  "workspace/contract_b" "workspace"

generate "rtu-increment-with-pause" "soroban-increment-with-pause" \
  "TypeScript bindings for the Soroban Increment with Pause example contract" \
  "increment_with_pause"

generate "rtu-liquidity-pool" "soroban-liquidity-pool" \
  "TypeScript bindings for the Soroban Liquidity Pool AMM example contract" \
  "liquidity_pool"

section "Stage 4 — Complex contracts (best effort)"

generate "rtu-account" "soroban-account" \
  "TypeScript bindings for the Soroban multi-sig Account contract" \
  "account"

generate "rtu-simple-account" "soroban-simple-account" \
  "TypeScript bindings for the Soroban Simple Account contract (single ed25519 key)" \
  "simple_account"

generate "rtu-bls-signature" "soroban-bls-signature" \
  "TypeScript bindings for the Soroban BLS Signature account contract" \
  "bls_signature"

generate "rtu-merkle-distribution" "soroban-merkle-distribution" \
  "TypeScript bindings for the Soroban Merkle Distribution contract" \
  "merkle_distribution"

generate "rtu-privacy-pools" "soroban-privacy-pools" \
  "TypeScript bindings for the Soroban Privacy Pools prototype contract (ZK)" \
  "privacy-pools/contract" "privacy-pools"

generate "rtu-multisig-1-of-n" "soroban-multisig-1-of-n" \
  "TypeScript bindings for the Soroban 1-of-N Multisig Account contract" \
  "multisig_1_of_n_account/contract"

# ── summary ───────────────────────────────────────────────────────────────────

section "Results"

echo ""
echo "Generated: $GENERATED packages"
echo "Failed:    $FAILED packages"
echo ""
echo "Packages are in: $BINDINGS_DIR/"
echo ""
echo "Next:"
echo "  git add bindings/ testnet-contracts.json"
echo "  git commit -m 'chore: update testnet deployments and bindings v${PACKAGE_VERSION}'"
echo "  git push"
echo "  # Then trigger 'Publish Bindings to npm' workflow in GitHub Actions"
