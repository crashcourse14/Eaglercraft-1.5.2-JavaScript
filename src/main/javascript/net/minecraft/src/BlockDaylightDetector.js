// BlockDaylightDetector.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { MathHelper } from './MathHelper.js';
import { EnumSkyBlock } from './EnumSkyBlock.js';
import { TileEntityDaylightDetector } from './TileEntityDaylightDetector.js';

export class BlockDaylightDetector extends BlockContainer {
	#iconArray = new Array(2);

	constructor(id) {
		super(id, Material.wood);
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.375, 1.0);
		this.setCreativeTab(CreativeTabs.tabRedstone);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	canProvidePower()     { return true; }

	setBlockBoundsBasedOnState(access, x, y, z) {
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.375, 1.0);
	}

	updateTick(world, x, y, z, rng)              {}
	onNeighborBlockChange(world, x, y, z, id)    {}
	onBlockAdded(world, x, y, z)                 {}

	createNewTileEntity(world) {
		return new TileEntityDaylightDetector();
	}

	isProvidingWeakPower(access, x, y, z, side) {
		return access.getBlockMetadata(x, y, z);
	}

	getIcon(side, meta) {
		return side === 1 ? this.#iconArray[0] : this.#iconArray[1];
	}

	registerIcons(reg) {
		this.#iconArray[0] = reg.registerIcon('daylightDetector_top');
		this.#iconArray[1] = reg.registerIcon('daylightDetector_side');
	}

	/**
	 * Recalculates the redstone output (0–15) based on the current sky light
	 * level, adjusted for the sun's angle to reduce output at dawn/dusk.
	 */
	updateLightLevel(world, x, y, z) {
		if (world.provider.hasNoSky) return;

		const meta  = world.getBlockMetadata(x, y, z);
		let skyLight = world.getSavedLightValue(EnumSkyBlock.Sky, x, y, z)
			- world.skylightSubtracted;

		// Nudge the celestial angle toward noon (0) or midnight (2π)
		// to smoothly reduce output near the horizon
		let angle = world.getCelestialAngleRadians(1.0);
		if (angle < Math.PI) {
			angle += (0.0 - angle) * 0.2;
		} else {
			angle += (Math.PI * 2.0 - angle) * 0.2;
		}

		skyLight = Math.round(skyLight * MathHelper.cos(angle));
		skyLight  = Math.max(0, Math.min(15, skyLight));

		if (meta !== skyLight) {
			world.setBlockMetadataWithNotify(x, y, z, skyLight, 3);
		}
	}
}