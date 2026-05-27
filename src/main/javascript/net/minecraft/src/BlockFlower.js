// BlockFlower.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';

export class BlockFlower extends Block {
	/**
	 * Two-argument form: explicit material.
	 * One-argument form: defaults to Material.plants.
	 */
	constructor(id, material = Material.plants) {
		super(id, material);
		this.setTickRandomly(true);
		const r = 0.2;
		this.setBlockBounds(0.5 - r, 0.0, 0.5 - r, 0.5 + r, r * 3.0, 0.5 + r);
		this.setCreativeTab(CreativeTabs.tabDecorations);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 1; }

	getCollisionBoundingBoxFromPool(world, x, y, z) { return null; }

	// -------------------------------------------------------------------------
	// Placement / survival
	// -------------------------------------------------------------------------

	canPlaceBlockAt(world, x, y, z) {
		return super.canPlaceBlockAt(world, x, y, z)
			&& this.canThisPlantGrowOnThisBlockID(world.getBlockId(x, y - 1, z));
	}

	/** Returns true if the block below can support this plant */
	canThisPlantGrowOnThisBlockID(blockId) {
		return blockId === Block.grass.blockID
			|| blockId === Block.dirt.blockID
			|| blockId === Block.tilledField.blockID;
	}

	canBlockStay(world, x, y, z) {
		return (world.getFullBlockLightValue(x, y, z) >= 8 || world.canBlockSeeTheSky(x, y, z))
			&& this.canThisPlantGrowOnThisBlockID(world.getBlockId(x, y - 1, z));
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		super.onNeighborBlockChange(world, x, y, z, neighborId);
		this.checkFlowerChange(world, x, y, z);
	}

	updateTick(world, x, y, z, rng) {
		this.checkFlowerChange(world, x, y, z);
	}

	/** Drops and removes the plant if it can no longer survive at this position */
	checkFlowerChange(world, x, y, z) {
		if (!this.canBlockStay(world, x, y, z)) {
			this.dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
			world.setBlockToAir(x, y, z);
		}
	}
}