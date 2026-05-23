// BlockBaseRailLogic.js
import { Block } from './Block.js';
import { BlockRailBase } from './BlockRailBase.js';
import { ChunkPosition } from './ChunkPosition.js';

export class BlockBaseRailLogic {
    #logicWorld;
    #railX;
    #railY;
    #railZ;
    #isStraightRail;
    #railChunkPosition = [];

  /** The rail block this logic belongs to */
    theRail;

    constructor(rail, world, x, y, z) {
        this.theRail = rail;
        this.#logicWorld = world;
        this.#railX = x;
        this.#railY = y;
        this.#railZ = z;

        const blockId = world.getBlockId(x, y, z);
        let meta = world.getBlockMetadata(x, y, z);

        if (Block.blocksList[blockId].isPowered) {
        this.#isStraightRail = true;
        meta &= -9; // clear the powered bit (bit 3)
        } else {
        this.#isStraightRail = false;
        }

        this.#setBasicRail(meta);
    }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /**
   * Populates railChunkPosition with the two neighbour positions this rail
   * shape connects to, based on the shape metadata (0–9).
   *
   * Shape key:
   *   0 = flat N–S    1 = flat E–W
   *   2 = ascend E    3 = ascend W    4 = ascend N    5 = ascend S
   *   6 = corner SE   7 = corner SW   8 = corner NW   9 = corner NE
   */
    #setBasicRail(meta) {
        const { x, y, z } = { x: this.#railX, y: this.#railY, z: this.#railZ };
        this.#railChunkPosition.length = 0;

        const shapeMap = [
        [[ 0,  0, -1], [ 0,  0,  1]], // 0: N–S
        [[-1,  0,  0], [ 1,  0,  0]], // 1: E–W
        [[-1,  0,  0], [ 1,  1,  0]], // 2: ascend E
        [[-1,  1,  0], [ 1,  0,  0]], // 3: ascend W
        [[ 0,  1, -1], [ 0,  0,  1]], // 4: ascend N
        [[ 0,  0, -1], [ 0,  1,  1]], // 5: ascend S
        [[ 1,  0,  0], [ 0,  0,  1]], // 6: corner SE
        [[-1,  0,  0], [ 0,  0,  1]], // 7: corner SW
        [[-1,  0,  0], [ 0,  0, -1]], // 8: corner NW
        [[ 1,  0,  0], [ 0,  0, -1]], // 9: corner NE
        ];

        const shape = shapeMap[meta];
        if (shape) {
            for (const [dx, dy, dz] of shape) {
                this.#railChunkPosition.push(new ChunkPosition(x + dx, y + dy, z + dz));
            }
        }
    }

  /** Re-validates each neighbour in railChunkPosition, removing stale entries */
    #refreshConnectedTracks() {
        for (let i = 0; i < this.#railChunkPosition.length; ++i) {
            const neighbor = this.#getRailLogic(this.#railChunkPosition[i]);
            if (neighbor !== null && neighbor.#isRailChunkPositionCorrect(this)) {
            this.#railChunkPosition[i] = new ChunkPosition(neighbor.#railX, neighbor.#railY, neighbor.#railZ);
            } else {
            this.#railChunkPosition.splice(i--, 1);
            }
        }
    }

  /** Returns true if a rail exists at (x,y) or one block above/below */
    #isMinecartTrack(x, y, z) {
    return BlockRailBase.isRailBlockAt(this.#logicWorld, x, y,     z)
        || BlockRailBase.isRailBlockAt(this.#logicWorld, x, y + 1, z)
        || BlockRailBase.isRailBlockAt(this.#logicWorld, x, y - 1, z);
    }

  /**
   * Tries to build a BlockBaseRailLogic for a neighbour position,
   * checking the given Y, Y+1, and Y-1 in that order.
   */
    #getRailLogic(pos) {
        const w = this.#logicWorld;
        const { x, y, z } = pos;
        if (BlockRailBase.isRailBlockAt(w, x, y,     z)) return new BlockBaseRailLogic(this.theRail, w, x, y,     z);
        if (BlockRailBase.isRailBlockAt(w, x, y + 1, z)) return new BlockBaseRailLogic(this.theRail, w, x, y + 1, z);
        if (BlockRailBase.isRailBlockAt(w, x, y - 1, z)) return new BlockBaseRailLogic(this.theRail, w, x, y - 1, z);
        return null;
    }

  /**
   * Returns true if any entry in this rail's position list shares X and Z
   * with the given rail logic (i.e. this rail connects toward that rail).
   */
    #isRailChunkPositionCorrect(other) {
        return this.#railChunkPosition.some(pos => pos.x === other.#railX && pos.z === other.#railZ);
    }

  /** Returns true if (x, z) appears in this rail's connection list */
    #isPartOfTrack(x, y, z) {
        return this.#railChunkPosition.some(pos => pos.x === x && pos.z === z);
    }

  /**
   * Returns true if the given rail can connect to this one.
   * Rules: already connected → yes; list full (2) → no; list empty → yes.
   */
    #canConnectTo(other) {
        if (this.#isRailChunkPositionCorrect(other)) return true;
        if (this.#railChunkPosition.length === 2)    return false;
        return true; // empty or single-entry list
    }

  /**
   * Adds a connection to `other` and recomputes the shape metadata so that
   * the correct track shape is written back to the world.
   */
    #connectToNeighbor(other) {
        const x = this.#railX, y = this.#railY, z = this.#railZ;
        this.#railChunkPosition.push(new ChunkPosition(other.#railX, other.#railY, other.#railZ));

        const N = this.#isPartOfTrack(x,     y, z - 1);
        const S = this.#isPartOfTrack(x,     y, z + 1);
        const W = this.#isPartOfTrack(x - 1, y, z);
        const E = this.#isPartOfTrack(x + 1, y, z);

        let shape = -1;

        if (N || S) shape = 0;
        if (W || E) shape = 1;

        if (!this.#isStraightRail) {
            if (S && E && !N && !W) shape = 6;
            if (S && W && !N && !E) shape = 7;
            if (N && W && !S && !E) shape = 8;
            if (N && E && !S && !W) shape = 9;
        }

        // Upgrade flat shapes to ascending if the adjacent block is raised
        const w = this.#logicWorld;
        if (shape === 0) {
        if (BlockRailBase.isRailBlockAt(w, x, y + 1, z - 1)) shape = 4;
        if (BlockRailBase.isRailBlockAt(w, x, y + 1, z + 1)) shape = 5;
        }
        if (shape === 1) {
        if (BlockRailBase.isRailBlockAt(w, x + 1, y + 1, z)) shape = 2;
        if (BlockRailBase.isRailBlockAt(w, x - 1, y + 1, z)) shape = 3;
        }

        if (shape < 0) shape = 0;

        const meta = this.#isStraightRail
        ? (w.getBlockMetadata(x, y, z) & 8) | shape
        : shape;

        w.setBlockMetadataWithNotify(x, y, z, meta, 3);
    }

  /**
   * Returns true if the rail at (x,y,z) has a connection list that includes
   * this rail (i.e. can connect from that position toward this one).
   */
    #canConnectFrom(x, y, z) {
        const logic = this.#getRailLogic(new ChunkPosition(x, y, z));
        if (logic === null) return false;
        logic.#refreshConnectedTracks();
        return logic.#canConnectTo(this);
    }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /** Returns how many of the four cardinal neighbours contain a rail */
    getNumberOfAdjacentTracks() {
        const x = this.#railX, y = this.#railY, z = this.#railZ;
        return [
            this.#isMinecartTrack(x,     y, z - 1),
            this.#isMinecartTrack(x,     y, z + 1),
            this.#isMinecartTrack(x - 1, y, z),
            this.#isMinecartTrack(x + 1, y, z),
        ].filter(Boolean).length;
    }

  /**
   * Recomputes and writes the optimal rail shape given the current neighbours.
   *
   * @param {boolean} preferCorners  When multiple shapes are possible, prefer
   *                                 corner shapes over straight ones.
   * @param {boolean} forceWrite     Always write metadata even if unchanged.
   */
    func_94511_a(preferCorners, forceWrite) {
        const x = this.#railX, y = this.#railY, z = this.#railZ;
        const w = this.#logicWorld;

        const N = this.#canConnectFrom(x,     y, z - 1);
        const S = this.#canConnectFrom(x,     y, z + 1);
        const W = this.#canConnectFrom(x - 1, y, z);
        const E = this.#canConnectFrom(x + 1, y, z);

        let shape = -1;

        // Unambiguous straight connections
        if ((N || S) && !W && !E) shape = 0;
        if ((W || E) && !N && !S) shape = 1;

        // Unambiguous corners (non-powered rails only)
        if (!this.#isStraightRail) {
        if (S && E && !N && !W) shape = 6;
        if (S && W && !N && !E) shape = 7;
        if (N && W && !S && !E) shape = 8;
        if (N && E && !S && !W) shape = 9;
        }

        // Ambiguous: fall back to straights, then corners by preference
        if (shape === -1) {
            if (N || S) shape = 0;
            if (W || E) shape = 1;

            if (!this.#isStraightRail) {
                if (preferCorners) {
                if (S && E) shape = 6;
                if (W && S) shape = 7;
                if (E && N) shape = 9;
                if (N && W) shape = 8;
                } else {
                if (N && W) shape = 8;
                if (E && N) shape = 9;
                if (W && S) shape = 7;
                if (S && E) shape = 6;
                }
            }
        }

        // Upgrade flat shapes to ascending
        if (shape === 0) {
        if (BlockRailBase.isRailBlockAt(w, x, y + 1, z - 1)) shape = 4;
        if (BlockRailBase.isRailBlockAt(w, x, y + 1, z + 1)) shape = 5;
        }
        if (shape === 1) {
        if (BlockRailBase.isRailBlockAt(w, x + 1, y + 1, z)) shape = 2;
        if (BlockRailBase.isRailBlockAt(w, x - 1, y + 1, z)) shape = 3;
        }

        if (shape < 0) shape = 0;

        this.#setBasicRail(shape);

        const meta = this.#isStraightRail
        ? (w.getBlockMetadata(x, y, z) & 8) | shape
        : shape;

        if (forceWrite || w.getBlockMetadata(x, y, z) !== meta) {
            w.setBlockMetadataWithNotify(x, y, z, meta, 3);

            for (const pos of this.#railChunkPosition) {
                const neighbor = this.#getRailLogic(pos);
                if (neighbor !== null) {
                neighbor.#refreshConnectedTracks();
                    if (neighbor.#canConnectTo(this)) {
                        neighbor.#connectToNeighbor(this);
                    }
                }
            }
        }
    }
}