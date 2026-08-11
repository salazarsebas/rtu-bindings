import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, i32, u64, u128, Option } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CA6SO3VN4DJWYGFI4DKJETW5T7J4XKXZD7B3I3J6CCSDKUMNIUNBMZ2A";
    };
};
/**
 * External game state for API consumers
 */
export interface GameState {
    cols: u32;
    revealed_count: u32;
    rows: u32;
    safe_cells_remaining: u32;
    status: u32;
    total_mines: u32;
}
/**
 * Reveal result
 */
export interface RevealResult {
    adjacent_mines: u32;
    is_mine: boolean;
    message: string;
    success: boolean;
}
/**
 * ECS World State
 */
export interface ECSWorldState {
    board: BoardComponent;
    game_state: GameStateComponent;
    mine_layout: MineLayoutComponent;
    next_entity_id: u32;
}
/**
 * Board component - stores the mine layout and revealed state
 */
export interface BoardComponent {
    cells: Array<u32>;
    entity_id: u32;
}
/**
 * Visible cell state for querying
 */
export interface VisibleCellState {
    adjacent_mines: u32;
    is_mine: boolean;
    is_revealed: boolean;
}
/**
 * Game state component
 */
export interface GameStateComponent {
    entity_id: u32;
    revealed_count: u32;
    status: u32;
}
/**
 * Mine layout component - stores where mines are placed (hidden from players)
 */
export interface MineLayoutComponent {
    entity_id: u32;
    mines: Array<u32>;
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
export declare const CougrError: {
    /**
     * Entity with the given ID was not found
     */
    1: {
        message: string;
    };
    /**
     * Component not found for the given entity
     */
    2: {
        message: string;
    };
    /**
     * Failed to deserialize component/resource data
     */
    3: {
        message: string;
    };
    /**
     * Data length does not match expected size
     */
    4: {
        message: string;
    };
    /**
     * Index out of bounds during storage access
     */
    5: {
        message: string;
    };
    /**
     * Resource with the given type was not found
     */
    6: {
        message: string;
    };
    /**
     * Storage operation failed
     */
    7: {
        message: string;
    };
};
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
export declare enum ComponentStorage {
    Table = 0,
    Sparse = 1
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
export declare const ZKError: {
    /**
     * The submitted proof is structurally invalid.
     */
    10: {
        message: string;
    };
    /**
     * An elliptic curve point is not on the curve or not in the subgroup.
     */
    11: {
        message: string;
    };
    /**
     * A scalar value is out of range for the target field.
     */
    12: {
        message: string;
    };
    /**
     * Proof verification failed (valid structure, but proof is incorrect).
     */
    13: {
        message: string;
    };
    /**
     * Input data is malformed or has the wrong length.
     */
    14: {
        message: string;
    };
    /**
     * The verification key is malformed or incompatible with the proof.
     */
    15: {
        message: string;
    };
    /**
     * The circuit type does not match the expected verification key.
     */
    16: {
        message: string;
    };
    /**
     * Public inputs do not match the circuit's expected format.
     */
    17: {
        message: string;
    };
    /**
     * Merkle tree cannot be constructed from empty leaves.
     */
    18: {
        message: string;
    };
    /**
     * Leaf index is out of bounds for the tree.
     */
    19: {
        message: string;
    };
    /**
     * Merkle proof has invalid length (doesn't match tree depth).
     */
    20: {
        message: string;
    };
    /**
     * Merkle inclusion proof verification failed.
     */
    21: {
        message: string;
    };
    /**
     * Tree depth exceeds the maximum allowed depth.
     */
    22: {
        message: string;
    };
    /**
     * Leaf data is invalid or malformed.
     */
    23: {
        message: string;
    };
    /**
     * A state transition violates the explicit phase-3 orchestration contract.
     */
    24: {
        message: string;
    };
    /**
     * A transition arrived after its allowed dispute or reveal window.
     */
    25: {
        message: string;
    };
    /**
     * The requested operation cannot proceed because the channel is already closed.
     */
    26: {
        message: string;
    };
    /**
     * A fog-of-war exploration target lies outside the allowed visibility window.
     */
    27: {
        message: string;
    };
    /**
     * A recursive composition descriptor is malformed or exceeds declared bounds.
     */
    28: {
        message: string;
    };
};
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
export declare const AccountError: {
    20: {
        message: string;
    };
    21: {
        message: string;
    };
    22: {
        message: string;
    };
    23: {
        message: string;
    };
    24: {
        message: string;
    };
    25: {
        message: string;
    };
    26: {
        message: string;
    };
    27: {
        message: string;
    };
    28: {
        message: string;
    };
    29: {
        message: string;
    };
    30: {
        message: string;
    };
    31: {
        message: string;
    };
    32: {
        message: string;
    };
    33: {
        message: string;
    };
    34: {
        message: string;
    };
    35: {
        message: string;
    };
    36: {
        message: string;
    };
    37: {
        message: string;
    };
    38: {
        message: string;
    };
    39: {
        message: string;
    };
    40: {
        message: string;
    };
    41: {
        message: string;
    };
    42: {
        message: string;
    };
    43: {
        message: string;
    };
    44: {
        message: string;
    };
};
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
export declare enum AuthMethod {
    Direct = 0,
    Session = 1,
    Passkey = 2
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
export declare enum IntentSigner {
    Direct = 0,
    Session = 1,
    Passkey = 2
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
export declare enum IntentProofKind {
    None = 0,
    Secp256r1 = 1
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
export declare enum CircuitId {
    HiddenCards = 1,
    FogOfWar = 2,
    FairDice = 3,
    SealedBid = 4
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
export declare const StandardsError: {
    60: {
        message: string;
    };
    61: {
        message: string;
    };
    62: {
        message: string;
    };
    63: {
        message: string;
    };
    64: {
        message: string;
    };
    65: {
        message: string;
    };
    66: {
        message: string;
    };
    67: {
        message: string;
    };
    68: {
        message: string;
    };
    69: {
        message: string;
    };
    70: {
        message: string;
    };
    71: {
        message: string;
    };
    72: {
        message: string;
    };
    73: {
        message: string;
    };
    74: {
        message: string;
    };
    75: {
        message: string;
    };
    76: {
        message: string;
    };
    77: {
        message: string;
    };
    78: {
        message: string;
    };
    79: {
        message: string;
    };
};
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
     * Construct and simulate a get_board transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Get the board state (for debugging/viewing)
     */
    get_board: (options?: MethodOptions) => Promise<AssembledTransaction<Array<u32>>>;
    /**
     * Construct and simulate a get_state transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Get the current game state
     */
    get_state: (options?: MethodOptions) => Promise<AssembledTransaction<GameState>>;
    /**
     * Construct and simulate a init_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Initialize a new game with deterministic mine layout
     */
    init_game: (options?: MethodOptions) => Promise<AssembledTransaction<GameState>>;
    /**
     * Construct and simulate a reset_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Reset the game
     */
    reset_game: (options?: MethodOptions) => Promise<AssembledTransaction<GameState>>;
    /**
     * Construct and simulate a is_finished transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Check if the game is finished
     */
    is_finished: (options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a reveal_cell transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Reveal a cell at (row, col)
     */
    reveal_cell: ({ row, col }: {
        row: u32;
        col: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<RevealResult>>;
    /**
     * Construct and simulate a get_visible_cell transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Get visible state of a specific cell
     */
    get_visible_cell: ({ row, col }: {
        row: u32;
        col: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<VisibleCellState>>;
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
        get_board: (json: string) => AssembledTransaction<number[]>;
        get_state: (json: string) => AssembledTransaction<GameState>;
        init_game: (json: string) => AssembledTransaction<GameState>;
        reset_game: (json: string) => AssembledTransaction<GameState>;
        is_finished: (json: string) => AssembledTransaction<boolean>;
        reveal_cell: (json: string) => AssembledTransaction<RevealResult>;
        get_visible_cell: (json: string) => AssembledTransaction<VisibleCellState>;
    };
}
