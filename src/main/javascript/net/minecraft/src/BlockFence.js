// BlockFence.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';

export class BlockFence extends Block {
	/** Texture name for this fence type */
	#textureName;

	constructor(id, textureName, material) {
		super(id, material);
		this.#textureName = textureName;
		this.setCreativeTab(CreativeTabs.tabDecorations);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 11; }
	getBlocksMovement(access, x, y, z) { return false; }
	shouldSideBeRendered(access, x, y, z, side) { return true; }

	registerIcons(reg) {
		this.blockIcon = reg.registerIcon(this.#textureName);
	}

	// -------------------------------------------------------------------------
	// Connection helpers
	// -------------------------------------------------------------------------

	/**
	 * A fence connects to another fence, a fence gate, or any solid opaque
	 * normal-cube block that isn't a pumpkin.
	 */
	canConnectFenceTo(access, x, y, z) {
		const id = access.getBlockId(x, y, z);
		if (id === this.blockID || id === Block.fenceGate.blockID) return true;
		const block = Block.blocksList[id];
		return block !== null
			&& block.blockMaterial.isOpaque()
			&& block.renderAsNormalBlock()
			&& block.blockMaterial !== Material.pumpkin;
	}

	static isIdAFence(id) {
		return id === Block.fence.blockID || id === Block.netherFence.blockID;
	}

	// -------------------------------------------------------------------------
	// Bounds
	// -------------------------------------------------------------------------

	/**
	 * Sets visual bounds, expanding each side that connects to a neighbour.
	 * X range expands west (W) and east (E); Z range expands north (N) and south (S).
	 */
	setBlockBoundsBasedOnState(access, x, y, z) {
		const N = this.canConnectFenceTo(access, x,     y, z - 1);
		const S = this.canConnectFenceTo(access, x,     y, z + 1);
		const W = this.canConnectFenceTo(access, x - 1, y, z);
		const E = this.canConnectFenceTo(access, x + 1, y, z);

		const x0 = W ? 0.0 : 0.375;
		const x1 = E ? 1.0 : 0.625;
		const z0 = N ? 0.0 : 0.375;
		const z1 = S ? 1.0 : 0.625;

		this.setBlockBounds(x0, 0.0, z0, x1, 1.0, z1);
	}

	/**
	 * Adds up to three collision boxes:
	 * 1. N–S bar (if connecting north or south) — 1.5 blocks tall.
	 * 2. E–W bar (if connecting east, west, or isolated) — 1.5 blocks tall.
	 * 3. Combined base bounds at 1.0 block tall (for selection/stepping).
	 *
	 * The extra height (1.5) prevents entities from jumping over the fence.
	 */
	addCollisionBoxesToList(world, x, y, z, mask, list, entity) {
		const N = this.canConnectFenceTo(world, x,     y, z - 1);
		const S = this.canConnectFenceTo(world, x,     y, z + 1);
		const W = this.canConnectFenceTo(world, x - 1, y, z);
		const E = this.canConnectFenceTo(world, x + 1, y, z);

		// N–S bar
		if (N || S) {
			this.setBlockBounds(0.375, 0.0, N ? 0.0 : 0.375, 0.625, 1.5, S ? 1.0 : 0.625);
			super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);
		}

		// E–W bar (also used when isolated — no connections at all)
		if (W || E || (!N && !S)) {
			this.setBlockBounds(W ? 0.0 : 0.375, 0.0, 0.375, E ? 1.0 : 0.625, 1.5, 0.625);
			super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);
		}

		// Restore combined base bounds (used for standing/stepping height)
		const x0 = W ? 0.0 : 0.375;
		const x1 = E ? 1.0 : 0.625;
		const z0 = N ? 0.0 : 0.375;
		const z1 = S ? 1.0 : 0.625;
		this.setBlockBounds(x0, 0.0, z0, x1, 1.0, z1);
	}
}