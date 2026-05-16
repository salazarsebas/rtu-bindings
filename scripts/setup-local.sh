#!/usr/bin/env bash
# Full local setup: build all contracts, deploy to testnet, generate TypeScript bindings.
#
# Prerequisites (run once):
#   stellar keys generate acachete --network testnet --fund
#
# Usage:
#   bash scripts/setup-local.sh
#   PACKAGE_VERSION=0.2.0 bash scripts/setup-local.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PACKAGE_VERSION="${PACKAGE_VERSION:-0.1.0}"
NETWORK="${STELLAR_NETWORK:-testnet}"
SOURCE="${STELLAR_SOURCE:-acachete}"

echo "═══════════════════════════════════════════"
echo " RTU Bindings — Local Setup"
echo " Network:  $NETWORK"
echo " Version:  $PACKAGE_VERSION"
echo "═══════════════════════════════════════════"
echo ""

# ── 1. Build ──────────────────────────────────────────────────────────────────

echo "══ Step 1/3: Building all contracts ══"
echo ""

BUILD_OK=0
BUILD_FAIL=0

# Build each Rust contract directory that has a proper 'build' target in its Makefile.
# We avoid using the root Makefile because some nested Makefiles (e.g. privacy-pools/circuits)
# don't have a 'build' target and would abort the root make.
while IFS= read -r mkfile; do
  dir=$(dirname "$mkfile")
  # Only process Rust contract crates; skip helper tools such as Deno/JS utilities.
  if [ -f "$dir/Cargo.toml" ] && grep -q '^build:' "$mkfile"; then
    printf "  Building %-45s" "$dir ..."
    if (cd "$dir" && make build > /dev/null 2>&1); then
      echo "✓"
      BUILD_OK=$((BUILD_OK + 1))
    else
      echo "⚠ (failed)"
      BUILD_FAIL=$((BUILD_FAIL + 1))
    fi
  fi
done < <(find . -name 'Makefile' -mindepth 2 -maxdepth 3 ! -path '*/node_modules/*' | sort)

echo ""
echo "Build complete: $BUILD_OK ok, $BUILD_FAIL failed"

# ── 2. Deploy ─────────────────────────────────────────────────────────────────

echo ""
echo "══ Step 2/3: Deploying contracts to $NETWORK ══"
echo ""
STELLAR_NETWORK="$NETWORK" STELLAR_SOURCE="$SOURCE" bash scripts/deploy-contracts.sh

# ── 3. Generate bindings ──────────────────────────────────────────────────────

echo ""
echo "══ Step 3/3: Generating TypeScript bindings ══"
echo ""
STELLAR_NETWORK="$NETWORK" PACKAGE_VERSION="$PACKAGE_VERSION" bash scripts/generate-bindings.sh

# ── Done ──────────────────────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════"
echo " Setup complete!"
echo "═══════════════════════════════════════════"
echo ""
echo "Commit and push the generated files:"
echo ""
echo "  git add bindings/ testnet-contracts.json"
echo "  git commit -m 'chore: deploy contracts to $NETWORK and generate bindings v${PACKAGE_VERSION}'"
echo "  git push"
echo ""
echo "Then publish to npm via GitHub Actions:"
echo "  Actions → 'Publish Bindings to npm' → Run workflow → version: $PACKAGE_VERSION"
echo ""
