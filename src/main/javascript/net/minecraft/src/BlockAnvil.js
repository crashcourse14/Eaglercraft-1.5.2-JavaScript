// BlockAnvil.js
import { BlockSand } from './BlockSand.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { MathHelper } from './MathHelper.js';
import { ItemStack } from './ItemStack.js';

export class BlockAnvil extends BlockSand {
  /** List of types/states the Anvil can be in */
  static statuses       = ['intact', 'slightlyDamaged', 'veryDamaged'];
  static #anvilIconNames = ['anvil_top', 'anvil_top_damaged_1', 'anvil_top_damaged_2'];

  field_82521_b = 0;
  #iconArray = null;

  constructor(id) {
    super(id, Material.anvil);
    this.setLightOpacity(0);
    this.setCreativeTab(CreativeTabs.tabDecorations);
  }

  renderAsNormalBlock() { return false; }
  isOpaqueCube()        { return false; }
  getRenderType()       { return 35; }
  shouldSideBeRendered(access, x, y, z, side) { return true; }

  /** Returns the damage value encoded in the upper metadata bits */
  damageDropped(meta) { return meta >> 2; }

  /**
   * From the specified side and block metadata retrieves the block's texture.
   * Side 1 (top) uses the damage-tier icon; all other sides use the base icon.
   */
  getIcon(side, meta) {
    if (this.field_82521_b === 3 && side === 1) {
      const idx = (meta >> 2) % this.#iconArray.length;
      return this.#iconArray[idx];
    }
    return this.blockIcon;
  }

  registerIcons(reg) {
    this.blockIcon = reg.registerIcon('anvil_base');
    this.#iconArray = BlockAnvil.#anvilIconNames.map(name => reg.registerIcon(name));
  }

  /**
   * Sets block bounds based on orientation bits (metadata & 3).
   * North/south orientation (1 or 3): narrow on Z axis.
   * East/west orientation (0 or 2):  narrow on X axis.
   */
  setBlockBoundsBasedOnState(access, x, y, z) {
    const orientation = access.getBlockMetadata(x, y, z) & 3;
    if (orientation === 1 || orientation === 3) {
      this.setBlockBounds(0.0, 0.0, 0.125, 1.0, 1.0, 0.875);
    } else {
      this.setBlockBounds(0.125, 0.0, 0.0, 0.875, 1.0, 1.0);
    }
  }

  /**
   * Encodes placement orientation into the lower 2 metadata bits,
   * preserving the damage tier in the upper bits.
   */
  onBlockPlacedBy(world, x, y, z, entity, stack) {
    let facing = (MathHelper.floor_double(entity.rotationYaw * 4.0 / 360.0 + 0.5) & 3) + 1;
    facing %= 4;
    const damageBits = world.getBlockMetadata(x, y, z) >> 2;

    // facing 0→orientation 2, 1→3, 2→0, 3→1
    const orientationMap = [2, 3, 0, 1];
    world.setBlockMetadataWithNotify(x, y, z, orientationMap[facing] | (damageBits << 2), 2);
  }

  onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

  /** Adds all three damage states to the creative inventory */
  getSubBlocks(id, tab, list) {
    list.push(new ItemStack(id, 1, 0));
    list.push(new ItemStack(id, 1, 1));
    list.push(new ItemStack(id, 1, 2));
  }

  /** Marks the falling block entity as an anvil so it deals fall damage */
  onStartFalling(entity) { entity.setIsAnvil(true); }

  /** Plays the anvil landing sound when the falling block hits the ground */
  onFinishFalling(world, x, y, z, meta) { world.playAuxSFX(1022, x, y, z, 0); }
}