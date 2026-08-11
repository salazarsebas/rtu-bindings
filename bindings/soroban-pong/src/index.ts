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
    contractId: "CB3LCKK56VNWR34SNLSKY5S2CUCX6HAF7D4BY2I273ZSGHLFP55BN6PG",
  }
} as const


/**
 * Game state for external API
 */
export interface GameState {
  ball_vx: i32;
  ball_vy: i32;
  ball_x: i32;
  ball_y: i32;
  game_active: boolean;
  player1_paddle_y: i32;
  player1_score: u32;
  player2_paddle_y: i32;
  player2_score: u32;
}


/**
 * Ball component - demonstrates Cougr-Core Component pattern
 */
export interface BallComponent {
  vx: i32;
  vy: i32;
  x: i32;
  y: i32;
}


/**
 * ECS World State - serializable version using Cougr-Core component pattern
 * This demonstrates how Cougr-Core organizes game data into components
 */
export interface ECSWorldState {
  /**
 * Entity 2: Ball with BallComponent
 */
ball: BallComponent;
  /**
 * Entity 0: Player 1 Paddle with PaddleComponent
 */
player1_paddle: PaddleComponent;
  /**
 * Entity 1: Player 2 Paddle with PaddleComponent
 */
player2_paddle: PaddleComponent;
  /**
 * Entity 3: Game Score with ScoreComponent
 */
score: ScoreComponent;
}


/**
 * Score component - demonstrates Cougr-Core Component pattern
 */
export interface ScoreComponent {
  game_active: boolean;
  player1_score: u32;
  player2_score: u32;
}


/**
 * Paddle component - demonstrates Cougr-Core Component pattern
 */
export interface PaddleComponent {
  player_id: u32;
  y_position: i32;
}





/**
 * Simplified game world optimized for Soroban on-chain storage.
 * 
 * Uses `Map`-based storage for O(log n) component lookups instead of
 * linear scans. This is the recommended ECS container for Soroban contracts.
 * 
 * ## Dual-Map storage
 * 
 * Components are split into two maps based on their `ComponentStorage` kind:
 * - **Table** (`components`): Frequently-iterated components (e.g., Position, Velocity).
 * Queried by `get_entities_with_component()`.
 * - **Sparse** (`sparse_components`): Infrequently-accessed marker or tag components.
 * Not included in the default entity query; use `get_all_entities_with_component()` to include them.
 * 
 * Both maps are transparent to `get_component()`, `has_component()`, and `remove_component()`.
 * 
 * # Example
 * ```
 * use cougr_core::component::ComponentStorage;
 * use cougr_core::simple_world::SimpleWorld;
 * use soroban_sdk::{symbol_short, Bytes, Env};
 * 
 * let env = Env::default();
 * let mut world = SimpleWorld::new(&env);
 * let entity_id = world.spawn_entity();
 * world.add_component(entity_id, symbol_short!("position"), Byt
 */
export interface SimpleWorld {
  /**
 * Direct index for all components regardless of backing storage.
 */
all_index: Map<string, Array<u32>>;
  /**
 * Table component data keyed by (entity_id, component_type).
 */
components: Map<readonly [u32, string], Buffer>;
  /**
 * Tracks which component types each entity has.
 */
entity_components: Map<u32, Array<string>>;
  next_entity_id: u32;
  /**
 * Sparse component data keyed by (entity_id, component_type).
 */
sparse_components: Map<readonly [u32, string], Buffer>;
  /**
 * Direct index for frequently queried table-backed components.
 */
table_index: Map<string, Array<u32>>;
  /**
 * Version counter incremented on structural changes (add/remove/despawn).
 * Used for query cache invalidation.
 */
version: u64;
}

/**
 * Error types for the Cougr ECS framework.
 * 
 * Uses `#[contracterror]` for Soroban contract compatibility.
 * Each variant maps to a `u32` error code for on-chain error reporting.
 */
export const CougrError = {
  /**
   * Entity with the given ID was not found
   */
  1: {message:"EntityNotFound"},
  /**
   * Component not found for the given entity
   */
  2: {message:"ComponentNotFound"},
  /**
   * Failed to deserialize component/resource data
   */
  3: {message:"DeserializationFailed"},
  /**
   * Data length does not match expected size
   */
  4: {message:"InvalidDataLength"},
  /**
   * Index out of bounds during storage access
   */
  5: {message:"IndexOutOfBounds"},
  /**
   * Resource with the given type was not found
   */
  6: {message:"ResourceNotFound"},
  /**
   * Storage operation failed
   */
  7: {message:"StorageError"}
}


export interface Event {
  data: Buffer;
  event_type: string;
  timestamp: u64;
}


export interface DamageEvent {
  damage_amount: i32;
  damage_type: string;
  target_entity: u64;
}


export interface CollisionEvent {
  collision_type: string;
  entity_a: u64;
  entity_b: u64;
}


export interface Resource {
  data: Buffer;
  resource_type: string;
}


export interface GameState {
  is_game_over: boolean;
  level: i32;
  score: i32;
}


export interface Token {
  amount: u32;
  hash: Buffer;
}


export interface Health {
  current: u128;
  max: u128;
}


export interface Position {
  x: i32;
  y: i32;
}


export interface Velocity {
  x: i32;
  y: i32;
}


export interface Component {
  component_type: string;
  data: Buffer;
  storage: ComponentStorage;
}

export enum ComponentStorage {
  Table = 0,
  Sparse = 1,
}


/**
 * World that groups entities by archetype for efficient queries.
 * 
 * Each unique combination of component types forms an archetype.
 * Entities with the same component set share an archetype, enabling
 * batch iteration without per-entity type checks.
 */
export interface ArchetypeWorld {
  archetype_index: Map<Array<string>, u32>;
  archetypes: Map<u32, Archetype>;
  entity_archetype: Map<u32, u32>;
  next_archetype_id: u32;
  next_entity_id: u32;
  version: u64;
}


/**
 * An archetype groups entities with the exact same component set.
 * 
 * Entities in the same archetype share the same component types, enabling
 * efficient batch iteration. Component data is stored per (entity, type).
 */
export interface Archetype {
  /**
 * Sorted list of component types in this archetype.
 */
component_types: Array<string>;
  /**
 * Component data keyed by (entity_id, component_type).
 */
data: Map<readonly [u32, string], Buffer>;
  /**
 * List of entity IDs in this archetype.
 */
entities: Array<u32>;
  /**
 * Unique archetype identifier.
 */
id: u32;
}


/**
 * Pedersen commitment parameters: two independent G1 generator points.
 * 
 * `g` is the "value generator" and `h` is the "blinding generator".
 * These must be chosen such that the discrete log of `h` with respect to `g`
 * is unknown (nothing-up-my-sleeve construction recommended).
 */
export interface PedersenParams {
  /**
 * Value generator point (G1).
 */
g: G1Point;
  /**
 * Blinding generator point (G1).
 */
h: G1Point;
}


/**
 * A Pedersen commitment point on BN254 G1.
 */
export interface PedersenCommitment {
  /**
 * The commitment point C = v*G + r*H.
 */
point: G1Point;
}


/**
 * Stores a Poseidon hash commitment of private game state.
 * 
 * Used for fog-of-war, hidden inventories, or any state that
 * should be verifiable without revealing the actual data.
 */
export interface HiddenState {
  /**
 * Poseidon hash of the private state.
 */
commitment: Buffer;
  /**
 * Owner of this hidden state.
 */
owner: string;
}


/**
 * Commit-reveal two-phase pattern component.
 * 
 * Phase 1 (Commit): Player submits a hash of their action.
 * Phase 2 (Reveal): Player reveals the actual action + nonce.
 * If the reveal deadline passes without a reveal, the commitment expires.
 */
export interface CommitReveal {
  /**
 * Hash of the committed action (e.g., Poseidon(action || nonce)).
 */
commitment: Buffer;
  /**
 * Deadline for revealing the committed action.
 */
reveal_deadline: u64;
  /**
 * Whether the action has been revealed.
 */
revealed: boolean;
}


/**
 * Marker component for entities with verified proofs.
 * 
 * Added after a `ProofSubmission` passes verification.
 * Can be cleaned up after a configurable age.
 */
export interface VerifiedMarker {
  /**
 * Type/category of the proof that was verified.
 */
proof_type: string;
  /**
 * Ledger timestamp when verification occurred.
 */
verified_at: u64;
}


/**
 * A pending proof submission attached to an entity.
 * 
 * The proof must be verified before the deadline. Once verified,
 * a `VerifiedMarker` is added and this component is removed.
 */
export interface ProofSubmission {
  /**
 * Deadline ledger timestamp for verification.
 */
deadline: u64;
  /**
 * The Groth16 proof to be verified.
 */
proof: Groth16Proof;
  /**
 * Public inputs for verification.
 */
public_inputs: Array<Scalar>;
  /**
 * Ledger timestamp when the proof was submitted.
 */
submitted_at: u64;
  /**
 * Whether this proof has been verified.
 */
verified: boolean;
}

/**
 * Error types for the Cougr ZK subsystem.
 */
export const ZKError = {
  /**
   * The submitted proof is structurally invalid.
   */
  10: {message:"InvalidProof"},
  /**
   * An elliptic curve point is not on the curve or not in the subgroup.
   */
  11: {message:"InvalidPoint"},
  /**
   * A scalar value is out of range for the target field.
   */
  12: {message:"InvalidScalar"},
  /**
   * Proof verification failed (valid structure, but proof is incorrect).
   */
  13: {message:"VerificationFailed"},
  /**
   * Input data is malformed or has the wrong length.
   */
  14: {message:"InvalidInput"},
  /**
   * The verification key is malformed or incompatible with the proof.
   */
  15: {message:"InvalidVerificationKey"},
  /**
   * The circuit type does not match the expected verification key.
   */
  16: {message:"CircuitMismatch"},
  /**
   * Public inputs do not match the circuit's expected format.
   */
  17: {message:"InvalidPublicInput"},
  /**
   * Merkle tree cannot be constructed from empty leaves.
   */
  18: {message:"EmptyTree"},
  /**
   * Leaf index is out of bounds for the tree.
   */
  19: {message:"LeafOutOfBounds"},
  /**
   * Merkle proof has invalid length (doesn't match tree depth).
   */
  20: {message:"InvalidProofLength"},
  /**
   * Merkle inclusion proof verification failed.
   */
  21: {message:"MerkleVerificationFailed"},
  /**
   * Tree depth exceeds the maximum allowed depth.
   */
  22: {message:"MaxDepthExceeded"},
  /**
   * Leaf data is invalid or malformed.
   */
  23: {message:"InvalidLeaf"},
  /**
   * A state transition violates the explicit phase-3 orchestration contract.
   */
  24: {message:"InvalidStateTransition"},
  /**
   * A transition arrived after its allowed dispute or reveal window.
   */
  25: {message:"DeadlineExpired"},
  /**
   * The requested operation cannot proceed because the channel is already closed.
   */
  26: {message:"ChannelClosed"},
  /**
   * A fog-of-war exploration target lies outside the allowed visibility window.
   */
  27: {message:"InvalidVisibility"},
  /**
   * A recursive composition descriptor is malformed or exceeds declared bounds.
   */
  28: {message:"InvalidProofComposition"}
}


/**
 * A BN254 scalar field element (Fr, 32 bytes).
 */
export interface Scalar {
  bytes: Buffer;
}


/**
 * A BN254 G1 affine point (compressed, 64 bytes serialized).
 * 
 * Wraps the soroban-sdk `Bn254G1Affine` for use in Cougr contract types.
 */
export interface G1Point {
  bytes: Buffer;
}


/**
 * A BN254 G2 affine point (compressed, 128 bytes serialized).
 */
export interface G2Point {
  bytes: Buffer;
}


/**
 * A Groth16 proof consisting of three curve points (A ∈ G1, B ∈ G2, C ∈ G1).
 */
export interface Groth16Proof {
  a: G1Point;
  b: G2Point;
  c: G1Point;
}


/**
 * A BLS12-381 Fr scalar field element (32 bytes).
 */
export interface Bls12381Scalar {
  bytes: Buffer;
}


/**
 * A BLS12-381 G1 affine point (96 bytes serialized).
 */
export interface Bls12381G1Point {
  bytes: Buffer;
}


/**
 * A BLS12-381 G2 affine point (192 bytes serialized).
 */
export interface Bls12381G2Point {
  bytes: Buffer;
}


/**
 * A Groth16 verification key.
 */
export interface VerificationKey {
  /**
 * Alpha point (G1)
 */
alpha: G1Point;
  /**
 * Beta point (G2)
 */
beta: G2Point;
  /**
 * Delta point (G2)
 */
delta: G2Point;
  /**
 * Gamma point (G2)
 */
gamma: G2Point;
  /**
 * IC (input commitment) points (G1), one per public input + 1
 */
ic: Array<G1Point>;
}


/**
 * Off-chain state channel tracked by on-chain commitments and dispute metadata.
 */
export interface ZkStateChannel {
  channel_id: Buffer;
  closed: boolean;
  dispute_deadline: u64;
  participants_root: Buffer;
  round: u64;
  state_root: Buffer;
}


/**
 * Snapshot of a player's currently visible fog-of-war state.
 */
export interface FogOfWarSnapshot {
  /**
 * Merkle root of the tiles the player has already explored.
 */
explored_root: Buffer;
  /**
 * Merkle root of the hidden map or board state.
 */
map_root: Buffer;
  /**
 * Player origin used by the exploration circuit.
 */
origin_x: i32;
  origin_y: i32;
  /**
 * Maximum Euclidean distance the player may reveal from the origin.
 */
visibility_radius: u32;
}


/**
 * Root transition for a single fog-of-war exploration update.
 */
export interface FogOfWarTransition {
  next_explored_root: Buffer;
  prior_explored_root: Buffer;
  tile_x: i32;
  tile_y: i32;
}


/**
 * Experimental descriptor for a recursive proof batch.
 */
export interface RecursiveProofLayout {
  accumulator_root: Buffer;
  final_state_root: Buffer;
  initial_state_root: Buffer;
  proof_count: u32;
}


/**
 * Proposed state transition for a multiplayer ZK state channel.
 */
export interface StateChannelTransition {
  next_state_root: Buffer;
  prior_state_root: Buffer;
  round: u64;
  submitted_at: u64;
}


/**
 * UI-facing session health returned by [`super::SessionManager::status`].
 */
export interface SessionStatus {
  active: boolean;
  expires_in: u64;
  key_id: Buffer;
  needs_renewal: boolean;
  remaining_operations: u32;
}


/**
 * Optional on-chain marker for the player's active gameplay session.
 * 
 * Games can store this as a rich component so off-chain clients can poll
 * [`crate::session::SessionStatus`] when `needs_renewal` becomes true.
 */
export interface ActiveSession {
  expires_at: u64;
  key_id: Buffer;
  needs_renewal: boolean;
  operations_remaining: u32;
}


/**
 * A registered device key with metadata.
 */
export interface DeviceKey {
  /**
 * Human-readable device name (e.g., "phone", "laptop").
 */
device_name: string;
  /**
 * Whether this device key is currently active.
 */
is_active: boolean;
  /**
 * Unique identifier for this device key.
 */
key_id: Buffer;
  /**
 * Ledger timestamp of the last use.
 */
last_used: u64;
  /**
 * Ledger timestamp when the device was registered.
 */
registered_at: u64;
}


/**
 * Policy for multi-device management.
 */
export interface DevicePolicy {
  /**
 * Number of ledger slots of inactivity before auto-revoke.
 * Set to 0 to disable auto-revoke.
 */
auto_revoke_after: u64;
  /**
 * Maximum number of devices that can be registered.
 */
max_devices: u32;
}


/**
 * A registered secp256r1 public key for WebAuthn/Passkey auth.
 */
export interface Secp256r1Key {
  /**
 * Human-readable label (e.g., "passkey_1", "yubikey").
 */
label: string;
  /**
 * SEC-1 uncompressed public key (65 bytes: 0x04 || x || y).
 */
public_key: Buffer;
  /**
 * Ledger timestamp when the key was registered.
 */
registered_at: u64;
}

/**
 * Account-related errors for the Cougr framework.
 */
export const AccountError = {
  20: {message:"Unauthorized"},
  21: {message:"SessionExpired"},
  22: {message:"InvalidSignature"},
  23: {message:"CapabilityNotSupported"},
  24: {message:"SessionLimitReached"},
  25: {message:"InvalidScope"},
  26: {message:"BatchEmpty"},
  27: {message:"BatchTooLarge"},
  28: {message:"StorageError"},
  29: {message:"GuardianAlreadyExists"},
  30: {message:"RecoveryNotInitiated"},
  31: {message:"TimelockNotExpired"},
  32: {message:"ThresholdNotMet"},
  33: {message:"MaxGuardiansReached"},
  34: {message:"DeviceLimitReached"},
  35: {message:"DeviceNotFound"},
  36: {message:"RecoveryAlreadyActive"},
  37: {message:"NonceMismatch"},
  38: {message:"ActionNotAllowed"},
  39: {message:"SessionBudgetExceeded"},
  40: {message:"IntentExpired"},
  41: {message:"InvalidIntent"},
  42: {message:"SignerMismatch"},
  43: {message:"SessionRevoked"},
  44: {message:"SignerNotRegistered"}
}


/**
 * A game action that can be authorized by an account.
 */
export interface GameAction {
  data: Buffer;
  system_name: string;
}


/**
 * A session key with its scope and usage tracking.
 */
export interface SessionKey {
  created_at: u64;
  key_id: Buffer;
  next_nonce: u64;
  operations_used: u32;
  scope: SessionScope;
}


/**
 * Defines the scope of a session key's permissions.
 */
export interface SessionScope {
  allowed_actions: Array<string>;
  expires_at: u64;
  max_operations: u32;
}


/**
 * Capabilities supported by an account.
 */
export interface AccountCapabilities {
  can_batch: boolean;
  has_passkey_auth: boolean;
  has_session_keys: boolean;
  has_social_recovery: boolean;
}


/**
 * Stable identifier for the signer used by an intent.
 */
export interface SignerRef {
  kind: IntentSigner;
  label: string;
  session_key_id: Buffer;
}

/**
 * Result of a successful authorization.
 */
export enum AuthMethod {
  Direct = 0,
  Session = 1,
  Passkey = 2,
}


/**
 * Structured authorization result returned by the kernel.
 */
export interface AuthResult {
  method: AuthMethod;
  nonce_consumed: u64;
  remaining_operations: u32;
  session_key_id: Buffer;
}


/**
 * Signature bytes for a signed intent.
 */
export interface IntentProof {
  kind: IntentProofKind;
  signature: Buffer;
}

/**
 * Supported intent signer kinds for the account kernel.
 */
export enum IntentSigner {
  Direct = 0,
  Session = 1,
  Passkey = 2,
}


/**
 * Canonical signed intent schema for account authorization.
 */
export interface SignedIntent {
  account: string;
  action: GameAction;
  action_hash: Buffer;
  expires_at: u64;
  nonce: u64;
  proof: IntentProof;
  signer: SignerRef;
}

/**
 * Signature container for intent verification.
 */
export enum IntentProofKind {
  None = 0,
  Secp256r1 = 1,
}


/**
 * A guardian that can participate in account recovery.
 */
export interface Guardian {
  /**
 * Ledger timestamp when the guardian was added.
 */
added_at: u64;
  /**
 * The guardian's Stellar address.
 */
address: string;
}


/**
 * Configuration for the recovery mechanism.
 */
export interface RecoveryConfig {
  /**
 * Maximum number of guardians allowed.
 */
max_guardians: u32;
  /**
 * Number of guardians required to approve a recovery.
 */
threshold: u32;
  /**
 * Ledger duration to wait after threshold is met before execution.
 */
timelock_period: u64;
}


/**
 * A pending account recovery request.
 */
export interface RecoveryRequest {
  /**
 * Addresses of guardians that have approved so far.
 */
approvals: Array<string>;
  /**
 * Whether this request has been cancelled.
 */
cancelled: boolean;
  /**
 * Ledger timestamp when recovery was initiated.
 */
initiated_at: u64;
  /**
 * The proposed new owner address.
 */
new_owner: string;
  /**
 * Earliest ledger timestamp when recovery can be executed.
 */
timelock_until: u64;
}

/**
 * Frozen identifier for a pre-built game circuit family.
 */
export enum CircuitId {
  HiddenCards = 1,
  FogOfWar = 2,
  FairDice = 3,
  SealedBid = 4,
}


/**
 * One slot in a frozen public-input layout.
 */
export interface PublicInputSlot {
  kind: string;
  name: string;
}


/**
 * Frozen public-input contract for a circuit family.
 */
export interface PublicInputLayout {
  slots: Array<PublicInputSlot>;
}


export interface RoleGrantedEvent {
  account: string;
  role: string;
  sender: string;
}


export interface RoleRevokedEvent {
  account: string;
  role: string;
  sender: string;
}


export interface RoleAdminChangedEvent {
  new_admin_role: string;
  previous_admin_role: string;
  role: string;
  sender: string;
}


export interface RecoveryGuardClearedEvent {
  account: string;
  cleared_at: u64;
}


export interface RecoveryGuardActivatedEvent {
  account: string;
  activated_at: u64;
}


export interface ExecutionGuardExitedEvent {
  guard_id: string;
}


export interface ExecutionGuardEnteredEvent {
  guard_id: string;
}


export interface DelayedOperation {
  action: string;
  executed: boolean;
  expires_at: u64;
  not_before: u64;
  operation_id: u64;
  payload: Buffer;
  scheduled_at: u64;
}


export interface DelayedExecutionExecutedEvent {
  action: string;
  executed_at: u64;
  operation_id: u64;
}


export interface DelayedExecutionCancelledEvent {
  action: string;
  operation_id: u64;
}


export interface DelayedExecutionScheduledEvent {
  action: string;
  expires_at: u64;
  not_before: u64;
  operation_id: u64;
}

/**
 * Errors returned by the reusable standards layer.
 */
export const StandardsError = {
  60: {message:"Unauthorized"},
  61: {message:"AlreadyInitialized"},
  62: {message:"OwnerNotSet"},
  63: {message:"PendingOwnerNotSet"},
  64: {message:"PendingOwnerMismatch"},
  65: {message:"RoleAlreadyGranted"},
  66: {message:"RoleNotGranted"},
  67: {message:"MissingRoleAdmin"},
  68: {message:"Paused"},
  69: {message:"NotPaused"},
  70: {message:"ExecutionLocked"},
  71: {message:"RecoveryActive"},
  72: {message:"RecoveryInactive"},
  73: {message:"BatchEmpty"},
  74: {message:"BatchTooLarge"},
  75: {message:"OperationNotReady"},
  76: {message:"OperationExpired"},
  77: {message:"OperationNotFound"},
  78: {message:"OperationAlreadyExecuted"},
  79: {message:"ExecutionNotLocked"}
}


export interface OwnershipTransferredEvent {
  new_owner: Option<string>;
  previous_owner: Option<string>;
}


export interface OwnershipTransferStartedEvent {
  owner: string;
  pending_owner: string;
}


export interface OwnershipTransferCancelledEvent {
  owner: string;
  pending_owner: string;
}


export interface PausedEvent {
  account: string;
}


export interface UnpausedEvent {
  account: string;
}


/**
 * Metadata stored as a single persistent entry.
 */
export interface WorldMetadata {
  /**
 * Total number of live entities.
 */
entity_count: u32;
  /**
 * List of all live entity IDs.
 */
entity_ids: Array<u32>;
  /**
 * Next entity ID to assign.
 */
next_entity_id: u32;
  /**
 * Version counter for cache invalidation.
 */
version: u64;
}


/**
 * On-chain proof representation (`#[contracttype]` for contract arguments).
 */
export interface OnChainMerkleProof {
  /**
 * Tree depth.
 */
depth: u32;
  /**
 * The leaf hash.
 */
leaf: Buffer;
  /**
 * Index of the leaf in the tree.
 */
leaf_index: u32;
  /**
 * Packed direction bits (bit i = 1 means current node was on the right).
 */
path_bits: u32;
  /**
 * Sibling hashes along the path.
 */
siblings: Array<Buffer>;
}

export interface Client {
  /**
   * Construct and simulate a init_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize a new game using Cougr-Core ECS component pattern
   * Demonstrates: Entity creation with components
   */
  init_game: (options?: MethodOptions) => Promise<AssembledTransaction<GameState>>

  /**
   * Construct and simulate a reset_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Reset the game
   */
  reset_game: (options?: MethodOptions) => Promise<AssembledTransaction<GameState>>

  /**
   * Construct and simulate a move_paddle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Move a player's paddle
   * Demonstrates: Component query and update pattern from Cougr-Core
   */
  move_paddle: ({player, direction}: {player: u32, direction: i32}, options?: MethodOptions) => Promise<AssembledTransaction<GameState>>

  /**
   * Construct and simulate a update_tick transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update game tick - demonstrates Cougr-Core System pattern
   * Systems: PhysicsSystem, CollisionSystem, ScoringSystem
   */
  update_tick: (options?: MethodOptions) => Promise<AssembledTransaction<GameState>>

  /**
   * Construct and simulate a get_game_state transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current game state
   */
  get_game_state: (options?: MethodOptions) => Promise<AssembledTransaction<GameState>>

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
      new ContractSpec([ "AAAAAQAAABtHYW1lIHN0YXRlIGZvciBleHRlcm5hbCBBUEkAAAAAAAAAAAlHYW1lU3RhdGUAAAAAAAAJAAAAAAAAAAdiYWxsX3Z4AAAAAAUAAAAAAAAAB2JhbGxfdnkAAAAABQAAAAAAAAAGYmFsbF94AAAAAAAFAAAAAAAAAAZiYWxsX3kAAAAAAAUAAAAAAAAAC2dhbWVfYWN0aXZlAAAAAAEAAAAAAAAAEHBsYXllcjFfcGFkZGxlX3kAAAAFAAAAAAAAAA1wbGF5ZXIxX3Njb3JlAAAAAAAABAAAAAAAAAAQcGxheWVyMl9wYWRkbGVfeQAAAAUAAAAAAAAADXBsYXllcjJfc2NvcmUAAAAAAAAE",
        "AAAAAQAAADpCYWxsIGNvbXBvbmVudCAtIGRlbW9uc3RyYXRlcyBDb3Vnci1Db3JlIENvbXBvbmVudCBwYXR0ZXJuAAAAAAAAAAAADUJhbGxDb21wb25lbnQAAAAAAAAEAAAAAAAAAAJ2eAAAAAAABQAAAAAAAAACdnkAAAAAAAUAAAAAAAAAAXgAAAAAAAAFAAAAAAAAAAF5AAAAAAAABQ==",
        "AAAAAQAAAI5FQ1MgV29ybGQgU3RhdGUgLSBzZXJpYWxpemFibGUgdmVyc2lvbiB1c2luZyBDb3Vnci1Db3JlIGNvbXBvbmVudCBwYXR0ZXJuClRoaXMgZGVtb25zdHJhdGVzIGhvdyBDb3Vnci1Db3JlIG9yZ2FuaXplcyBnYW1lIGRhdGEgaW50byBjb21wb25lbnRzAAAAAAAAAAAADUVDU1dvcmxkU3RhdGUAAAAAAAAEAAAAIUVudGl0eSAyOiBCYWxsIHdpdGggQmFsbENvbXBvbmVudAAAAAAAAARiYWxsAAAH0AAAAA1CYWxsQ29tcG9uZW50AAAAAAAALkVudGl0eSAwOiBQbGF5ZXIgMSBQYWRkbGUgd2l0aCBQYWRkbGVDb21wb25lbnQAAAAAAA5wbGF5ZXIxX3BhZGRsZQAAAAAH0AAAAA9QYWRkbGVDb21wb25lbnQAAAAALkVudGl0eSAxOiBQbGF5ZXIgMiBQYWRkbGUgd2l0aCBQYWRkbGVDb21wb25lbnQAAAAAAA5wbGF5ZXIyX3BhZGRsZQAAAAAH0AAAAA9QYWRkbGVDb21wb25lbnQAAAAAKEVudGl0eSAzOiBHYW1lIFNjb3JlIHdpdGggU2NvcmVDb21wb25lbnQAAAAFc2NvcmUAAAAAAAfQAAAADlNjb3JlQ29tcG9uZW50AAA=",
        "AAAAAQAAADtTY29yZSBjb21wb25lbnQgLSBkZW1vbnN0cmF0ZXMgQ291Z3ItQ29yZSBDb21wb25lbnQgcGF0dGVybgAAAAAAAAAADlNjb3JlQ29tcG9uZW50AAAAAAADAAAAAAAAAAtnYW1lX2FjdGl2ZQAAAAABAAAAAAAAAA1wbGF5ZXIxX3Njb3JlAAAAAAAABAAAAAAAAAANcGxheWVyMl9zY29yZQAAAAAAAAQ=",
        "AAAAAQAAADxQYWRkbGUgY29tcG9uZW50IC0gZGVtb25zdHJhdGVzIENvdWdyLUNvcmUgQ29tcG9uZW50IHBhdHRlcm4AAAAAAAAAD1BhZGRsZUNvbXBvbmVudAAAAAACAAAAAAAAAAlwbGF5ZXJfaWQAAAAAAAAEAAAAAAAAAAp5X3Bvc2l0aW9uAAAAAAAF",
        "AAAAAAAAAGpJbml0aWFsaXplIGEgbmV3IGdhbWUgdXNpbmcgQ291Z3ItQ29yZSBFQ1MgY29tcG9uZW50IHBhdHRlcm4KRGVtb25zdHJhdGVzOiBFbnRpdHkgY3JlYXRpb24gd2l0aCBjb21wb25lbnRzAAAAAAAJaW5pdF9nYW1lAAAAAAAAAAAAAAEAAAfQAAAACUdhbWVTdGF0ZQAAAA==",
        "AAAAAAAAAA5SZXNldCB0aGUgZ2FtZQAAAAAACnJlc2V0X2dhbWUAAAAAAAAAAAABAAAH0AAAAAlHYW1lU3RhdGUAAAA=",
        "AAAAAAAAAFdNb3ZlIGEgcGxheWVyJ3MgcGFkZGxlCkRlbW9uc3RyYXRlczogQ29tcG9uZW50IHF1ZXJ5IGFuZCB1cGRhdGUgcGF0dGVybiBmcm9tIENvdWdyLUNvcmUAAAAAC21vdmVfcGFkZGxlAAAAAAIAAAAAAAAABnBsYXllcgAAAAAABAAAAAAAAAAJZGlyZWN0aW9uAAAAAAAABQAAAAEAAAfQAAAACUdhbWVTdGF0ZQAAAA==",
        "AAAAAAAAAHBVcGRhdGUgZ2FtZSB0aWNrIC0gZGVtb25zdHJhdGVzIENvdWdyLUNvcmUgU3lzdGVtIHBhdHRlcm4KU3lzdGVtczogUGh5c2ljc1N5c3RlbSwgQ29sbGlzaW9uU3lzdGVtLCBTY29yaW5nU3lzdGVtAAAAC3VwZGF0ZV90aWNrAAAAAAAAAAABAAAH0AAAAAlHYW1lU3RhdGUAAAA=",
        "AAAAAAAAABZHZXQgY3VycmVudCBnYW1lIHN0YXRlAAAAAAAOZ2V0X2dhbWVfc3RhdGUAAAAAAAAAAAABAAAH0AAAAAlHYW1lU3RhdGUAAAA=",
        "AAAABQAAATJTb3JvYmFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIGNvbXBvbmVudCBpcyBzZXQgb24gYW4gZW50aXR5LgoKVG9waWNzOiBgKCJDT1VHUiIsICJzZXQiLCBjb21wb25lbnRfdHlwZV9zeW1ib2wpYApEYXRhOiBgeyAiZGF0YSI6IEJ5dGVzLCAiZW50aXR5X2lkIjogdTMyIH1gCgpGcm9udGVuZHMgY2FuIHN1YnNjcmliZSB0byBhbGwgY29tcG9uZW50IG11dGF0aW9ucyB2aWEgdGhlIGBDT1VHUmArYHNldGAKcHJlZml4LCBvciB0byBhIHNwZWNpZmljIGNvbXBvbmVudCB0eXBlIGJ5IGFsc28gZmlsdGVyaW5nIG9uIHRoZSB0aGlyZCB0b3BpYy4AAAAAAAAAAAARQ29tcG9uZW50U2V0RXZlbnQAAAAAAAACAAAABUNPVUdSAAAAAAAAA3NldAAAAAADAAAAAAAAAA5jb21wb25lbnRfdHlwZQAAAAAAEQAAAAEAAAAAAAAACWVudGl0eV9pZAAAAAAAAAQAAAAAAAAAAAAAAARkYXRhAAAADgAAAAAAAAAC",
        "AAAABQAAAJFTb3JvYmFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIGNvbXBvbmVudCBpcyByZW1vdmVkIGZyb20gYW4gZW50aXR5LgoKVG9waWNzOiBgKCJDT1VHUiIsICJkZWwiLCBjb21wb25lbnRfdHlwZV9zeW1ib2wpYApEYXRhOiBgeyAiZW50aXR5X2lkIjogdTMyIH1gAAAAAAAAAAAAABVDb21wb25lbnRSZW1vdmVkRXZlbnQAAAAAAAACAAAABUNPVUdSAAAAAAAAA2RlbAAAAAACAAAAAAAAAA5jb21wb25lbnRfdHlwZQAAAAAAEQAAAAEAAAAAAAAACWVudGl0eV9pZAAAAAAAAAQAAAAAAAAAAg==",
        "AAAABQAAAc1Tb3JvYmFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIHJpY2ggY29tcG9uZW50IGlzIHNldCBvbiBhbiBlbnRpdHkgdmlhCltgU2ltcGxlV29ybGQ6OnNldF9yaWNoX29ic2VydmVkYF0oY3JhdGU6OnNpbXBsZV93b3JsZDo6U2ltcGxlV29ybGQ6OnNldF9yaWNoX29ic2VydmVkKS4KClRvcGljczogYCgiQ09VR1IiLCAicmljaCIsIGNvbXBvbmVudF90eXBlX3N5bWJvbClgCkRhdGE6IGB7ICJlbnRpdHlfaWQiOiB1MzIgfWAKClJpY2ggY29tcG9uZW50cyBhcmUgc3RvcmVkIHVzaW5nIFNvcm9iYW4ncyBYRFIgY29kZWMuIFRoZSBmdWxsIHZhbHVlIGlzCm5vdCBlbWJlZGRlZCBpbiB0aGUgZXZlbnQg4oCUIG9mZi1jaGFpbiBpbmRleGVycyBzaG91bGQgcXVlcnkgdGhlIGNvbnRyYWN0J3MKaW5zdGFuY2Ugc3RvcmFnZSBmb3IgdGhlIHVwZGF0ZWQgdmFsdWUgYWZ0ZXIgcmVjZWl2aW5nIHRoaXMgbm90aWZpY2F0aW9uLgAAAAAAAAAAAAAZUmljaENvbXBvbmVudENoYW5nZWRFdmVudAAAAAAAAAIAAAAFQ09VR1IAAAAAAAAEcmljaAAAAAIAAAAAAAAADmNvbXBvbmVudF90eXBlAAAAAAARAAAAAQAAAAAAAAAJZW50aXR5X2lkAAAAAAAABAAAAAAAAAAC",
        "AAAAAQAABABTaW1wbGlmaWVkIGdhbWUgd29ybGQgb3B0aW1pemVkIGZvciBTb3JvYmFuIG9uLWNoYWluIHN0b3JhZ2UuCgpVc2VzIGBNYXBgLWJhc2VkIHN0b3JhZ2UgZm9yIE8obG9nIG4pIGNvbXBvbmVudCBsb29rdXBzIGluc3RlYWQgb2YKbGluZWFyIHNjYW5zLiBUaGlzIGlzIHRoZSByZWNvbW1lbmRlZCBFQ1MgY29udGFpbmVyIGZvciBTb3JvYmFuIGNvbnRyYWN0cy4KCiMjIER1YWwtTWFwIHN0b3JhZ2UKCkNvbXBvbmVudHMgYXJlIHNwbGl0IGludG8gdHdvIG1hcHMgYmFzZWQgb24gdGhlaXIgYENvbXBvbmVudFN0b3JhZ2VgIGtpbmQ6Ci0gKipUYWJsZSoqIChgY29tcG9uZW50c2ApOiBGcmVxdWVudGx5LWl0ZXJhdGVkIGNvbXBvbmVudHMgKGUuZy4sIFBvc2l0aW9uLCBWZWxvY2l0eSkuClF1ZXJpZWQgYnkgYGdldF9lbnRpdGllc193aXRoX2NvbXBvbmVudCgpYC4KLSAqKlNwYXJzZSoqIChgc3BhcnNlX2NvbXBvbmVudHNgKTogSW5mcmVxdWVudGx5LWFjY2Vzc2VkIG1hcmtlciBvciB0YWcgY29tcG9uZW50cy4KTm90IGluY2x1ZGVkIGluIHRoZSBkZWZhdWx0IGVudGl0eSBxdWVyeTsgdXNlIGBnZXRfYWxsX2VudGl0aWVzX3dpdGhfY29tcG9uZW50KClgIHRvIGluY2x1ZGUgdGhlbS4KCkJvdGggbWFwcyBhcmUgdHJhbnNwYXJlbnQgdG8gYGdldF9jb21wb25lbnQoKWAsIGBoYXNfY29tcG9uZW50KClgLCBhbmQgYHJlbW92ZV9jb21wb25lbnQoKWAuCgojIEV4YW1wbGUKYGBgCnVzZSBjb3Vncl9jb3JlOjpjb21wb25lbnQ6OkNvbXBvbmVudFN0b3JhZ2U7CnVzZSBjb3Vncl9jb3JlOjpzaW1wbGVfd29ybGQ6OlNpbXBsZVdvcmxkOwp1c2Ugc29yb2Jhbl9zZGs6OntzeW1ib2xfc2hvcnQsIEJ5dGVzLCBFbnZ9OwoKbGV0IGVudiA9IEVudjo6ZGVmYXVsdCgpOwpsZXQgbXV0IHdvcmxkID0gU2ltcGxlV29ybGQ6Om5ldygmZW52KTsKbGV0IGVudGl0eV9pZCA9IHdvcmxkLnNwYXduX2VudGl0eSgpOwp3b3JsZC5hZGRfY29tcG9uZW50KGVudGl0eV9pZCwgc3ltYm9sX3Nob3J0ISgicG9zaXRpb24iKSwgQnl0AAAAAAAAAAtTaW1wbGVXb3JsZAAAAAAHAAAAPkRpcmVjdCBpbmRleCBmb3IgYWxsIGNvbXBvbmVudHMgcmVnYXJkbGVzcyBvZiBiYWNraW5nIHN0b3JhZ2UuAAAAAAAJYWxsX2luZGV4AAAAAAAD7AAAABEAAAPqAAAABAAAADpUYWJsZSBjb21wb25lbnQgZGF0YSBrZXllZCBieSAoZW50aXR5X2lkLCBjb21wb25lbnRfdHlwZSkuAAAAAAAKY29tcG9uZW50cwAAAAAD7AAAA+0AAAACAAAABAAAABEAAAAOAAAALVRyYWNrcyB3aGljaCBjb21wb25lbnQgdHlwZXMgZWFjaCBlbnRpdHkgaGFzLgAAAAAAABFlbnRpdHlfY29tcG9uZW50cwAAAAAAA+wAAAAEAAAD6gAAABEAAAAAAAAADm5leHRfZW50aXR5X2lkAAAAAAAEAAAAO1NwYXJzZSBjb21wb25lbnQgZGF0YSBrZXllZCBieSAoZW50aXR5X2lkLCBjb21wb25lbnRfdHlwZSkuAAAAABFzcGFyc2VfY29tcG9uZW50cwAAAAAAA+wAAAPtAAAAAgAAAAQAAAARAAAADgAAADxEaXJlY3QgaW5kZXggZm9yIGZyZXF1ZW50bHkgcXVlcmllZCB0YWJsZS1iYWNrZWQgY29tcG9uZW50cy4AAAALdGFibGVfaW5kZXgAAAAD7AAAABEAAAPqAAAABAAAAGpWZXJzaW9uIGNvdW50ZXIgaW5jcmVtZW50ZWQgb24gc3RydWN0dXJhbCBjaGFuZ2VzIChhZGQvcmVtb3ZlL2Rlc3Bhd24pLgpVc2VkIGZvciBxdWVyeSBjYWNoZSBpbnZhbGlkYXRpb24uAAAAAAAHdmVyc2lvbgAAAAAG",
        "AAAABAAAAKtFcnJvciB0eXBlcyBmb3IgdGhlIENvdWdyIEVDUyBmcmFtZXdvcmsuCgpVc2VzIGAjW2NvbnRyYWN0ZXJyb3JdYCBmb3IgU29yb2JhbiBjb250cmFjdCBjb21wYXRpYmlsaXR5LgpFYWNoIHZhcmlhbnQgbWFwcyB0byBhIGB1MzJgIGVycm9yIGNvZGUgZm9yIG9uLWNoYWluIGVycm9yIHJlcG9ydGluZy4AAAAAAAAAAApDb3VnckVycm9yAAAAAAAHAAAAJkVudGl0eSB3aXRoIHRoZSBnaXZlbiBJRCB3YXMgbm90IGZvdW5kAAAAAAAORW50aXR5Tm90Rm91bmQAAAAAAAEAAAAoQ29tcG9uZW50IG5vdCBmb3VuZCBmb3IgdGhlIGdpdmVuIGVudGl0eQAAABFDb21wb25lbnROb3RGb3VuZAAAAAAAAAIAAAAtRmFpbGVkIHRvIGRlc2VyaWFsaXplIGNvbXBvbmVudC9yZXNvdXJjZSBkYXRhAAAAAAAAFURlc2VyaWFsaXphdGlvbkZhaWxlZAAAAAAAAAMAAAAoRGF0YSBsZW5ndGggZG9lcyBub3QgbWF0Y2ggZXhwZWN0ZWQgc2l6ZQAAABFJbnZhbGlkRGF0YUxlbmd0aAAAAAAAAAQAAAApSW5kZXggb3V0IG9mIGJvdW5kcyBkdXJpbmcgc3RvcmFnZSBhY2Nlc3MAAAAAAAAQSW5kZXhPdXRPZkJvdW5kcwAAAAUAAAAqUmVzb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gdHlwZSB3YXMgbm90IGZvdW5kAAAAAAAQUmVzb3VyY2VOb3RGb3VuZAAAAAYAAAAYU3RvcmFnZSBvcGVyYXRpb24gZmFpbGVkAAAADFN0b3JhZ2VFcnJvcgAAAAc=",
        "AAAAAQAAAAAAAAAAAAAABUV2ZW50AAAAAAAAAwAAAAAAAAAEZGF0YQAAAA4AAAAAAAAACmV2ZW50X3R5cGUAAAAAABEAAAAAAAAACXRpbWVzdGFtcAAAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAC0RhbWFnZUV2ZW50AAAAAAMAAAAAAAAADWRhbWFnZV9hbW91bnQAAAAAAAAFAAAAAAAAAAtkYW1hZ2VfdHlwZQAAAAARAAAAAAAAAA10YXJnZXRfZW50aXR5AAAAAAAABg==",
        "AAAAAQAAAAAAAAAAAAAADkNvbGxpc2lvbkV2ZW50AAAAAAADAAAAAAAAAA5jb2xsaXNpb25fdHlwZQAAAAAAEQAAAAAAAAAIZW50aXR5X2EAAAAGAAAAAAAAAAhlbnRpdHlfYgAAAAY=",
        "AAAAAQAAAAAAAAAAAAAACFJlc291cmNlAAAAAgAAAAAAAAAEZGF0YQAAAA4AAAAAAAAADXJlc291cmNlX3R5cGUAAAAAAAAR",
        "AAAAAQAAAAAAAAAAAAAACUdhbWVTdGF0ZQAAAAAAAAMAAAAAAAAADGlzX2dhbWVfb3ZlcgAAAAEAAAAAAAAABWxldmVsAAAAAAAABQAAAAAAAAAFc2NvcmUAAAAAAAAF",
        "AAAAAQAAAAAAAAAAAAAABVRva2VuAAAAAAAAAgAAAAAAAAAGYW1vdW50AAAAAAAEAAAAAAAAAARoYXNoAAAD7gAAACA=",
        "AAAAAQAAAAAAAAAAAAAABkhlYWx0aAAAAAAAAgAAAAAAAAAHY3VycmVudAAAAAAKAAAAAAAAAANtYXgAAAAACg==",
        "AAAAAQAAAAAAAAAAAAAACFBvc2l0aW9uAAAAAgAAAAAAAAABeAAAAAAAAAUAAAAAAAAAAXkAAAAAAAAF",
        "AAAAAQAAAAAAAAAAAAAACFZlbG9jaXR5AAAAAgAAAAAAAAABeAAAAAAAAAUAAAAAAAAAAXkAAAAAAAAF",
        "AAAAAQAAAAAAAAAAAAAACUNvbXBvbmVudAAAAAAAAAMAAAAAAAAADmNvbXBvbmVudF90eXBlAAAAAAARAAAAAAAAAARkYXRhAAAADgAAAAAAAAAHc3RvcmFnZQAAAAfQAAAAEENvbXBvbmVudFN0b3JhZ2U=",
        "AAAAAwAAAAAAAAAAAAAAEENvbXBvbmVudFN0b3JhZ2UAAAACAAAAAAAAAAVUYWJsZQAAAAAAAAAAAAAAAAAABlNwYXJzZQAAAAAAAQ==",
        "AAAAAQAAAPBXb3JsZCB0aGF0IGdyb3VwcyBlbnRpdGllcyBieSBhcmNoZXR5cGUgZm9yIGVmZmljaWVudCBxdWVyaWVzLgoKRWFjaCB1bmlxdWUgY29tYmluYXRpb24gb2YgY29tcG9uZW50IHR5cGVzIGZvcm1zIGFuIGFyY2hldHlwZS4KRW50aXRpZXMgd2l0aCB0aGUgc2FtZSBjb21wb25lbnQgc2V0IHNoYXJlIGFuIGFyY2hldHlwZSwgZW5hYmxpbmcKYmF0Y2ggaXRlcmF0aW9uIHdpdGhvdXQgcGVyLWVudGl0eSB0eXBlIGNoZWNrcy4AAAAAAAAADkFyY2hldHlwZVdvcmxkAAAAAAAGAAAAAAAAAA9hcmNoZXR5cGVfaW5kZXgAAAAD7AAAA+oAAAARAAAABAAAAAAAAAAKYXJjaGV0eXBlcwAAAAAD7AAAAAQAAAfQAAAACUFyY2hldHlwZQAAAAAAAAAAAAAQZW50aXR5X2FyY2hldHlwZQAAA+wAAAAEAAAABAAAAAAAAAARbmV4dF9hcmNoZXR5cGVfaWQAAAAAAAAEAAAAAAAAAA5uZXh0X2VudGl0eV9pZAAAAAAABAAAAAAAAAAHdmVyc2lvbgAAAAAG",
        "AAAAAQAAANBBbiBhcmNoZXR5cGUgZ3JvdXBzIGVudGl0aWVzIHdpdGggdGhlIGV4YWN0IHNhbWUgY29tcG9uZW50IHNldC4KCkVudGl0aWVzIGluIHRoZSBzYW1lIGFyY2hldHlwZSBzaGFyZSB0aGUgc2FtZSBjb21wb25lbnQgdHlwZXMsIGVuYWJsaW5nCmVmZmljaWVudCBiYXRjaCBpdGVyYXRpb24uIENvbXBvbmVudCBkYXRhIGlzIHN0b3JlZCBwZXIgKGVudGl0eSwgdHlwZSkuAAAAAAAAAAlBcmNoZXR5cGUAAAAAAAAEAAAAMVNvcnRlZCBsaXN0IG9mIGNvbXBvbmVudCB0eXBlcyBpbiB0aGlzIGFyY2hldHlwZS4AAAAAAAAPY29tcG9uZW50X3R5cGVzAAAAA+oAAAARAAAANENvbXBvbmVudCBkYXRhIGtleWVkIGJ5IChlbnRpdHlfaWQsIGNvbXBvbmVudF90eXBlKS4AAAAEZGF0YQAAA+wAAAPtAAAAAgAAAAQAAAARAAAADgAAACVMaXN0IG9mIGVudGl0eSBJRHMgaW4gdGhpcyBhcmNoZXR5cGUuAAAAAAAACGVudGl0aWVzAAAD6gAAAAQAAAAcVW5pcXVlIGFyY2hldHlwZSBpZGVudGlmaWVyLgAAAAJpZAAAAAAABA==",
        "AAAAAQAAAQ5QZWRlcnNlbiBjb21taXRtZW50IHBhcmFtZXRlcnM6IHR3byBpbmRlcGVuZGVudCBHMSBnZW5lcmF0b3IgcG9pbnRzLgoKYGdgIGlzIHRoZSAidmFsdWUgZ2VuZXJhdG9yIiBhbmQgYGhgIGlzIHRoZSAiYmxpbmRpbmcgZ2VuZXJhdG9yIi4KVGhlc2UgbXVzdCBiZSBjaG9zZW4gc3VjaCB0aGF0IHRoZSBkaXNjcmV0ZSBsb2cgb2YgYGhgIHdpdGggcmVzcGVjdCB0byBgZ2AKaXMgdW5rbm93biAobm90aGluZy11cC1teS1zbGVldmUgY29uc3RydWN0aW9uIHJlY29tbWVuZGVkKS4AAAAAAAAAAAAOUGVkZXJzZW5QYXJhbXMAAAAAAAIAAAAbVmFsdWUgZ2VuZXJhdG9yIHBvaW50IChHMSkuAAAAAAFnAAAAAAAH0AAAAAdHMVBvaW50AAAAAB5CbGluZGluZyBnZW5lcmF0b3IgcG9pbnQgKEcxKS4AAAAAAAFoAAAAAAAH0AAAAAdHMVBvaW50AA==",
        "AAAAAQAAAChBIFBlZGVyc2VuIGNvbW1pdG1lbnQgcG9pbnQgb24gQk4yNTQgRzEuAAAAAAAAABJQZWRlcnNlbkNvbW1pdG1lbnQAAAAAAAEAAAAjVGhlIGNvbW1pdG1lbnQgcG9pbnQgQyA9IHYqRyArIHIqSC4AAAAABXBvaW50AAAAAAAH0AAAAAdHMVBvaW50AA==",
        "AAAAAQAAAKxTdG9yZXMgYSBQb3NlaWRvbiBoYXNoIGNvbW1pdG1lbnQgb2YgcHJpdmF0ZSBnYW1lIHN0YXRlLgoKVXNlZCBmb3IgZm9nLW9mLXdhciwgaGlkZGVuIGludmVudG9yaWVzLCBvciBhbnkgc3RhdGUgdGhhdApzaG91bGQgYmUgdmVyaWZpYWJsZSB3aXRob3V0IHJldmVhbGluZyB0aGUgYWN0dWFsIGRhdGEuAAAAAAAAAAtIaWRkZW5TdGF0ZQAAAAACAAAAI1Bvc2VpZG9uIGhhc2ggb2YgdGhlIHByaXZhdGUgc3RhdGUuAAAAAApjb21taXRtZW50AAAAAAPuAAAAIAAAABtPd25lciBvZiB0aGlzIGhpZGRlbiBzdGF0ZS4AAAAABW93bmVyAAAAAAAAEw==",
        "AAAAAQAAAOhDb21taXQtcmV2ZWFsIHR3by1waGFzZSBwYXR0ZXJuIGNvbXBvbmVudC4KClBoYXNlIDEgKENvbW1pdCk6IFBsYXllciBzdWJtaXRzIGEgaGFzaCBvZiB0aGVpciBhY3Rpb24uClBoYXNlIDIgKFJldmVhbCk6IFBsYXllciByZXZlYWxzIHRoZSBhY3R1YWwgYWN0aW9uICsgbm9uY2UuCklmIHRoZSByZXZlYWwgZGVhZGxpbmUgcGFzc2VzIHdpdGhvdXQgYSByZXZlYWwsIHRoZSBjb21taXRtZW50IGV4cGlyZXMuAAAAAAAAAAxDb21taXRSZXZlYWwAAAADAAAAP0hhc2ggb2YgdGhlIGNvbW1pdHRlZCBhY3Rpb24gKGUuZy4sIFBvc2VpZG9uKGFjdGlvbiB8fCBub25jZSkpLgAAAAAKY29tbWl0bWVudAAAAAAD7gAAACAAAAAsRGVhZGxpbmUgZm9yIHJldmVhbGluZyB0aGUgY29tbWl0dGVkIGFjdGlvbi4AAAAPcmV2ZWFsX2RlYWRsaW5lAAAAAAYAAAAlV2hldGhlciB0aGUgYWN0aW9uIGhhcyBiZWVuIHJldmVhbGVkLgAAAAAAAAhyZXZlYWxlZAAAAAE=",
        "AAAAAQAAAJVNYXJrZXIgY29tcG9uZW50IGZvciBlbnRpdGllcyB3aXRoIHZlcmlmaWVkIHByb29mcy4KCkFkZGVkIGFmdGVyIGEgYFByb29mU3VibWlzc2lvbmAgcGFzc2VzIHZlcmlmaWNhdGlvbi4KQ2FuIGJlIGNsZWFuZWQgdXAgYWZ0ZXIgYSBjb25maWd1cmFibGUgYWdlLgAAAAAAAAAAAAAOVmVyaWZpZWRNYXJrZXIAAAAAAAIAAAAtVHlwZS9jYXRlZ29yeSBvZiB0aGUgcHJvb2YgdGhhdCB3YXMgdmVyaWZpZWQuAAAAAAAACnByb29mX3R5cGUAAAAAABEAAAAsTGVkZ2VyIHRpbWVzdGFtcCB3aGVuIHZlcmlmaWNhdGlvbiBvY2N1cnJlZC4AAAALdmVyaWZpZWRfYXQAAAAABg==",
        "AAAAAQAAAKxBIHBlbmRpbmcgcHJvb2Ygc3VibWlzc2lvbiBhdHRhY2hlZCB0byBhbiBlbnRpdHkuCgpUaGUgcHJvb2YgbXVzdCBiZSB2ZXJpZmllZCBiZWZvcmUgdGhlIGRlYWRsaW5lLiBPbmNlIHZlcmlmaWVkLAphIGBWZXJpZmllZE1hcmtlcmAgaXMgYWRkZWQgYW5kIHRoaXMgY29tcG9uZW50IGlzIHJlbW92ZWQuAAAAAAAAAA9Qcm9vZlN1Ym1pc3Npb24AAAAABQAAACtEZWFkbGluZSBsZWRnZXIgdGltZXN0YW1wIGZvciB2ZXJpZmljYXRpb24uAAAAAAhkZWFkbGluZQAAAAYAAAAhVGhlIEdyb3RoMTYgcHJvb2YgdG8gYmUgdmVyaWZpZWQuAAAAAAAABXByb29mAAAAAAAH0AAAAAxHcm90aDE2UHJvb2YAAAAfUHVibGljIGlucHV0cyBmb3IgdmVyaWZpY2F0aW9uLgAAAAANcHVibGljX2lucHV0cwAAAAAAA+oAAAfQAAAABlNjYWxhcgAAAAAALkxlZGdlciB0aW1lc3RhbXAgd2hlbiB0aGUgcHJvb2Ygd2FzIHN1Ym1pdHRlZC4AAAAAAAxzdWJtaXR0ZWRfYXQAAAAGAAAAJVdoZXRoZXIgdGhpcyBwcm9vZiBoYXMgYmVlbiB2ZXJpZmllZC4AAAAAAAAIdmVyaWZpZWQAAAAB",
        "AAAABAAAACdFcnJvciB0eXBlcyBmb3IgdGhlIENvdWdyIFpLIHN1YnN5c3RlbS4AAAAAAAAAAAdaS0Vycm9yAAAAABMAAAAsVGhlIHN1Ym1pdHRlZCBwcm9vZiBpcyBzdHJ1Y3R1cmFsbHkgaW52YWxpZC4AAAAMSW52YWxpZFByb29mAAAACgAAAENBbiBlbGxpcHRpYyBjdXJ2ZSBwb2ludCBpcyBub3Qgb24gdGhlIGN1cnZlIG9yIG5vdCBpbiB0aGUgc3ViZ3JvdXAuAAAAAAxJbnZhbGlkUG9pbnQAAAALAAAANEEgc2NhbGFyIHZhbHVlIGlzIG91dCBvZiByYW5nZSBmb3IgdGhlIHRhcmdldCBmaWVsZC4AAAANSW52YWxpZFNjYWxhcgAAAAAAAAwAAABEUHJvb2YgdmVyaWZpY2F0aW9uIGZhaWxlZCAodmFsaWQgc3RydWN0dXJlLCBidXQgcHJvb2YgaXMgaW5jb3JyZWN0KS4AAAASVmVyaWZpY2F0aW9uRmFpbGVkAAAAAAANAAAAMElucHV0IGRhdGEgaXMgbWFsZm9ybWVkIG9yIGhhcyB0aGUgd3JvbmcgbGVuZ3RoLgAAAAxJbnZhbGlkSW5wdXQAAAAOAAAAQVRoZSB2ZXJpZmljYXRpb24ga2V5IGlzIG1hbGZvcm1lZCBvciBpbmNvbXBhdGlibGUgd2l0aCB0aGUgcHJvb2YuAAAAAAAAFkludmFsaWRWZXJpZmljYXRpb25LZXkAAAAAAA8AAAA+VGhlIGNpcmN1aXQgdHlwZSBkb2VzIG5vdCBtYXRjaCB0aGUgZXhwZWN0ZWQgdmVyaWZpY2F0aW9uIGtleS4AAAAAAA9DaXJjdWl0TWlzbWF0Y2gAAAAAEAAAADlQdWJsaWMgaW5wdXRzIGRvIG5vdCBtYXRjaCB0aGUgY2lyY3VpdCdzIGV4cGVjdGVkIGZvcm1hdC4AAAAAAAASSW52YWxpZFB1YmxpY0lucHV0AAAAAAARAAAANE1lcmtsZSB0cmVlIGNhbm5vdCBiZSBjb25zdHJ1Y3RlZCBmcm9tIGVtcHR5IGxlYXZlcy4AAAAJRW1wdHlUcmVlAAAAAAAAEgAAAClMZWFmIGluZGV4IGlzIG91dCBvZiBib3VuZHMgZm9yIHRoZSB0cmVlLgAAAAAAAA9MZWFmT3V0T2ZCb3VuZHMAAAAAEwAAADtNZXJrbGUgcHJvb2YgaGFzIGludmFsaWQgbGVuZ3RoIChkb2Vzbid0IG1hdGNoIHRyZWUgZGVwdGgpLgAAAAASSW52YWxpZFByb29mTGVuZ3RoAAAAAAAUAAAAK01lcmtsZSBpbmNsdXNpb24gcHJvb2YgdmVyaWZpY2F0aW9uIGZhaWxlZC4AAAAAGE1lcmtsZVZlcmlmaWNhdGlvbkZhaWxlZAAAABUAAAAtVHJlZSBkZXB0aCBleGNlZWRzIHRoZSBtYXhpbXVtIGFsbG93ZWQgZGVwdGguAAAAAAAAEE1heERlcHRoRXhjZWVkZWQAAAAWAAAAIkxlYWYgZGF0YSBpcyBpbnZhbGlkIG9yIG1hbGZvcm1lZC4AAAAAAAtJbnZhbGlkTGVhZgAAAAAXAAAASEEgc3RhdGUgdHJhbnNpdGlvbiB2aW9sYXRlcyB0aGUgZXhwbGljaXQgcGhhc2UtMyBvcmNoZXN0cmF0aW9uIGNvbnRyYWN0LgAAABZJbnZhbGlkU3RhdGVUcmFuc2l0aW9uAAAAAAAYAAAAQEEgdHJhbnNpdGlvbiBhcnJpdmVkIGFmdGVyIGl0cyBhbGxvd2VkIGRpc3B1dGUgb3IgcmV2ZWFsIHdpbmRvdy4AAAAPRGVhZGxpbmVFeHBpcmVkAAAAABkAAABNVGhlIHJlcXVlc3RlZCBvcGVyYXRpb24gY2Fubm90IHByb2NlZWQgYmVjYXVzZSB0aGUgY2hhbm5lbCBpcyBhbHJlYWR5IGNsb3NlZC4AAAAAAAANQ2hhbm5lbENsb3NlZAAAAAAAABoAAABLQSBmb2ctb2Ytd2FyIGV4cGxvcmF0aW9uIHRhcmdldCBsaWVzIG91dHNpZGUgdGhlIGFsbG93ZWQgdmlzaWJpbGl0eSB3aW5kb3cuAAAAABFJbnZhbGlkVmlzaWJpbGl0eQAAAAAAABsAAABLQSByZWN1cnNpdmUgY29tcG9zaXRpb24gZGVzY3JpcHRvciBpcyBtYWxmb3JtZWQgb3IgZXhjZWVkcyBkZWNsYXJlZCBib3VuZHMuAAAAABdJbnZhbGlkUHJvb2ZDb21wb3NpdGlvbgAAAAAc",
        "AAAAAQAAACxBIEJOMjU0IHNjYWxhciBmaWVsZCBlbGVtZW50IChGciwgMzIgYnl0ZXMpLgAAAAAAAAAGU2NhbGFyAAAAAAABAAAAAAAAAAVieXRlcwAAAAAAA+4AAAAg",
        "AAAAAQAAAIJBIEJOMjU0IEcxIGFmZmluZSBwb2ludCAoY29tcHJlc3NlZCwgNjQgYnl0ZXMgc2VyaWFsaXplZCkuCgpXcmFwcyB0aGUgc29yb2Jhbi1zZGsgYEJuMjU0RzFBZmZpbmVgIGZvciB1c2UgaW4gQ291Z3IgY29udHJhY3QgdHlwZXMuAAAAAAAAAAAAB0cxUG9pbnQAAAAAAQAAAAAAAAAFYnl0ZXMAAAAAAAPuAAAAQA==",
        "AAAAAQAAADtBIEJOMjU0IEcyIGFmZmluZSBwb2ludCAoY29tcHJlc3NlZCwgMTI4IGJ5dGVzIHNlcmlhbGl6ZWQpLgAAAAAAAAAAB0cyUG9pbnQAAAAAAQAAAAAAAAAFYnl0ZXMAAAAAAAPuAAAAgA==",
        "AAAAAQAAAFBBIEdyb3RoMTYgcHJvb2YgY29uc2lzdGluZyBvZiB0aHJlZSBjdXJ2ZSBwb2ludHMgKEEg4oiIIEcxLCBCIOKIiCBHMiwgQyDiiIggRzEpLgAAAAAAAAAMR3JvdGgxNlByb29mAAAAAwAAAAAAAAABYQAAAAAAB9AAAAAHRzFQb2ludAAAAAAAAAAAAWIAAAAAAAfQAAAAB0cyUG9pbnQAAAAAAAAAAAFjAAAAAAAH0AAAAAdHMVBvaW50AA==",
        "AAAAAQAAAC9BIEJMUzEyLTM4MSBGciBzY2FsYXIgZmllbGQgZWxlbWVudCAoMzIgYnl0ZXMpLgAAAAAAAAAADkJsczEyMzgxU2NhbGFyAAAAAAABAAAAAAAAAAVieXRlcwAAAAAAA+4AAAAg",
        "AAAAAQAAADJBIEJMUzEyLTM4MSBHMSBhZmZpbmUgcG9pbnQgKDk2IGJ5dGVzIHNlcmlhbGl6ZWQpLgAAAAAAAAAAAA9CbHMxMjM4MUcxUG9pbnQAAAAAAQAAAAAAAAAFYnl0ZXMAAAAAAAPuAAAAYA==",
        "AAAAAQAAADNBIEJMUzEyLTM4MSBHMiBhZmZpbmUgcG9pbnQgKDE5MiBieXRlcyBzZXJpYWxpemVkKS4AAAAAAAAAAA9CbHMxMjM4MUcyUG9pbnQAAAAAAQAAAAAAAAAFYnl0ZXMAAAAAAAPuAAAAwA==",
        "AAAAAQAAABtBIEdyb3RoMTYgdmVyaWZpY2F0aW9uIGtleS4AAAAAAAAAAA9WZXJpZmljYXRpb25LZXkAAAAABQAAABBBbHBoYSBwb2ludCAoRzEpAAAABWFscGhhAAAAAAAH0AAAAAdHMVBvaW50AAAAAA9CZXRhIHBvaW50IChHMikAAAAABGJldGEAAAfQAAAAB0cyUG9pbnQAAAAAEERlbHRhIHBvaW50IChHMikAAAAFZGVsdGEAAAAAAAfQAAAAB0cyUG9pbnQAAAAAEEdhbW1hIHBvaW50IChHMikAAAAFZ2FtbWEAAAAAAAfQAAAAB0cyUG9pbnQAAAAAO0lDIChpbnB1dCBjb21taXRtZW50KSBwb2ludHMgKEcxKSwgb25lIHBlciBwdWJsaWMgaW5wdXQgKyAxAAAAAAJpYwAAAAAD6gAAB9AAAAAHRzFQb2ludAA=",
        "AAAAAQAAAE1PZmYtY2hhaW4gc3RhdGUgY2hhbm5lbCB0cmFja2VkIGJ5IG9uLWNoYWluIGNvbW1pdG1lbnRzIGFuZCBkaXNwdXRlIG1ldGFkYXRhLgAAAAAAAAAAAAAOWmtTdGF0ZUNoYW5uZWwAAAAAAAYAAAAAAAAACmNoYW5uZWxfaWQAAAAAA+4AAAAgAAAAAAAAAAZjbG9zZWQAAAAAAAEAAAAAAAAAEGRpc3B1dGVfZGVhZGxpbmUAAAAGAAAAAAAAABFwYXJ0aWNpcGFudHNfcm9vdAAAAAAAA+4AAAAgAAAAAAAAAAVyb3VuZAAAAAAAAAYAAAAAAAAACnN0YXRlX3Jvb3QAAAAAA+4AAAAg",
        "AAAAAQAAADpTbmFwc2hvdCBvZiBhIHBsYXllcidzIGN1cnJlbnRseSB2aXNpYmxlIGZvZy1vZi13YXIgc3RhdGUuAAAAAAAAAAAAEEZvZ09mV2FyU25hcHNob3QAAAAFAAAAOU1lcmtsZSByb290IG9mIHRoZSB0aWxlcyB0aGUgcGxheWVyIGhhcyBhbHJlYWR5IGV4cGxvcmVkLgAAAAAAAA1leHBsb3JlZF9yb290AAAAAAAD7gAAACAAAAAtTWVya2xlIHJvb3Qgb2YgdGhlIGhpZGRlbiBtYXAgb3IgYm9hcmQgc3RhdGUuAAAAAAAACG1hcF9yb290AAAD7gAAACAAAAAuUGxheWVyIG9yaWdpbiB1c2VkIGJ5IHRoZSBleHBsb3JhdGlvbiBjaXJjdWl0LgAAAAAACG9yaWdpbl94AAAABQAAAAAAAAAIb3JpZ2luX3kAAAAFAAAAQU1heGltdW0gRXVjbGlkZWFuIGRpc3RhbmNlIHRoZSBwbGF5ZXIgbWF5IHJldmVhbCBmcm9tIHRoZSBvcmlnaW4uAAAAAAAAEXZpc2liaWxpdHlfcmFkaXVzAAAAAAAABA==",
        "AAAAAQAAADtSb290IHRyYW5zaXRpb24gZm9yIGEgc2luZ2xlIGZvZy1vZi13YXIgZXhwbG9yYXRpb24gdXBkYXRlLgAAAAAAAAAAEkZvZ09mV2FyVHJhbnNpdGlvbgAAAAAABAAAAAAAAAASbmV4dF9leHBsb3JlZF9yb290AAAAAAPuAAAAIAAAAAAAAAATcHJpb3JfZXhwbG9yZWRfcm9vdAAAAAPuAAAAIAAAAAAAAAAGdGlsZV94AAAAAAAFAAAAAAAAAAZ0aWxlX3kAAAAAAAU=",
        "AAAAAQAAADRFeHBlcmltZW50YWwgZGVzY3JpcHRvciBmb3IgYSByZWN1cnNpdmUgcHJvb2YgYmF0Y2guAAAAAAAAABRSZWN1cnNpdmVQcm9vZkxheW91dAAAAAQAAAAAAAAAEGFjY3VtdWxhdG9yX3Jvb3QAAAPuAAAAIAAAAAAAAAAQZmluYWxfc3RhdGVfcm9vdAAAA+4AAAAgAAAAAAAAABJpbml0aWFsX3N0YXRlX3Jvb3QAAAAAA+4AAAAgAAAAAAAAAAtwcm9vZl9jb3VudAAAAAAE",
        "AAAAAQAAAD1Qcm9wb3NlZCBzdGF0ZSB0cmFuc2l0aW9uIGZvciBhIG11bHRpcGxheWVyIFpLIHN0YXRlIGNoYW5uZWwuAAAAAAAAAAAAABZTdGF0ZUNoYW5uZWxUcmFuc2l0aW9uAAAAAAAEAAAAAAAAAA9uZXh0X3N0YXRlX3Jvb3QAAAAD7gAAACAAAAAAAAAAEHByaW9yX3N0YXRlX3Jvb3QAAAPuAAAAIAAAAAAAAAAFcm91bmQAAAAAAAAGAAAAAAAAAAxzdWJtaXR0ZWRfYXQAAAAG",
        "AAAAAQAAAEdVSS1mYWNpbmcgc2Vzc2lvbiBoZWFsdGggcmV0dXJuZWQgYnkgW2BzdXBlcjo6U2Vzc2lvbk1hbmFnZXI6OnN0YXR1c2BdLgAAAAAAAAAADVNlc3Npb25TdGF0dXMAAAAAAAAFAAAAAAAAAAZhY3RpdmUAAAAAAAEAAAAAAAAACmV4cGlyZXNfaW4AAAAAAAYAAAAAAAAABmtleV9pZAAAAAAD7gAAACAAAAAAAAAADW5lZWRzX3JlbmV3YWwAAAAAAAABAAAAAAAAABRyZW1haW5pbmdfb3BlcmF0aW9ucwAAAAQ=",
        "AAAAAQAAAM9PcHRpb25hbCBvbi1jaGFpbiBtYXJrZXIgZm9yIHRoZSBwbGF5ZXIncyBhY3RpdmUgZ2FtZXBsYXkgc2Vzc2lvbi4KCkdhbWVzIGNhbiBzdG9yZSB0aGlzIGFzIGEgcmljaCBjb21wb25lbnQgc28gb2ZmLWNoYWluIGNsaWVudHMgY2FuIHBvbGwKW2BjcmF0ZTo6c2Vzc2lvbjo6U2Vzc2lvblN0YXR1c2BdIHdoZW4gYG5lZWRzX3JlbmV3YWxgIGJlY29tZXMgdHJ1ZS4AAAAAAAAAAA1BY3RpdmVTZXNzaW9uAAAAAAAABAAAAAAAAAAKZXhwaXJlc19hdAAAAAAABgAAAAAAAAAGa2V5X2lkAAAAAAPuAAAAIAAAAAAAAAANbmVlZHNfcmVuZXdhbAAAAAAAAAEAAAAAAAAAFG9wZXJhdGlvbnNfcmVtYWluaW5nAAAABA==",
        "AAAAAQAAACZBIHJlZ2lzdGVyZWQgZGV2aWNlIGtleSB3aXRoIG1ldGFkYXRhLgAAAAAAAAAAAAlEZXZpY2VLZXkAAAAAAAAFAAAANUh1bWFuLXJlYWRhYmxlIGRldmljZSBuYW1lIChlLmcuLCAicGhvbmUiLCAibGFwdG9wIikuAAAAAAAAC2RldmljZV9uYW1lAAAAABEAAAAsV2hldGhlciB0aGlzIGRldmljZSBrZXkgaXMgY3VycmVudGx5IGFjdGl2ZS4AAAAJaXNfYWN0aXZlAAAAAAAAAQAAACZVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhpcyBkZXZpY2Uga2V5LgAAAAAABmtleV9pZAAAAAAD7gAAACAAAAAhTGVkZ2VyIHRpbWVzdGFtcCBvZiB0aGUgbGFzdCB1c2UuAAAAAAAACWxhc3RfdXNlZAAAAAAAAAYAAAAwTGVkZ2VyIHRpbWVzdGFtcCB3aGVuIHRoZSBkZXZpY2Ugd2FzIHJlZ2lzdGVyZWQuAAAADXJlZ2lzdGVyZWRfYXQAAAAAAAAG",
        "AAAAAQAAACNQb2xpY3kgZm9yIG11bHRpLWRldmljZSBtYW5hZ2VtZW50LgAAAAAAAAAADERldmljZVBvbGljeQAAAAIAAABZTnVtYmVyIG9mIGxlZGdlciBzbG90cyBvZiBpbmFjdGl2aXR5IGJlZm9yZSBhdXRvLXJldm9rZS4KU2V0IHRvIDAgdG8gZGlzYWJsZSBhdXRvLXJldm9rZS4AAAAAAAARYXV0b19yZXZva2VfYWZ0ZXIAAAAAAAAGAAAAMU1heGltdW0gbnVtYmVyIG9mIGRldmljZXMgdGhhdCBjYW4gYmUgcmVnaXN0ZXJlZC4AAAAAAAALbWF4X2RldmljZXMAAAAABA==",
        "AAAAAQAAADxBIHJlZ2lzdGVyZWQgc2VjcDI1NnIxIHB1YmxpYyBrZXkgZm9yIFdlYkF1dGhuL1Bhc3NrZXkgYXV0aC4AAAAAAAAADFNlY3AyNTZyMUtleQAAAAMAAAA0SHVtYW4tcmVhZGFibGUgbGFiZWwgKGUuZy4sICJwYXNza2V5XzEiLCAieXViaWtleSIpLgAAAAVsYWJlbAAAAAAAABEAAAA5U0VDLTEgdW5jb21wcmVzc2VkIHB1YmxpYyBrZXkgKDY1IGJ5dGVzOiAweDA0IHx8IHggfHwgeSkuAAAAAAAACnB1YmxpY19rZXkAAAAAA+4AAABBAAAALUxlZGdlciB0aW1lc3RhbXAgd2hlbiB0aGUga2V5IHdhcyByZWdpc3RlcmVkLgAAAAAAAA1yZWdpc3RlcmVkX2F0AAAAAAAABg==",
        "AAAABAAAAC9BY2NvdW50LXJlbGF0ZWQgZXJyb3JzIGZvciB0aGUgQ291Z3IgZnJhbWV3b3JrLgAAAAAAAAAADEFjY291bnRFcnJvcgAAABkAAAAAAAAADFVuYXV0aG9yaXplZAAAABQAAAAAAAAADlNlc3Npb25FeHBpcmVkAAAAAAAVAAAAAAAAABBJbnZhbGlkU2lnbmF0dXJlAAAAFgAAAAAAAAAWQ2FwYWJpbGl0eU5vdFN1cHBvcnRlZAAAAAAAFwAAAAAAAAATU2Vzc2lvbkxpbWl0UmVhY2hlZAAAAAAYAAAAAAAAAAxJbnZhbGlkU2NvcGUAAAAZAAAAAAAAAApCYXRjaEVtcHR5AAAAAAAaAAAAAAAAAA1CYXRjaFRvb0xhcmdlAAAAAAAAGwAAAAAAAAAMU3RvcmFnZUVycm9yAAAAHAAAAAAAAAAVR3VhcmRpYW5BbHJlYWR5RXhpc3RzAAAAAAAAHQAAAAAAAAAUUmVjb3ZlcnlOb3RJbml0aWF0ZWQAAAAeAAAAAAAAABJUaW1lbG9ja05vdEV4cGlyZWQAAAAAAB8AAAAAAAAAD1RocmVzaG9sZE5vdE1ldAAAAAAgAAAAAAAAABNNYXhHdWFyZGlhbnNSZWFjaGVkAAAAACEAAAAAAAAAEkRldmljZUxpbWl0UmVhY2hlZAAAAAAAIgAAAAAAAAAORGV2aWNlTm90Rm91bmQAAAAAACMAAAAAAAAAFVJlY292ZXJ5QWxyZWFkeUFjdGl2ZQAAAAAAACQAAAAAAAAADU5vbmNlTWlzbWF0Y2gAAAAAAAAlAAAAAAAAABBBY3Rpb25Ob3RBbGxvd2VkAAAAJgAAAAAAAAAVU2Vzc2lvbkJ1ZGdldEV4Y2VlZGVkAAAAAAAAJwAAAAAAAAANSW50ZW50RXhwaXJlZAAAAAAAACgAAAAAAAAADUludmFsaWRJbnRlbnQAAAAAAAApAAAAAAAAAA5TaWduZXJNaXNtYXRjaAAAAAAAKgAAAAAAAAAOU2Vzc2lvblJldm9rZWQAAAAAACsAAAAAAAAAE1NpZ25lck5vdFJlZ2lzdGVyZWQAAAAALA==",
        "AAAAAQAAADNBIGdhbWUgYWN0aW9uIHRoYXQgY2FuIGJlIGF1dGhvcml6ZWQgYnkgYW4gYWNjb3VudC4AAAAAAAAAAApHYW1lQWN0aW9uAAAAAAACAAAAAAAAAARkYXRhAAAADgAAAAAAAAALc3lzdGVtX25hbWUAAAAAEQ==",
        "AAAAAQAAADBBIHNlc3Npb24ga2V5IHdpdGggaXRzIHNjb3BlIGFuZCB1c2FnZSB0cmFja2luZy4AAAAAAAAAClNlc3Npb25LZXkAAAAAAAUAAAAAAAAACmNyZWF0ZWRfYXQAAAAAAAYAAAAAAAAABmtleV9pZAAAAAAD7gAAACAAAAAAAAAACm5leHRfbm9uY2UAAAAAAAYAAAAAAAAAD29wZXJhdGlvbnNfdXNlZAAAAAAEAAAAAAAAAAVzY29wZQAAAAAAB9AAAAAMU2Vzc2lvblNjb3Bl",
        "AAAAAQAAADFEZWZpbmVzIHRoZSBzY29wZSBvZiBhIHNlc3Npb24ga2V5J3MgcGVybWlzc2lvbnMuAAAAAAAAAAAAAAxTZXNzaW9uU2NvcGUAAAADAAAAAAAAAA9hbGxvd2VkX2FjdGlvbnMAAAAD6gAAABEAAAAAAAAACmV4cGlyZXNfYXQAAAAAAAYAAAAAAAAADm1heF9vcGVyYXRpb25zAAAAAAAE",
        "AAAAAQAAACVDYXBhYmlsaXRpZXMgc3VwcG9ydGVkIGJ5IGFuIGFjY291bnQuAAAAAAAAAAAAABNBY2NvdW50Q2FwYWJpbGl0aWVzAAAAAAQAAAAAAAAACWNhbl9iYXRjaAAAAAAAAAEAAAAAAAAAEGhhc19wYXNza2V5X2F1dGgAAAABAAAAAAAAABBoYXNfc2Vzc2lvbl9rZXlzAAAAAQAAAAAAAAATaGFzX3NvY2lhbF9yZWNvdmVyeQAAAAAB",
        "AAAAAQAAADNTdGFibGUgaWRlbnRpZmllciBmb3IgdGhlIHNpZ25lciB1c2VkIGJ5IGFuIGludGVudC4AAAAAAAAAAAlTaWduZXJSZWYAAAAAAAADAAAAAAAAAARraW5kAAAH0AAAAAxJbnRlbnRTaWduZXIAAAAAAAAABWxhYmVsAAAAAAAAEQAAAAAAAAAOc2Vzc2lvbl9rZXlfaWQAAAAAA+4AAAAg",
        "AAAAAwAAACVSZXN1bHQgb2YgYSBzdWNjZXNzZnVsIGF1dGhvcml6YXRpb24uAAAAAAAAAAAAAApBdXRoTWV0aG9kAAAAAAADAAAAAAAAAAZEaXJlY3QAAAAAAAAAAAAAAAAAB1Nlc3Npb24AAAAAAQAAAAAAAAAHUGFzc2tleQAAAAAC",
        "AAAAAQAAADdTdHJ1Y3R1cmVkIGF1dGhvcml6YXRpb24gcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBrZXJuZWwuAAAAAAAAAAAKQXV0aFJlc3VsdAAAAAAABAAAAAAAAAAGbWV0aG9kAAAAAAfQAAAACkF1dGhNZXRob2QAAAAAAAAAAAAObm9uY2VfY29uc3VtZWQAAAAAAAYAAAAAAAAAFHJlbWFpbmluZ19vcGVyYXRpb25zAAAABAAAAAAAAAAOc2Vzc2lvbl9rZXlfaWQAAAAAA+4AAAAg",
        "AAAAAQAAACRTaWduYXR1cmUgYnl0ZXMgZm9yIGEgc2lnbmVkIGludGVudC4AAAAAAAAAC0ludGVudFByb29mAAAAAAIAAAAAAAAABGtpbmQAAAfQAAAAD0ludGVudFByb29mS2luZAAAAAAAAAAACXNpZ25hdHVyZQAAAAAAA+4AAABA",
        "AAAAAwAAADVTdXBwb3J0ZWQgaW50ZW50IHNpZ25lciBraW5kcyBmb3IgdGhlIGFjY291bnQga2VybmVsLgAAAAAAAAAAAAAMSW50ZW50U2lnbmVyAAAAAwAAAAAAAAAGRGlyZWN0AAAAAAAAAAAAAAAAAAdTZXNzaW9uAAAAAAEAAAAAAAAAB1Bhc3NrZXkAAAAAAg==",
        "AAAAAQAAADlDYW5vbmljYWwgc2lnbmVkIGludGVudCBzY2hlbWEgZm9yIGFjY291bnQgYXV0aG9yaXphdGlvbi4AAAAAAAAAAAAADFNpZ25lZEludGVudAAAAAcAAAAAAAAAB2FjY291bnQAAAAAEwAAAAAAAAAGYWN0aW9uAAAAAAfQAAAACkdhbWVBY3Rpb24AAAAAAAAAAAALYWN0aW9uX2hhc2gAAAAD7gAAACAAAAAAAAAACmV4cGlyZXNfYXQAAAAAAAYAAAAAAAAABW5vbmNlAAAAAAAABgAAAAAAAAAFcHJvb2YAAAAAAAfQAAAAC0ludGVudFByb29mAAAAAAAAAAAGc2lnbmVyAAAAAAfQAAAACVNpZ25lclJlZgAAAA==",
        "AAAAAwAAACxTaWduYXR1cmUgY29udGFpbmVyIGZvciBpbnRlbnQgdmVyaWZpY2F0aW9uLgAAAAAAAAAPSW50ZW50UHJvb2ZLaW5kAAAAAAIAAAAAAAAABE5vbmUAAAAAAAAAAAAAAAlTZWNwMjU2cjEAAAAAAAAB",
        "AAAAAQAAADRBIGd1YXJkaWFuIHRoYXQgY2FuIHBhcnRpY2lwYXRlIGluIGFjY291bnQgcmVjb3ZlcnkuAAAAAAAAAAhHdWFyZGlhbgAAAAIAAAAtTGVkZ2VyIHRpbWVzdGFtcCB3aGVuIHRoZSBndWFyZGlhbiB3YXMgYWRkZWQuAAAAAAAACGFkZGVkX2F0AAAABgAAAB9UaGUgZ3VhcmRpYW4ncyBTdGVsbGFyIGFkZHJlc3MuAAAAAAdhZGRyZXNzAAAAABM=",
        "AAAAAQAAAClDb25maWd1cmF0aW9uIGZvciB0aGUgcmVjb3ZlcnkgbWVjaGFuaXNtLgAAAAAAAAAAAAAOUmVjb3ZlcnlDb25maWcAAAAAAAMAAAAkTWF4aW11bSBudW1iZXIgb2YgZ3VhcmRpYW5zIGFsbG93ZWQuAAAADW1heF9ndWFyZGlhbnMAAAAAAAAEAAAAM051bWJlciBvZiBndWFyZGlhbnMgcmVxdWlyZWQgdG8gYXBwcm92ZSBhIHJlY292ZXJ5LgAAAAAJdGhyZXNob2xkAAAAAAAABAAAAEBMZWRnZXIgZHVyYXRpb24gdG8gd2FpdCBhZnRlciB0aHJlc2hvbGQgaXMgbWV0IGJlZm9yZSBleGVjdXRpb24uAAAAD3RpbWVsb2NrX3BlcmlvZAAAAAAG",
        "AAAAAQAAACNBIHBlbmRpbmcgYWNjb3VudCByZWNvdmVyeSByZXF1ZXN0LgAAAAAAAAAAD1JlY292ZXJ5UmVxdWVzdAAAAAAFAAAAMUFkZHJlc3NlcyBvZiBndWFyZGlhbnMgdGhhdCBoYXZlIGFwcHJvdmVkIHNvIGZhci4AAAAAAAAJYXBwcm92YWxzAAAAAAAD6gAAABMAAAAoV2hldGhlciB0aGlzIHJlcXVlc3QgaGFzIGJlZW4gY2FuY2VsbGVkLgAAAAljYW5jZWxsZWQAAAAAAAABAAAALUxlZGdlciB0aW1lc3RhbXAgd2hlbiByZWNvdmVyeSB3YXMgaW5pdGlhdGVkLgAAAAAAAAxpbml0aWF0ZWRfYXQAAAAGAAAAH1RoZSBwcm9wb3NlZCBuZXcgb3duZXIgYWRkcmVzcy4AAAAACW5ld19vd25lcgAAAAAAABMAAAA4RWFybGllc3QgbGVkZ2VyIHRpbWVzdGFtcCB3aGVuIHJlY292ZXJ5IGNhbiBiZSBleGVjdXRlZC4AAAAOdGltZWxvY2tfdW50aWwAAAAAAAY=",
        "AAAAAwAAADZGcm96ZW4gaWRlbnRpZmllciBmb3IgYSBwcmUtYnVpbHQgZ2FtZSBjaXJjdWl0IGZhbWlseS4AAAAAAAAAAAAJQ2lyY3VpdElkAAAAAAAABAAAAAAAAAALSGlkZGVuQ2FyZHMAAAAAAQAAAAAAAAAIRm9nT2ZXYXIAAAACAAAAAAAAAAhGYWlyRGljZQAAAAMAAAAAAAAACVNlYWxlZEJpZAAAAAAAAAQ=",
        "AAAAAQAAAClPbmUgc2xvdCBpbiBhIGZyb3plbiBwdWJsaWMtaW5wdXQgbGF5b3V0LgAAAAAAAAAAAAAPUHVibGljSW5wdXRTbG90AAAAAAIAAAAAAAAABGtpbmQAAAARAAAAAAAAAARuYW1lAAAAEQ==",
        "AAAAAQAAADJGcm96ZW4gcHVibGljLWlucHV0IGNvbnRyYWN0IGZvciBhIGNpcmN1aXQgZmFtaWx5LgAAAAAAAAAAABFQdWJsaWNJbnB1dExheW91dAAAAAAAAAEAAAAAAAAABXNsb3RzAAAAAAAD6gAAB9AAAAAPUHVibGljSW5wdXRTbG90AA==",
        "AAAAAQAAAAAAAAAAAAAAEFJvbGVHcmFudGVkRXZlbnQAAAADAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABHJvbGUAAAARAAAAAAAAAAZzZW5kZXIAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAEFJvbGVSZXZva2VkRXZlbnQAAAADAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABHJvbGUAAAARAAAAAAAAAAZzZW5kZXIAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAFVJvbGVBZG1pbkNoYW5nZWRFdmVudAAAAAAAAAQAAAAAAAAADm5ld19hZG1pbl9yb2xlAAAAAAARAAAAAAAAABNwcmV2aW91c19hZG1pbl9yb2xlAAAAABEAAAAAAAAABHJvbGUAAAARAAAAAAAAAAZzZW5kZXIAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAAGVJlY292ZXJ5R3VhcmRDbGVhcmVkRXZlbnQAAAAAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAACmNsZWFyZWRfYXQAAAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAG1JlY292ZXJ5R3VhcmRBY3RpdmF0ZWRFdmVudAAAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAADGFjdGl2YXRlZF9hdAAAAAY=",
        "AAAAAQAAAAAAAAAAAAAAGUV4ZWN1dGlvbkd1YXJkRXhpdGVkRXZlbnQAAAAAAAABAAAAAAAAAAhndWFyZF9pZAAAABE=",
        "AAAAAQAAAAAAAAAAAAAAGkV4ZWN1dGlvbkd1YXJkRW50ZXJlZEV2ZW50AAAAAAABAAAAAAAAAAhndWFyZF9pZAAAABE=",
        "AAAAAQAAAAAAAAAAAAAAEERlbGF5ZWRPcGVyYXRpb24AAAAHAAAAAAAAAAZhY3Rpb24AAAAAABEAAAAAAAAACGV4ZWN1dGVkAAAAAQAAAAAAAAAKZXhwaXJlc19hdAAAAAAABgAAAAAAAAAKbm90X2JlZm9yZQAAAAAABgAAAAAAAAAMb3BlcmF0aW9uX2lkAAAABgAAAAAAAAAHcGF5bG9hZAAAAAAOAAAAAAAAAAxzY2hlZHVsZWRfYXQAAAAG",
        "AAAAAQAAAAAAAAAAAAAAHURlbGF5ZWRFeGVjdXRpb25FeGVjdXRlZEV2ZW50AAAAAAAAAwAAAAAAAAAGYWN0aW9uAAAAAAARAAAAAAAAAAtleGVjdXRlZF9hdAAAAAAGAAAAAAAAAAxvcGVyYXRpb25faWQAAAAG",
        "AAAAAQAAAAAAAAAAAAAAHkRlbGF5ZWRFeGVjdXRpb25DYW5jZWxsZWRFdmVudAAAAAAAAgAAAAAAAAAGYWN0aW9uAAAAAAARAAAAAAAAAAxvcGVyYXRpb25faWQAAAAG",
        "AAAAAQAAAAAAAAAAAAAAHkRlbGF5ZWRFeGVjdXRpb25TY2hlZHVsZWRFdmVudAAAAAAABAAAAAAAAAAGYWN0aW9uAAAAAAARAAAAAAAAAApleHBpcmVzX2F0AAAAAAAGAAAAAAAAAApub3RfYmVmb3JlAAAAAAAGAAAAAAAAAAxvcGVyYXRpb25faWQAAAAG",
        "AAAABAAAADBFcnJvcnMgcmV0dXJuZWQgYnkgdGhlIHJldXNhYmxlIHN0YW5kYXJkcyBsYXllci4AAAAAAAAADlN0YW5kYXJkc0Vycm9yAAAAAAAUAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAA8AAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAD0AAAAAAAAAC093bmVyTm90U2V0AAAAAD4AAAAAAAAAElBlbmRpbmdPd25lck5vdFNldAAAAAAAPwAAAAAAAAAUUGVuZGluZ093bmVyTWlzbWF0Y2gAAABAAAAAAAAAABJSb2xlQWxyZWFkeUdyYW50ZWQAAAAAAEEAAAAAAAAADlJvbGVOb3RHcmFudGVkAAAAAABCAAAAAAAAABBNaXNzaW5nUm9sZUFkbWluAAAAQwAAAAAAAAAGUGF1c2VkAAAAAABEAAAAAAAAAAlOb3RQYXVzZWQAAAAAAABFAAAAAAAAAA9FeGVjdXRpb25Mb2NrZWQAAAAARgAAAAAAAAAOUmVjb3ZlcnlBY3RpdmUAAAAAAEcAAAAAAAAAEFJlY292ZXJ5SW5hY3RpdmUAAABIAAAAAAAAAApCYXRjaEVtcHR5AAAAAABJAAAAAAAAAA1CYXRjaFRvb0xhcmdlAAAAAAAASgAAAAAAAAART3BlcmF0aW9uTm90UmVhZHkAAAAAAABLAAAAAAAAABBPcGVyYXRpb25FeHBpcmVkAAAATAAAAAAAAAART3BlcmF0aW9uTm90Rm91bmQAAAAAAABNAAAAAAAAABhPcGVyYXRpb25BbHJlYWR5RXhlY3V0ZWQAAABOAAAAAAAAABJFeGVjdXRpb25Ob3RMb2NrZWQAAAAAAE8=",
        "AAAAAQAAAAAAAAAAAAAAGU93bmVyc2hpcFRyYW5zZmVycmVkRXZlbnQAAAAAAAACAAAAAAAAAAluZXdfb3duZXIAAAAAAAPoAAAAEwAAAAAAAAAOcHJldmlvdXNfb3duZXIAAAAAA+gAAAAT",
        "AAAAAQAAAAAAAAAAAAAAHU93bmVyc2hpcFRyYW5zZmVyU3RhcnRlZEV2ZW50AAAAAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAA1wZW5kaW5nX293bmVyAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAH093bmVyc2hpcFRyYW5zZmVyQ2FuY2VsbGVkRXZlbnQAAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAA1wZW5kaW5nX293bmVyAAAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAC1BhdXNlZEV2ZW50AAAAAAEAAAAAAAAAB2FjY291bnQAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAADVVucGF1c2VkRXZlbnQAAAAAAAABAAAAAAAAAAdhY2NvdW50AAAAABM=",
        "AAAAAQAAAC1NZXRhZGF0YSBzdG9yZWQgYXMgYSBzaW5nbGUgcGVyc2lzdGVudCBlbnRyeS4AAAAAAAAAAAAADVdvcmxkTWV0YWRhdGEAAAAAAAAEAAAAHlRvdGFsIG51bWJlciBvZiBsaXZlIGVudGl0aWVzLgAAAAAADGVudGl0eV9jb3VudAAAAAQAAAAcTGlzdCBvZiBhbGwgbGl2ZSBlbnRpdHkgSURzLgAAAAplbnRpdHlfaWRzAAAAAAPqAAAABAAAABlOZXh0IGVudGl0eSBJRCB0byBhc3NpZ24uAAAAAAAADm5leHRfZW50aXR5X2lkAAAAAAAEAAAAJ1ZlcnNpb24gY291bnRlciBmb3IgY2FjaGUgaW52YWxpZGF0aW9uLgAAAAAHdmVyc2lvbgAAAAAG",
        "AAAAAQAAAElPbi1jaGFpbiBwcm9vZiByZXByZXNlbnRhdGlvbiAoYCNbY29udHJhY3R0eXBlXWAgZm9yIGNvbnRyYWN0IGFyZ3VtZW50cykuAAAAAAAAAAAAABJPbkNoYWluTWVya2xlUHJvb2YAAAAAAAUAAAALVHJlZSBkZXB0aC4AAAAABWRlcHRoAAAAAAAABAAAAA5UaGUgbGVhZiBoYXNoLgAAAAAABGxlYWYAAAPuAAAAIAAAAB5JbmRleCBvZiB0aGUgbGVhZiBpbiB0aGUgdHJlZS4AAAAAAApsZWFmX2luZGV4AAAAAAAEAAAARlBhY2tlZCBkaXJlY3Rpb24gYml0cyAoYml0IGkgPSAxIG1lYW5zIGN1cnJlbnQgbm9kZSB3YXMgb24gdGhlIHJpZ2h0KS4AAAAAAAlwYXRoX2JpdHMAAAAAAAAEAAAAHlNpYmxpbmcgaGFzaGVzIGFsb25nIHRoZSBwYXRoLgAAAAAACHNpYmxpbmdzAAAD6gAAA+4AAAAg" ]),
      options
    )
  }
  public readonly fromJSON = {
    init_game: this.txFromJSON<GameState>,
        reset_game: this.txFromJSON<GameState>,
        move_paddle: this.txFromJSON<GameState>,
        update_tick: this.txFromJSON<GameState>,
        get_game_state: this.txFromJSON<GameState>
  }
}