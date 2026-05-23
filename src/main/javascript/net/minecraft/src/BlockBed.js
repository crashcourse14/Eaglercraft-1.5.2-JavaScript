// BlockBed.js
import { BlockDirectional } from './BlockDirectional.js';
import { Material } from './Material.js';
import { Block } from './Block.js';
import { Item } from './Item.js';
import { Direction } from './Direction.js';
import { ChunkCoordinates } from './ChunkCoordinates.js';

export class BlockBed extends BlockDirectional {
  /** Maps foot-of-bed direction index to [dx, dz] toward the head */
    static footBlockToHeadBlockMap = [[0, 1], [-1, 0], [0, -1], [1, 0]];

    #bedEndIcons  = null; // feet-end / head-end textures
    #bedSideIcons = null;
    #bedTopIcons  = null;

    constructor(id) {
        super(id, Material.cloth);
        this.#setBounds();
    }

  // -------------------------------------------------------------------------
  // Block property overrides
  // -------------------------------------------------------------------------

    isOpaqueCube()        { return false; }
    renderAsNormalBlock() { return false; }
    getMobilityFlag()     { return 1; }
    getRenderType()       { return 14; }

    onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

    setBlockBoundsBasedOnState(access, x, y, z) { this.#setBounds(); }

  // -------------------------------------------------------------------------
  // Textures
  // -------------------------------------------------------------------------

  /**
   * Returns the correct icon for the given face and metadata.
   *
   * Side 0 (bottom): uses the planks texture.
   * Other sides: looks up which face of the rotated bed model this side maps
   * to, then picks the appropriate top/side/end icon for foot vs head half.
   */
    getIcon(side, meta) {
        if (side === 0) {
        return Block.planks.getBlockTextureFromSide(side);
        }

        const dir      = BlockDirectional.getDirection(meta);
        const mappedFace = Direction.bedDirection[dir][side];
        const isHead   = BlockBed.isBlockHeadOfBed(meta) ? 1 : 0;

        // End faces: head-front (isHead=1, face=2) or foot-back (isHead=0, face=3)
        if ((isHead === 1 && mappedFace === 2) || (isHead === 0 && mappedFace === 3)) {
        return this.#bedEndIcons[isHead];
        }

        // Top/bottom faces vs side faces
        if (mappedFace === 4 || mappedFace === 5) {
        return this.#bedSideIcons[isHead];
        }

        return this.#bedTopIcons[isHead];
    }

    registerIcons(reg) {
        this.#bedTopIcons  = [reg.registerIcon('bed_feet_top'),  reg.registerIcon('bed_head_top')];
        this.#bedEndIcons  = [reg.registerIcon('bed_feet_end'),  reg.registerIcon('bed_head_end')];
        this.#bedSideIcons = [reg.registerIcon('bed_feet_side'), reg.registerIcon('bed_head_side')];
    }

  // -------------------------------------------------------------------------
  // Neighbour / placement logic
  // -------------------------------------------------------------------------

  /**
   * If one half of the bed is removed the other half removes itself too.
   */
    onNeighborBlockChange(world, x, y, z, neighborId) {
        const meta = world.getBlockMetadata(x, y, z);
        const dir  = BlockDirectional.getDirection(meta);
        const [dx, dz] = BlockBed.footBlockToHeadBlockMap[dir];

        if (BlockBed.isBlockHeadOfBed(meta)) {
            // Head half: check that the foot is still there
            if (world.getBlockId(x - dx, y, z - dz) !== this.blockID) {
            world.setBlockToAir(x, y, z);
            }
        } else {
            // Foot half: check that the head is still there
            if (world.getBlockId(x + dx, y, z + dz) !== this.blockID) {
            world.setBlockToAir(x, y, z);
            }
        }
    }

  // -------------------------------------------------------------------------
  // Drops / harvesting
  // -------------------------------------------------------------------------

  /** Only the foot half drops the bed item; the head drops nothing */
    idDropped(meta, rng, fortune) {
        return BlockBed.isBlockHeadOfBed(meta) ? 0 : Item.bed.itemID;
    }

  /** Only drop items from the foot half to avoid double-drops */
    dropBlockAsItemWithChance(world, x, y, z, meta, chance, fortune) {
        if (!BlockBed.isBlockHeadOfBed(meta)) {
            super.dropBlockAsItemWithChance(world, x, y, z, meta, chance, 0);
        }
    }

    idPicked(world, x, y, z) { return Item.bed.itemID; }

  /**
   * In creative mode, breaking the head half also removes the foot half
   * so neither drops items and the bed disappears cleanly.
   */
    onBlockHarvested(world, x, y, z, meta, player) {
        if (player.capabilities.isCreativeMode && BlockBed.isBlockHeadOfBed(meta)) {
            const dir  = BlockDirectional.getDirection(meta);
            const [dx, dz] = BlockBed.footBlockToHeadBlockMap[dir];
            const fx = x - dx, fz = z - dz;
            if (world.getBlockId(fx, y, fz) === this.blockID) {
            world.setBlockToAir(fx, y, fz);
            }
        }
    }

  // -------------------------------------------------------------------------
  // Static helpers
  // -------------------------------------------------------------------------

  /** Returns true if bit 3 of the metadata is set (head half of the bed) */
    static isBlockHeadOfBed(meta) { return (meta & 8) !== 0; }

  /** Returns true if bit 2 of the metadata is set (bed is occupied) */
    static isBedOccupied(meta) { return (meta & 4) !== 0; }

  /** Sets or clears the occupied flag in the block's metadata */
    static setBedOccupied(world, x, y, z, occupied) {
        let meta = world.getBlockMetadata(x, y, z);
        meta = occupied ? (meta | 4) : (meta & -5);
        world.setBlockMetadataWithNotify(x, y, z, meta, 4);
    }

  /**
   * Searches the 3×3 area around the bed (both halves) for an empty space
   * the player can wake up into. Skips `skip` valid spots before returning.
   * Returns null if no suitable spot is found.
   */
    static getNearestEmptyChunkCoordinates(world, x, y, z, skip) {
        const meta = world.getBlockMetadata(x, y, z);
        const dir  = BlockDirectional.getDirection(meta);
        const [dx, dz] = BlockBed.footBlockToHeadBlockMap[dir];

        for (let half = 0; half <= 1; ++half) {
            const x0 = x - dx * half - 1;
            const z0 = z - dz * half - 1;

            for (let cx = x0; cx <= x0 + 2; ++cx) {
                for (let cz = z0; cz <= z0 + 2; ++cz) {
                    if (world.doesBlockHaveSolidTopSurface(cx, y - 1, cz)
                        && world.isAirBlock(cx, y,     cz)
                        && world.isAirBlock(cx, y + 1, cz)) {
                    if (skip <= 0) return new ChunkCoordinates(cx, y, cz);
                    --skip;
                    }
                }
            }
        }

        return null;
    }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

    #setBounds() {
    this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.5625, 1.0);
    }
}