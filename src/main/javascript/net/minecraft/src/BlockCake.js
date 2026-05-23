// BlockCake.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { Item } from './Item.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';

export class BlockCake extends Block {
	#cakeTopIcon    = null;
	#cakeBottomIcon = null;
	/** Inner (cut) face shown on the bitten side of the cake */
	#cakeInnerIcon  = null;

	constructor(id) {
		super(id, Material.cake);
		this.setTickRandomly(true);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }

	quantityDropped(rng)          { return 0; }
	idDropped(meta, rng, fortune) { return 0; }
	idPicked(world, x, y, z)     { return Item.cake.itemID; }

	registerIcons(reg) {
		this.blockIcon      = reg.registerIcon('cake_side');
		this.#cakeInnerIcon  = reg.registerIcon('cake_inner');
		this.#cakeTopIcon    = reg.registerIcon('cake_top');
		this.#cakeBottomIcon = reg.registerIcon('cake_bottom');
	}

	/**
	 * Top → cake_top, bottom → cake_bottom.
	 * West face (side 4) shows the inner texture once any slices have been eaten.
	 * All other sides show the normal cake_side texture.
	 */
	getIcon(side, meta) {
		if (side === 1) return this.#cakeTopIcon;
		if (side === 0) return this.#cakeBottomIcon;
		if (meta > 0 && side === 4) return this.#cakeInnerIcon;
		return this.blockIcon;
	}

	// -------------------------------------------------------------------------
	// Bounds helpers
	// -------------------------------------------------------------------------

	/** Computes the left-edge X offset from the number of slices eaten (0–5) */
	#leftEdge(meta) {
		return (1 + meta * 2) / 16.0;
	}

	setBlockBoundsBasedOnState(access, x, y, z) {
		const meta  = access.getBlockMetadata(x, y, z);
		const left  = this.#leftEdge(meta);
		const m     = 0.0625;
		const halfH = 0.5;
		this.setBlockBounds(left, 0.0, m, 1.0 - m, halfH, 1.0 - m);
	}

	setBlockBoundsForItemRender() {
		const m = 0.0625;
		this.setBlockBounds(m, 0.0, m, 1.0 - m, 0.5, 1.0 - m);
	}

	getCollisionBoundingBoxFromPool(world, x, y, z) {
		const meta  = world.getBlockMetadata(x, y, z);
		const left  = this.#leftEdge(meta);
		const m     = 0.0625;
		return AxisAlignedBB.getAABBPool().getAABB(
			x + left,     y,           z + m,
			x + 1 - m,   y + 0.5 - m, z + 1 - m,
		);
	}

	getSelectedBoundingBoxFromPool(world, x, y, z) {
		const meta  = world.getBlockMetadata(x, y, z);
		const left  = this.#leftEdge(meta);
		const m     = 0.0625;
		return AxisAlignedBB.getAABBPool().getAABB(
			x + left,   y,     z + m,
			x + 1 - m, y + 0.5, z + 1 - m,
		);
	}

	// -------------------------------------------------------------------------
	// Placement / survival
	// -------------------------------------------------------------------------

	canPlaceBlockAt(world, x, y, z) {
		return super.canPlaceBlockAt(world, x, y, z) && this.canBlockStay(world, x, y, z);
	}

	/** Cake needs a solid block directly beneath it */
	canBlockStay(world, x, y, z) {
		return world.getBlockMaterial(x, y - 1, z).isSolid();
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		if (!this.canBlockStay(world, x, y, z)) {
			world.setBlockToAir(x, y, z);
		}
	}

	// -------------------------------------------------------------------------
	// Eating
	// -------------------------------------------------------------------------

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) {
		this.#eatCakeSlice(world, x, y, z, player);
		return true;
	}

	onBlockClicked(world, x, y, z, player) {
		this.#eatCakeSlice(world, x, y, z, player);
	}

	/**
	 * Restores 2 hunger (+ 0.1 saturation) and advances the slice counter.
	 * Removes the block once all 6 slices have been eaten.
	 */
	#eatCakeSlice(world, x, y, z, player) {
		if (!player.canEat(false)) return;

		player.getFoodStats().addStats(2, 0.1);
		const nextMeta = world.getBlockMetadata(x, y, z) + 1;

		if (nextMeta >= 6) {
			world.setBlockToAir(x, y, z);
		} else {
			world.setBlockMetadataWithNotify(x, y, z, nextMeta, 2);
		}
	}
}