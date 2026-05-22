// BlockBasePressurePlate.js
import { Block } from './Block.js';
import { CreativeTabs } from './CreativeTabs.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';
import { BlockFence } from './BlockFence.js';

export class BlockBasePressurePlate extends Block {
  #pressurePlateIconName;

  constructor(id, iconName, material) {
    super(id, material);
    this.#pressurePlateIconName = iconName;
    this.setCreativeTab(CreativeTabs.tabRedstone);
    this.setTickRandomly(true);
    this.#updateBounds(this.getMetaFromWeight(15));
  }

  // -------------------------------------------------------------------------
  // Block property overrides
  // -------------------------------------------------------------------------

  isOpaqueCube()      { return false; }
  renderAsNormalBlock() { return false; }
  canProvidePower()   { return true; }
  getMobilityFlag()   { return 1; }
  tickRate(world)     { return 20; }

  getCollisionBoundingBoxFromPool(world, x, y, z) { return null; }
  getBlocksMovement(access, x, y, z) { return true; }

  // -------------------------------------------------------------------------
  // Bounds helpers
  // -------------------------------------------------------------------------

  setBlockBoundsBasedOnState(access, x, y, z) {
    this.#updateBounds(access.getBlockMetadata(x, y, z));
  }

  /** Sets the block bounds depending on whether the plate is pressed */
  #updateBounds(meta) {
    const margin   = 0.0625;
    const heightOn = 0.03125;  // pressed: slightly lower top face
    const heightOff= 0.0625;
    const pressed  = this.getPowerSupply(meta) > 0;
    this.setBlockBounds(margin, 0.0, margin, 1.0 - margin, pressed ? heightOn : heightOff, 1.0 - margin);
  }

  setBlockBoundsForItemRender() {
    this.setBlockBounds(0.0, 0.375, 0.0, 1.0, 0.625, 1.0);
  }

  // -------------------------------------------------------------------------
  // Placement / neighbour logic
  // -------------------------------------------------------------------------

  canPlaceBlockAt(world, x, y, z) {
    return world.doesBlockHaveSolidTopSurface(x, y - 1, z)
        || BlockFence.isIdAFence(world.getBlockId(x, y - 1, z));
  }

  onNeighborBlockChange(world, x, y, z, neighborId) {
    const hasSupport = world.doesBlockHaveSolidTopSurface(x, y - 1, z)
                    || BlockFence.isIdAFence(world.getBlockId(x, y - 1, z));
    if (!hasSupport) {
      this.dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
      world.setBlockToAir(x, y, z);
    }
  }

  // -------------------------------------------------------------------------
  // Plate activation
  // -------------------------------------------------------------------------

  /**
   * Detects whether entities are on the plate and toggles its state.
   * Plays a click sound and schedules a tick-off update when active.
   */
  setStateIfMobInteractsWithPlate(world, x, y, z, prevPower) {
    const newPower  = this.getPlateState(world, x, y, z);
    const wasActive = prevPower > 0;
    const isActive  = newPower > 0;

    if (prevPower !== newPower) {
      world.setBlockMetadataWithNotify(x, y, z, this.getMetaFromWeight(newPower), 2);
      this.#notifyNeighbours(world, x, y, z);
      world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
    }

    if (!wasActive && isActive) {
      world.playSoundEffect(x + 0.5, y + 0.1, z + 0.5, 'random.click', 0.3, 0.5);
    } else if (wasActive && !isActive) {
      world.playSoundEffect(x + 0.5, y + 0.1, z + 0.5, 'random.click', 0.3, 0.6);
    }

    if (isActive) {
      world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world));
    }
  }

  /** Returns the sensitive AABB used to detect entities on the plate */
  getSensitiveAABB(x, y, z) {
    const margin = 0.125;
    return AxisAlignedBB.getAABBPool().getAABB(
      x + margin, y,        z + margin,
      x + 1 - margin, y + 0.25, z + 1 - margin,
    );
  }

  breakBlock(world, x, y, z, id, meta) {
    if (this.getPowerSupply(meta) > 0) {
      this.#notifyNeighbours(world, x, y, z);
    }
    super.breakBlock(world, x, y, z, id, meta);
  }

  // -------------------------------------------------------------------------
  // Redstone power
  // -------------------------------------------------------------------------

  isProvidingWeakPower(access, x, y, z, side) {
    return this.getPowerSupply(access.getBlockMetadata(x, y, z));
  }

  isProvidingStrongPower(access, x, y, z, side) {
    return side === 1 ? this.getPowerSupply(access.getBlockMetadata(x, y, z)) : 0;
  }

  // -------------------------------------------------------------------------
  // Icons
  // -------------------------------------------------------------------------

  registerIcons(reg) {
    this.blockIcon = reg.registerIcon(this.#pressurePlateIconName);
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /** Notifies the block and the one below it of a neighbour change */
  #notifyNeighbours(world, x, y, z) {
    world.notifyBlocksOfNeighborChange(x, y,     z, this.blockID);
    world.notifyBlocksOfNeighborChange(x, y - 1, z, this.blockID);
  }

  // -------------------------------------------------------------------------
  // Abstract methods — must be implemented by subclasses
  // -------------------------------------------------------------------------

  /**
   * Returns the current power output of the plate based on what's on it.
   * @abstract
   * @param {World} world
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number} 0–15
   */
  getPlateState(world, x, y, z) {
    throw new Error(`${this.constructor.name}.getPlateState() is not implemented`);
  }

  /**
   * Returns the redstone power level (0–15) encoded in the given metadata.
   * @abstract
   * @param {number} meta
   * @returns {number}
   */
  getPowerSupply(meta) {
    throw new Error(`${this.constructor.name}.getPowerSupply() is not implemented`);
  }

  /**
   * Returns the metadata value corresponding to the given weight (0–15).
   * @abstract
   * @param {number} weight
   * @returns {number}
   */
  getMetaFromWeight(weight) {
    throw new Error(`${this.constructor.name}.getMetaFromWeight() is not implemented`);
  }
}