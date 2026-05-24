// BlockCocoa.js
import { BlockDirectional } from './BlockDirectional.js';
import { Material } from './Material.js';
import { Block } from './Block.js';
import { BlockLog } from './BlockLog.js';
import { Direction } from './Direction.js';
import { MathHelper } from './MathHelper.js';
import { Item } from './Item.js';
import { ItemStack } from './ItemStack.js';

export class BlockCocoa extends BlockDirectional {
	static cocoaIcons = ['cocoa_0', 'cocoa_1', 'cocoa_2'];
	#iconArray = null;

	constructor(id) {
		super(id, Material.plants);
		this.setTickRandomly(true);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 28; }

	idPicked(world, x, y, z)         { return Item.dyePowder.itemID; }
	getDamageValue(world, x, y, z)   { return 3; }

	/** Always returns the fully-grown icon; stage-specific icon via getIconForStage() */
	getIcon(side, meta) { return this.#iconArray[2]; }

	/**
	 * Returns the icon for the given growth stage (0, 1, 2), clamping to valid range.
	 * (formerly func_94468_i_)
	 */
	getIconForStage(stage) {
		if (stage < 0 || stage >= this.#iconArray.length) {
			stage = this.#iconArray.length - 1;
		}
		return this.#iconArray[stage];
	}

	registerIcons(reg) {
		this.#iconArray = BlockCocoa.cocoaIcons.map(name => reg.registerIcon(name));
	}

	// -------------------------------------------------------------------------
	// Growth
	// -------------------------------------------------------------------------

	/**
	 * Each tick has a 1-in-5 chance of advancing the growth stage.
	 * Drops and removes the block if it can no longer stay attached.
	 */
	updateTick(world, x, y, z, rng) {
		if (!this.canBlockStay(world, x, y, z)) {
			this.dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
			world.setBlockToAir(x, y, z);
		} else if (world.rand.nextInt(5) === 0) {
			const meta  = world.getBlockMetadata(x, y, z);
			let stage   = BlockCocoa.getGrowthStage(meta);
			if (stage < 2) {
				++stage;
				world.setBlockMetadataWithNotify(
					x, y, z,
					(stage << 2) | BlockDirectional.getDirection(meta),
					2,
				);
			}
		}
	}

	/**
	 * Cocoa pods must be attached to a jungle log (wood type 3).
	 */
	canBlockStay(world, x, y, z) {
		const meta  = world.getBlockMetadata(x, y, z);
		const dir   = BlockDirectional.getDirection(meta);
		const lx    = x + Direction.offsetX[dir];
		const lz    = z + Direction.offsetZ[dir];
		const below = world.getBlockId(lx, y, lz);
		return below === Block.wood.blockID
			&& BlockLog.limitToValidMetadata(world.getBlockMetadata(lx, y, lz)) === 3;
	}

	// -------------------------------------------------------------------------
	// Bounds
	// -------------------------------------------------------------------------

	getCollisionBoundingBoxFromPool(world, x, y, z) {
		this.setBlockBoundsBasedOnState(world, x, y, z);
		return super.getCollisionBoundingBoxFromPool(world, x, y, z);
	}

	getSelectedBoundingBoxFromPool(world, x, y, z) {
		this.setBlockBoundsBasedOnState(world, x, y, z);
		return super.getSelectedBoundingBoxFromPool(world, x, y, z);
	}

	/**
	 * Computes the bounding box based on facing direction and growth stage.
	 * The pod grows outward from its attachment face as it matures.
	 */
	setBlockBoundsBasedOnState(access, x, y, z) {
		const meta  = access.getBlockMetadata(x, y, z);
		const dir   = BlockDirectional.getDirection(meta);
		const stage = BlockCocoa.getGrowthStage(meta);

		const w = 4 + stage * 2;      // width in 1/16ths
		const h = 5 + stage * 2;      // height in 1/16ths
		const hw = w / 2.0 / 16.0;   // half-width in block units

		const top    = 0.75;
		const bottom = (12.0 - h) / 16.0;

		switch (dir) {
			case 0: // South face
				this.setBlockBounds(
					0.5 - hw,         bottom, (15.0 - w) / 16.0,
					0.5 + hw,         top,    0.9375,
				);
				break;
			case 1: // West face
				this.setBlockBounds(
					0.0625,           bottom, 0.5 - hw,
					(1.0 + w) / 16.0, top,   0.5 + hw,
				);
				break;
			case 2: // North face
				this.setBlockBounds(
					0.5 - hw,         bottom, 0.0625,
					0.5 + hw,         top,    (1.0 + w) / 16.0,
				);
				break;
			case 3: // East face
				this.setBlockBounds(
					(15.0 - w) / 16.0, bottom, 0.5 - hw,
					0.9375,            top,    0.5 + hw,
				);
				break;
		}
	}

	// -------------------------------------------------------------------------
	// Placement
	// -------------------------------------------------------------------------

	onBlockPlacedBy(world, x, y, z, entity, stack) {
		const dir = (MathHelper.floor_double(entity.rotationYaw * 4.0 / 360.0 + 0.5) & 3) % 4;
		world.setBlockMetadataWithNotify(x, y, z, dir, 2);
	}

	onBlockPlaced(world, x, y, z, side, hitX, hitY, hitZ, meta) {
		if (side === 0 || side === 1) side = 2;
		return Direction.rotateOpposite[Direction.facingToDirection[side]];
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		if (!this.canBlockStay(world, x, y, z)) {
			this.dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
			world.setBlockToAir(x, y, z);
		}
	}

	// -------------------------------------------------------------------------
	// Drops
	// -------------------------------------------------------------------------

	/**
	 * Fully-grown pods (stage 2) drop 3 cocoa beans; earlier stages drop 1.
	 * Drops cocoa dye (dye ID 3 = cocoa beans) in all cases.
	 */
	dropBlockAsItemWithChance(world, x, y, z, meta, chance, fortune) {
		const stage = BlockCocoa.getGrowthStage(meta);
		const count = stage >= 2 ? 3 : 1;
		for (let i = 0; i < count; ++i) {
			this.dropBlockAsItem_do(world, x, y, z, new ItemStack(Item.dyePowder, 1, 3));
		}
	}

	// -------------------------------------------------------------------------
	// Static helpers
	// -------------------------------------------------------------------------

	/**
	 * Extracts the growth stage (0–2) from block metadata.
	 * Stage is stored in bits 2–3 (metadata >> 2, masked to 2 bits).
	 * (formerly func_72219_c)
	 */
	static getGrowthStage(meta) {
		return (meta & 12) >> 2;
	}
}