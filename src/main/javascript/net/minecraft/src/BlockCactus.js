// BlockCactus.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';
import { DamageSource } from './DamageSource.js';

export class BlockCactus extends Block {
	#cactusTopIcon    = null;
	#cactusBottomIcon = null;

	constructor(id) {
		super(id, Material.cactus);
		this.setTickRandomly(true);
		this.setCreativeTab(CreativeTabs.tabDecorations);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 13; }

	getIcon(side, meta) {
		if (side === 1) return this.#cactusTopIcon;
		if (side === 0) return this.#cactusBottomIcon;
		return this.blockIcon;
	}

	registerIcons(reg) {
		this.blockIcon        = reg.registerIcon('cactus_side');
		this.#cactusTopIcon    = reg.registerIcon('cactus_top');
		this.#cactusBottomIcon = reg.registerIcon('cactus_bottom');
	}

	// -------------------------------------------------------------------------
	// Bounding boxes
	// -------------------------------------------------------------------------

	/** Inset collision box — entities can touch the cactus without being inside it */
	getCollisionBoundingBoxFromPool(world, x, y, z) {
		const m = 0.0625;
		return AxisAlignedBB.getAABBPool().getAABB(
			x + m,     y,     z + m,
			x + 1 - m, y + 1 - m, z + 1 - m,
		);
	}

	/** Selection box is full-height but still inset on X and Z */
	getSelectedBoundingBoxFromPool(world, x, y, z) {
		const m = 0.0625;
		return AxisAlignedBB.getAABBPool().getAABB(
			x + m,     y,     z + m,
			x + 1 - m, y + 1, z + 1 - m,
		);
	}

	// -------------------------------------------------------------------------
	// Growth
	// -------------------------------------------------------------------------

	/**
	 * Increments the growth counter each tick. When it reaches 15 the cactus
	 * grows a new block upward, provided the column is fewer than 3 blocks tall.
	 */
	updateTick(world, x, y, z, rng) {
		if (!world.isAirBlock(x, y + 1, z)) return;

		let height = 1;
		while (world.getBlockId(x, y - height, z) === this.blockID) ++height;

		if (height >= 3) return;

		const meta = world.getBlockMetadata(x, y, z);
		if (meta === 15) {
			world.setBlock(x, y + 1, z, this.blockID);
			world.setBlockMetadataWithNotify(x, y, z, 0, 4);
			this.onNeighborBlockChange(world, x, y + 1, z, this.blockID);
		} else {
			world.setBlockMetadataWithNotify(x, y, z, meta + 1, 4);
		}
	}

	// -------------------------------------------------------------------------
	// Placement / survival
	// -------------------------------------------------------------------------

	canPlaceBlockAt(world, x, y, z) {
		return super.canPlaceBlockAt(world, x, y, z) && this.canBlockStay(world, x, y, z);
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		if (!this.canBlockStay(world, x, y, z)) {
			world.destroyBlock(x, y, z, true);
		}
	}

	/**
	 * A cactus can survive only when:
	 * - no solid block is directly adjacent on any horizontal side, and
	 * - the block below is cactus or sand.
	 */
	canBlockStay(world, x, y, z) {
		if (world.getBlockMaterial(x - 1, y, z).isSolid()) return false;
		if (world.getBlockMaterial(x + 1, y, z).isSolid()) return false;
		if (world.getBlockMaterial(x, y, z - 1).isSolid()) return false;
		if (world.getBlockMaterial(x, y, z + 1).isSolid()) return false;

		const belowId = world.getBlockId(x, y - 1, z);
		return belowId === Block.cactus.blockID || belowId === Block.sand.blockID;
	}

	// -------------------------------------------------------------------------
	// Collision damage
	// -------------------------------------------------------------------------

	onEntityCollidedWithBlock(world, x, y, z, entity) {
		entity.attackEntityFrom(DamageSource.cactus, 1);
	}
}