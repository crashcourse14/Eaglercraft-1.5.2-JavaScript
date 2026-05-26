// BlockCrops.js
import { BlockFlower } from './BlockFlower.js';
import { Block } from './Block.js';
import { Item } from './Item.js';
import { MathHelper } from './MathHelper.js';
import { ItemStack } from './ItemStack.js';

export class BlockCrops extends BlockFlower {
	#iconArray = null;

	constructor(id) {
		super(id);
		this.setTickRandomly(true);
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.25, 1.0);
		this.setCreativeTab(null);
		this.setHardness(0.0);
		this.setStepSound(Block.soundGrassFootstep);
		this.disableStats();
	}

	getRenderType() { return 6; }

	idPicked(world, x, y, z) { return this.getSeedItem(); }

	getIcon(side, meta) {
		if (meta < 0 || meta > 7) meta = 7;
		return this.#iconArray[meta];
	}

	registerIcons(reg) {
		this.#iconArray = Array.from(
			{ length: 8 },
			(_, i) => reg.registerIcon(`crops_${i}`),
		);
	}

	// -------------------------------------------------------------------------
	// Growth substrate
	// -------------------------------------------------------------------------

	canThisPlantGrowOnThisBlockID(blockId) {
		return blockId === Block.tilledField.blockID;
	}

	// -------------------------------------------------------------------------
	// Growth ticking
	// -------------------------------------------------------------------------

	/**
	 * Advances growth by one stage when light is sufficient (≥9) and the
	 * random growth roll succeeds. Maximum stage is 7 (fully grown).
	 */
	updateTick(world, x, y, z, rng) {
		super.updateTick(world, x, y, z, rng);

		if (world.getBlockLightValue(x, y + 1, z) >= 9) {
			let meta = world.getBlockMetadata(x, y, z);
			if (meta < 7) {
				const rate = this.#getGrowthRate(world, x, y, z);
				if (rng.nextInt(Math.trunc(25.0 / rate) + 1) === 0) {
					world.setBlockMetadataWithNotify(x, y, z, meta + 1, 2);
				}
			}
		}
	}

	/**
	 * Applies bonemeal: advances growth by 2–5 random stages, capped at 7.
	 */
	fertilize(world, x, y, z) {
		let meta = world.getBlockMetadata(x, y, z)
			+ MathHelper.getRandomIntegerInRange(world.rand, 2, 5);
		if (meta > 7) meta = 7;
		world.setBlockMetadataWithNotify(x, y, z, meta, 2);
	}

	// -------------------------------------------------------------------------
	// Drops
	// -------------------------------------------------------------------------

	/** Fully-grown crops drop the produce item; immature crops drop seeds */
	idDropped(meta, rng, fortune) {
		return meta === 7 ? this.getCropItem() : this.getSeedItem();
	}

	quantityDropped(rng) { return 1; }

	// -------------------------------------------------------------------------
	// Overridable crop identity
	// -------------------------------------------------------------------------

	/** Returns the item ID of the seed for this crop (default: wheat seeds) */
	getSeedItem() { return Item.seeds.itemID; }

	/** Returns the item ID of the produce for this crop (default: wheat) */
	getCropItem() { return Item.wheat.itemID; }

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Calculates the growth rate multiplier for this crop based on:
	 * - Hydration of the farmland below (dry = 1×, wet = 3×)
	 * - Nearby farmland in a 3×3 area (contributes ¼ of its value)
	 * - Adjacent crops: rows are rewarded; diagonals or mixed axes halve the rate.
	 */
	#getGrowthRate(world, x, y, z) {
		let rate = 1.0;
		const id = this.blockID;

		const W  = world.getBlockId(x - 1, y, z);
		const E  = world.getBlockId(x + 1, y, z);
		const N  = world.getBlockId(x,     y, z - 1);
		const S  = world.getBlockId(x,     y, z + 1);
		const NW = world.getBlockId(x - 1, y, z - 1);
		const NE = world.getBlockId(x + 1, y, z - 1);
		const SE = world.getBlockId(x + 1, y, z + 1);
		const SW = world.getBlockId(x - 1, y, z + 1);

		const hasEW   = W === id || E === id;
		const hasNS   = N === id || S === id;
		const hasDiag = NW === id || NE === id || SE === id || SW === id;

		// Sum up farmland contributions in 3×3 area
		for (let bx = x - 1; bx <= x + 1; ++bx) {
			for (let bz = z - 1; bz <= z + 1; ++bz) {
				const belowId = world.getBlockId(bx, y - 1, bz);
				let contribution = 0.0;

				if (belowId === Block.tilledField.blockID) {
					contribution = 1.0;
					if (world.getBlockMetadata(bx, y - 1, bz) > 0) {
						contribution = 3.0; // hydrated farmland
					}
				}

				if (bx !== x || bz !== z) {
					contribution /= 4.0; // neighbour tiles contribute ¼
				}

				rate += contribution;
			}
		}

		// Penalise diagonal crops or mixed-axis rows
		if (hasDiag || (hasEW && hasNS)) {
			rate /= 2.0;
		}

		return rate;
	}
}