// BlockFarmland.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';

export class BlockFarmland extends Block {
	#wetIcon = null;
	#dryIcon = null;

	constructor(id) {
		super(id, Material.ground);
		this.setTickRandomly(true);
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.9375, 1.0);
		this.setLightOpacity(255);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }

	idDropped(meta, rng, fortune) { return Block.dirt.idDropped(0, rng, fortune); }
	idPicked(world, x, y, z)     { return Block.dirt.blockID; }

	registerIcons(reg) {
		this.#wetIcon = reg.registerIcon('farmland_wet');
		this.#dryIcon = reg.registerIcon('farmland_dry');
	}

	/** Top face shows wet or dry texture based on metadata; all other faces use dirt */
	getIcon(side, meta) {
		if (side === 1) return meta > 0 ? this.#wetIcon : this.#dryIcon;
		return Block.dirt.getBlockTextureFromSide(side);
	}

	/** Full 1×1×1 collision box despite the slightly shorter visual height */
	getCollisionBoundingBoxFromPool(world, x, y, z) {
		return AxisAlignedBB.getAABBPool().getAABB(x, y, z, x + 1, y + 1, z + 1);
	}

	// -------------------------------------------------------------------------
	// Ticking / state
	// -------------------------------------------------------------------------

	/**
	 * Each tick:
	 * - Water nearby or rain → set hydration to max (7).
	 * - Otherwise: decrement hydration; if fully dry and no crops above, revert to dirt.
	 */
	updateTick(world, x, y, z, rng) {
		if (this.#isWaterNearby(world, x, y, z) || world.canLightningStrikeAt(x, y + 1, z)) {
			world.setBlockMetadataWithNotify(x, y, z, 7, 2);
		} else {
			const meta = world.getBlockMetadata(x, y, z);
			if (meta > 0) {
				world.setBlockMetadataWithNotify(x, y, z, meta - 1, 2);
			} else if (!this.#isCropsNearby(world, x, y, z)) {
				world.setBlock(x, y, z, Block.dirt.blockID);
			}
		}
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		super.onNeighborBlockChange(world, x, y, z, neighborId);
		if (world.getBlockMaterial(x, y + 1, z).isSolid()) {
			world.setBlock(x, y, z, Block.dirt.blockID);
		}
	}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Returns true if any block in the 9×2×9 area around the farmland is water.
	 * Checks y and y+1 to catch surface-level water.
	 */
	#isWaterNearby(world, x, y, z) {
		for (let bx = x - 4; bx <= x + 4; ++bx) {
			for (let by = y; by <= y + 1; ++by) {
				for (let bz = z - 4; bz <= z + 4; ++bz) {
					if (world.getBlockMaterial(bx, by, bz) === Material.water) return true;
				}
			}
		}
		return false;
	}

	/**
	 * Returns true if a crop block is directly above this farmland.
	 * Note: the Java source initialises the search radius to 0 (byte var5 = 0),
	 * so only the block directly above (x, y+1, z) is ever checked.
	 */
	#isCropsNearby(world, x, y, z) {
		const id = world.getBlockId(x, y + 1, z);
		return id === Block.crops.blockID
			|| id === Block.melonStem.blockID
			|| id === Block.pumpkinStem.blockID
			|| id === Block.potato.blockID
			|| id === Block.carrot.blockID;
	}
}