// BlockEndPortal.js
import { BlockContainer } from './BlockContainer.js';
import { TileEntityEndPortal } from './TileEntityEndPortal.js';

export class BlockEndPortal extends BlockContainer {
	/** True once the Ender Dragon has been defeated; allows end portal blocks to exist in the End */
	static bossDefeated = false;

	constructor(id, material) {
		super(id, material);
		this.setLightValue(1.0);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return -1; }
	quantityDropped(rng)  { return 0; }
	idPicked(world, x, y, z) { return 0; }

	createNewTileEntity(world) {
		return new TileEntityEndPortal();
	}

	registerIcons(reg) {
		this.blockIcon = reg.registerIcon('portal');
	}

	/** Only the bottom face (side 0) is rendered */
	shouldSideBeRendered(access, x, y, z, side) {
		return side === 0 ? super.shouldSideBeRendered(access, x, y, z, side) : false;
	}

	/** Portal has no collision — entities pass straight through */
	addCollisionBoxesToList(world, x, y, z, mask, list, entity) {}

	/** Portal surface is a thin 1/16-block-tall slab */
	setBlockBoundsBasedOnState(access, x, y, z) {
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.0625, 1.0);
	}

	randomDisplayTick(world, x, y, z, rng) {
		world.spawnParticle(
			'smoke',
			x + rng.nextFloat(),
			y + 0.8,
			z + rng.nextFloat(),
			0.0, 0.0, 0.0,
		);
	}

	/**
	 * Removes itself if placed outside the overworld before the boss is defeated.
	 */
	onBlockAdded(world, x, y, z) {
		if (!BlockEndPortal.bossDefeated && world.provider.dimensionId !== 0) {
			world.setBlockToAir(x, y, z);
		}
	}
}