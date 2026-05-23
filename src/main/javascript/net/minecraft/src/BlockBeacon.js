// BlockBeacon.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { TileEntityBeacon } from './TileEntityBeacon.js';

export class BlockBeacon extends BlockContainer {
    #theIcon = null;

    constructor(id) {
        super(id, Material.glass);
        this.setHardness(3.0);
        this.setCreativeTab(CreativeTabs.tabMisc);
    }

  /** Returns a new TileEntityBeacon when the block is placed */
    createNewTileEntity(world) {
        
    }

    onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }
    isOpaqueCube()        { return false; }
    renderAsNormalBlock() { return false; }
    getRenderType()       { return 34; }

    registerIcons(reg) {
        super.registerIcons(reg);
        this.#theIcon = reg.registerIcon('beacon');
    }

    getBeaconIcon() { return this.#theIcon; }

  /**
   * If the placed ItemStack has a custom display name, forwards it to the
   * tile entity so the beacon GUI shows the correct label.
   */
    onBlockPlacedBy(world, x, y, z, entity, stack) {
        super.onBlockPlacedBy(world, x, y, z, entity, stack);
        if (stack.hasDisplayName()) {
            world.getBlockTileEntity(x, y, z).func_94047_a(stack.getDisplayName());
        }
    }
}