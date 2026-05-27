// BlockFire.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { WorldProviderEnd } from './WorldProviderEnd.js';

export class BlockFire extends Block {
	/** How fast fire spreads from this block type to neighbours */
	#chanceToEncourageFire = new Int32Array(256);
	/** How easily this block type catches fire */
	#abilityToCatchFire    = new Int32Array(256);
	#iconArray             = null;

	constructor(id) {
		super(id, Material.fire);
		this.setTickRandomly(true);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	isCollidable()        { return false; }
	func_82506_l()        { return false; }
	getRenderType()       { return 3; }
	tickRate(world)       { return 30; }
	quantityDropped(rng)  { return 0; }
	getCollisionBoundingBoxFromPool(world, x, y, z) { return null; }

	getIcon(side, meta)   { return this.#iconArray[0]; }
	getIconForIndex(i)    { return this.#iconArray[i]; } // formerly func_94438_c

	registerIcons(reg) {
		this.#iconArray = [
			reg.registerIcon('fire_0'),
			reg.registerIcon('fire_1'),
		];
	}

	// -------------------------------------------------------------------------
	// Burn rate table
	// -------------------------------------------------------------------------

	initializeBlock() {
		this.#setBurnRate(Block.planks.blockID,        5,  20);
		this.#setBurnRate(Block.woodDoubleSlab.blockID,5,  20);
		this.#setBurnRate(Block.woodSingleSlab.blockID,5,  20);
		this.#setBurnRate(Block.fence.blockID,         5,  20);
		this.#setBurnRate(Block.stairsWoodOak.blockID, 5,  20);
		this.#setBurnRate(Block.stairsWoodBirch.blockID,5, 20);
		this.#setBurnRate(Block.stairsWoodSpruce.blockID,5,20);
		this.#setBurnRate(Block.stairsWoodJungle.blockID,5,20);
		this.#setBurnRate(Block.wood.blockID,          5,   5);
		this.#setBurnRate(Block.leaves.blockID,        30,  60);
		this.#setBurnRate(Block.bookShelf.blockID,     30,  20);
		this.#setBurnRate(Block.tnt.blockID,           15, 100);
		this.#setBurnRate(Block.tallGrass.blockID,     60, 100);
		this.#setBurnRate(Block.cloth.blockID,         30,  60);
		this.#setBurnRate(Block.vine.blockID,          15, 100);
	}

	#setBurnRate(blockId, encourage, catchChance) {
		this.#chanceToEncourageFire[blockId] = encourage;
		this.#abilityToCatchFire[blockId]    = catchChance;
	}

	// -------------------------------------------------------------------------
	// Fire spread queries
	// -------------------------------------------------------------------------

	canBlockCatchFire(access, x, y, z) {
		return this.#chanceToEncourageFire[access.getBlockId(x, y, z)] > 0;
	}

	/** Returns the larger of par5 or the encourage-fire chance of the block at (x,y,z) */
	getChanceToEncourageFire(world, x, y, z, current) {
		const chance = this.#chanceToEncourageFire[world.getBlockId(x, y, z)];
		return chance > current ? chance : current;
	}

	#canNeighborBurn(world, x, y, z) {
		return this.canBlockCatchFire(world, x + 1, y, z)
			|| this.canBlockCatchFire(world, x - 1, y, z)
			|| this.canBlockCatchFire(world, x, y - 1, z)
			|| this.canBlockCatchFire(world, x, y + 1, z)
			|| this.canBlockCatchFire(world, x, y, z - 1)
			|| this.canBlockCatchFire(world, x, y, z + 1);
	}

	/**
	 * Returns the maximum encourage-fire value of all six neighbours of (x,y,z),
	 * or 0 if the block at (x,y,z) is not air.
	 */
	#getChanceOfNeighborsEncouragingFire(world, x, y, z) {
		if (!world.isAirBlock(x, y, z)) return 0;
		let max = 0;
		max = this.getChanceToEncourageFire(world, x + 1, y, z, max);
		max = this.getChanceToEncourageFire(world, x - 1, y, z, max);
		max = this.getChanceToEncourageFire(world, x, y - 1, z, max);
		max = this.getChanceToEncourageFire(world, x, y + 1, z, max);
		max = this.getChanceToEncourageFire(world, x, y, z - 1, max);
		max = this.getChanceToEncourageFire(world, x, y, z + 1, max);
		return max;
	}

	// -------------------------------------------------------------------------
	// Placement
	// -------------------------------------------------------------------------

	canPlaceBlockAt(world, x, y, z) {
		return world.doesBlockHaveSolidTopSurface(x, y - 1, z)
			|| this.#canNeighborBurn(world, x, y, z);
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		if (!world.doesBlockHaveSolidTopSurface(x, y - 1, z) && !this.#canNeighborBurn(world, x, y, z)) {
			world.setBlockToAir(x, y, z);
		}
	}

	onBlockAdded(world, x, y, z) {
		// Attempt to create a Nether portal if fire is placed on obsidian in the overworld
		if (world.provider.dimensionId === 0
				&& world.getBlockId(x, y - 1, z) === Block.obsidian.blockID
				&& Block.portal.tryToCreatePortal(world, x, y, z)) {
			return;
		}

		if (!world.doesBlockHaveSolidTopSurface(x, y - 1, z) && !this.#canNeighborBurn(world, x, y, z)) {
			world.setBlockToAir(x, y, z);
		} else {
			world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world) + world.rand.nextInt(10));
		}
	}

	// -------------------------------------------------------------------------
	// Ticking
	// -------------------------------------------------------------------------

	updateTick(world, x, y, z, rng) {
		if (!world.getGameRules().getGameRuleBooleanValue('doFireTick')) return;

		// Permanent fire on netherrack or bedrock in the End
		const onNetherrack = world.getBlockId(x, y - 1, z) === Block.netherrack.blockID;
		const permanent    = onNetherrack
			|| (world.provider instanceof WorldProviderEnd
				&& world.getBlockId(x, y - 1, z) === Block.bedrock.blockID);

		if (!this.canPlaceBlockAt(world, x, y, z)) {
			world.setBlockToAir(x, y, z);
			return;
		}

		// Rain extinguishes non-permanent fire if any adjacent block is exposed
		if (!permanent && world.isRaining()
				&& (world.canLightningStrikeAt(x,     y, z)
				||  world.canLightningStrikeAt(x - 1, y, z)
				||  world.canLightningStrikeAt(x + 1, y, z)
				||  world.canLightningStrikeAt(x,     y, z - 1)
				||  world.canLightningStrikeAt(x,     y, z + 1))) {
			world.setBlockToAir(x, y, z);
			return;
		}

		let meta = world.getBlockMetadata(x, y, z);

		// Age the fire
		if (meta < 15) {
			world.setBlockMetadataWithNotify(x, y, z, meta + Math.trunc(rng.nextInt(3) / 2), 4);
		}

		world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world) + rng.nextInt(10));

		if (!permanent && !this.#canNeighborBurn(world, x, y, z)) {
			// Fire with no fuel below and old enough → extinguish
			if (!world.doesBlockHaveSolidTopSurface(x, y - 1, z) || meta > 3) {
				world.setBlockToAir(x, y, z);
			}
			return;
		}

		// Permanently-fuelled fire can still self-extinguish at max age
		if (!permanent && !this.canBlockCatchFire(world, x, y - 1, z) && meta === 15 && rng.nextInt(4) === 0) {
			world.setBlockToAir(x, y, z);
			return;
		}

		// Spread fire to adjacent blocks
		const humid = world.isBlockHighHumidity(x, y, z);
		const penalty = humid ? -50 : 0;

		this.#tryToCatchBlockOnFire(world, x + 1, y,     z,     300 + penalty, rng, meta);
		this.#tryToCatchBlockOnFire(world, x - 1, y,     z,     300 + penalty, rng, meta);
		this.#tryToCatchBlockOnFire(world, x,     y - 1, z,     250 + penalty, rng, meta);
		this.#tryToCatchBlockOnFire(world, x,     y + 1, z,     250 + penalty, rng, meta);
		this.#tryToCatchBlockOnFire(world, x,     y,     z - 1, 300 + penalty, rng, meta);
		this.#tryToCatchBlockOnFire(world, x,     y,     z + 1, 300 + penalty, rng, meta);

		// Attempt to ignite blocks in a 3×6×3 volume above
		for (let bx = x - 1; bx <= x + 1; ++bx) {
			for (let bz = z - 1; bz <= z + 1; ++bz) {
				for (let by = y - 1; by <= y + 4; ++by) {
					if (bx === x && by === y && bz === z) continue;

					// Higher blocks are harder to ignite
					let threshold = 100;
					if (by > y + 1) threshold += (by - (y + 1)) * 100;

					const encourage = this.#getChanceOfNeighborsEncouragingFire(world, bx, by, bz);
					if (encourage <= 0) continue;

					let igniteChance = (encourage + 40 + world.difficultySetting * 7) / (meta + 30);
					if (humid) igniteChance = Math.trunc(igniteChance / 2);

					if (igniteChance > 0
							&& rng.nextInt(threshold) <= igniteChance
							&& (!world.isRaining() || !world.canLightningStrikeAt(bx, by, bz))
							&& !world.canLightningStrikeAt(bx - 1, by, bz)
							&& !world.canLightningStrikeAt(bx + 1, by, bz)
							&& !world.canLightningStrikeAt(bx, by, bz - 1)
							&& !world.canLightningStrikeAt(bx, by, bz + 1)) {
						const newAge = Math.min(meta + Math.trunc(rng.nextInt(5) / 4), 15);
						world.setBlock(bx, by, bz, this.blockID, newAge, 3);
					}
				}
			}
		}
	}

	// -------------------------------------------------------------------------
	// Display tick — particles and sounds
	// -------------------------------------------------------------------------

	randomDisplayTick(world, x, y, z, rng) {
		if (rng.nextInt(24) === 0) {
			world.playSound(
				x + 0.5, y + 0.5, z + 0.5,
				'fire.fire', 1.0 + rng.nextFloat(), rng.nextFloat() * 0.7 + 0.3, false,
			);
		}

		const fire = Block.fire;

		// If not burning on a solid/flammable base, emit wall-hugging smoke
		if (!world.doesBlockHaveSolidTopSurface(x, y - 1, z) && !fire.canBlockCatchFire(world, x, y - 1, z)) {
			// Each side: 2 smoke particles skimming the flammable face
			const sides = [
				{ check: () => fire.canBlockCatchFire(world, x - 1, y, z), px: () => x + rng.nextFloat() * 0.1,           py: () => y + rng.nextFloat(), pz: () => z + rng.nextFloat() },
				{ check: () => fire.canBlockCatchFire(world, x + 1, y, z), px: () => x + 1 - rng.nextFloat() * 0.1,       py: () => y + rng.nextFloat(), pz: () => z + rng.nextFloat() },
				{ check: () => fire.canBlockCatchFire(world, x, y, z - 1), px: () => x + rng.nextFloat(),                 py: () => y + rng.nextFloat(), pz: () => z + rng.nextFloat() * 0.1 },
				{ check: () => fire.canBlockCatchFire(world, x, y, z + 1), px: () => x + rng.nextFloat(),                 py: () => y + rng.nextFloat(), pz: () => z + 1 - rng.nextFloat() * 0.1 },
				{ check: () => fire.canBlockCatchFire(world, x, y + 1, z), px: () => x + rng.nextFloat(),                 py: () => y + 1 - rng.nextFloat() * 0.1, pz: () => z + rng.nextFloat() },
			];

			for (const { check, px, py, pz } of sides) {
				if (!check()) continue;
				for (let i = 0; i < 2; ++i) {
					world.spawnParticle('largesmoke', px(), py(), pz(), 0.0, 0.0, 0.0);
				}
			}
		} else {
			// Standard floor fire: 3 smoke particles rising from the surface
			for (let i = 0; i < 3; ++i) {
				world.spawnParticle(
					'largesmoke',
					x + rng.nextFloat(),
					y + rng.nextFloat() * 0.5 + 0.5,
					z + rng.nextFloat(),
					0.0, 0.0, 0.0,
				);
			}
		}
	}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Attempts to catch a neighbour block on fire or destroy it.
	 * TNT is detonated if it catches fire.
	 */
	#tryToCatchBlockOnFire(world, x, y, z, spreadChance, rng, fireAge) {
		const catchChance = this.#abilityToCatchFire[world.getBlockId(x, y, z)];
		if (rng.nextInt(spreadChance) >= catchChance) return;

		const isTNT = world.getBlockId(x, y, z) === Block.tnt.blockID;

		if (rng.nextInt(fireAge + 10) < 5 && !world.canLightningStrikeAt(x, y, z)) {
			const newAge = Math.min(fireAge + Math.trunc(rng.nextInt(5) / 4), 15);
			world.setBlock(x, y, z, this.blockID, newAge, 3);
		} else {
			world.setBlockToAir(x, y, z);
		}

		if (isTNT) {
			Block.tnt.onBlockDestroyedByPlayer(world, x, y, z, 1);
		}
	}
}