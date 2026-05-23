// BlockButton.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';
import { EntityArrow } from './EntityArrow.js';

export class BlockButton extends Block {
	/** Whether this button responds to arrows (wooden buttons only) */
	#sensible;

	constructor(id, sensible) {
		super(id, Material.circuits);
		this.setTickRandomly(true);
		this.setCreativeTab(CreativeTabs.tabRedstone);
		this.#sensible = sensible;
	}

	// -------------------------------------------------------------------------
	// Block property overrides
	// -------------------------------------------------------------------------

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	canProvidePower()     { return true; }

	getCollisionBoundingBoxFromPool(world, x, y, z) { return null; }

	/** Wooden buttons stay pressed longer (30 ticks) to allow arrows to activate them */
	tickRate(world) { return this.#sensible ? 30 : 20; }

	// -------------------------------------------------------------------------
	// Placement
	// -------------------------------------------------------------------------

	canPlaceBlockOnSide(world, x, y, z, side) {
		if (side === 2 && world.isBlockNormalCube(x, y, z + 1)) return true;
		if (side === 3 && world.isBlockNormalCube(x, y, z - 1)) return true;
		if (side === 4 && world.isBlockNormalCube(x + 1, y, z)) return true;
		if (side === 5 && world.isBlockNormalCube(x - 1, y, z)) return true;
		return false;
	}

	canPlaceBlockAt(world, x, y, z) {
		return world.isBlockNormalCube(x - 1, y, z)
			|| world.isBlockNormalCube(x + 1, y, z)
			|| world.isBlockNormalCube(x, y, z - 1)
			|| world.isBlockNormalCube(x, y, z + 1);
	}

	onBlockPlaced(world, x, y, z, side, hitX, hitY, hitZ, meta) {
		const existingMeta = world.getBlockMetadata(x, y, z);
		const pressedBit   = existingMeta & 8;
		let orientation;

		if      (side === 2 && world.isBlockNormalCube(x, y, z + 1)) orientation = 4;
		else if (side === 3 && world.isBlockNormalCube(x, y, z - 1)) orientation = 3;
		else if (side === 4 && world.isBlockNormalCube(x + 1, y, z)) orientation = 2;
		else if (side === 5 && world.isBlockNormalCube(x - 1, y, z)) orientation = 1;
		else orientation = this.#getOrientation(world, x, y, z);

		return orientation + pressedBit;
	}

	// -------------------------------------------------------------------------
	// Bounds
	// -------------------------------------------------------------------------

	setBlockBoundsBasedOnState(access, x, y, z) {
		this.#applyBoundsForMeta(access.getBlockMetadata(x, y, z));
	}

	setBlockBoundsForItemRender() {
		this.setBlockBounds(0.3125, 0.375, 0.375, 0.6875, 0.625, 0.625);
	}

	// -------------------------------------------------------------------------
	// Activation / ticking
	// -------------------------------------------------------------------------

	onBlockClicked(world, x, y, z, player) {}

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) {
		const meta      = world.getBlockMetadata(x, y, z);
		const facing    = meta & 7;
		const pressedBit = 8 - (meta & 8); // 8 if unpressed, 0 if already pressed

		if (pressedBit === 0) return true; // already pressed, ignore

		world.setBlockMetadataWithNotify(x, y, z, facing + pressedBit, 3);
		world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
		world.playSoundEffect(x + 0.5, y + 0.5, z + 0.5, 'random.click', 0.3, 0.6);
		this.#notifyNeighbours(world, x, y, z, facing);
		world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world));
		return true;
	}

	breakBlock(world, x, y, z, id, meta) {
		if ((meta & 8) > 0) {
			this.#notifyNeighbours(world, x, y, z, meta & 7);
		}
		super.breakBlock(world, x, y, z, id, meta);
	}

	// -------------------------------------------------------------------------
	// Redstone power
	// -------------------------------------------------------------------------

	isProvidingWeakPower(access, x, y, z, side) {
		return (access.getBlockMetadata(x, y, z) & 8) > 0 ? 15 : 0;
	}

	isProvidingStrongPower(access, x, y, z, side) {
		const meta = access.getBlockMetadata(x, y, z);
		if ((meta & 8) === 0) return 0;

		const facing = meta & 7;
		// Strong power is only output through the face the button is mounted on
		if (facing === 5 && side === 1) return 15;
		if (facing === 4 && side === 2) return 15;
		if (facing === 3 && side === 3) return 15;
		if (facing === 2 && side === 4) return 15;
		if (facing === 1 && side === 5) return 15;
		return 0;
	}

	// -------------------------------------------------------------------------
	// Neighbour logic
	// -------------------------------------------------------------------------

	onNeighborBlockChange(world, x, y, z, neighborId) {
		if (!this.#dropIfDetached(world, x, y, z)) return;

		const facing = world.getBlockMetadata(x, y, z) & 7;
		const detached =
			(facing === 1 && !world.isBlockNormalCube(x - 1, y, z)) ||
			(facing === 2 && !world.isBlockNormalCube(x + 1, y, z)) ||
			(facing === 3 && !world.isBlockNormalCube(x, y, z - 1)) ||
			(facing === 4 && !world.isBlockNormalCube(x, y, z + 1));

		if (detached) {
			this.dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
			world.setBlockToAir(x, y, z);
		}
	}

	// -------------------------------------------------------------------------
	// Arrow detection (wooden buttons)
	// -------------------------------------------------------------------------

	/**
	 * Checks for arrows inside the button's bounding box and toggles the pressed
	 * state accordingly. Schedules a tick-off update while an arrow is present.
	 * (formerly func_82535_o)
	 */
	checkArrowCollision(world, x, y, z) {
		const meta    = world.getBlockMetadata(x, y, z);
		const facing  = meta & 7;
		const pressed = (meta & 8) !== 0;

		this.#applyBoundsForMeta(meta);

		const arrows = world.getEntitiesWithinAABB(
			EntityArrow,
			AxisAlignedBB.getAABBPool().getAABB(
				x + this.minX, y + this.minY, z + this.minZ,
				x + this.maxX, y + this.maxY, z + this.maxZ,
			),
		);
		const hasArrow = arrows.length > 0;

		if (hasArrow && !pressed) {
			world.setBlockMetadataWithNotify(x, y, z, facing | 8, 3);
			this.#notifyNeighbours(world, x, y, z, facing);
			world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
			world.playSoundEffect(x + 0.5, y + 0.5, z + 0.5, 'random.click', 0.3, 0.6);
		}

		if (!hasArrow && pressed) {
			world.setBlockMetadataWithNotify(x, y, z, facing, 3);
			this.#notifyNeighbours(world, x, y, z, facing);
			world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
			world.playSoundEffect(x + 0.5, y + 0.5, z + 0.5, 'random.click', 0.3, 0.5);
		}

		if (hasArrow) {
			world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world));
		}
	}

	registerIcons(reg) {}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/** Returns the best-fit facing based on which neighbour is a normal cube */
	#getOrientation(world, x, y, z) {
		if (world.isBlockNormalCube(x - 1, y, z)) return 1;
		if (world.isBlockNormalCube(x + 1, y, z)) return 2;
		if (world.isBlockNormalCube(x, y, z - 1)) return 3;
		if (world.isBlockNormalCube(x, y, z + 1)) return 4;
		return 1; // fallback
	}

	/**
	 * If the button can no longer be placed here, drops it and returns false.
	 * (formerly redundantCanPlaceBlockAt)
	 */
	#dropIfDetached(world, x, y, z) {
		if (!this.canPlaceBlockAt(world, x, y, z)) {
			this.dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
			world.setBlockToAir(x, y, z);
			return false;
		}
		return true;
	}

	/**
	 * Sets block bounds for the given metadata value.
	 * facing: 1=west wall, 2=east wall, 3=north wall, 4=south wall
	 * pressed (bit 3): slightly thinner profile
	 * (formerly func_82534_e)
	 */
	#applyBoundsForMeta(meta) {
		const facing    = meta & 7;
		const pressed   = (meta & 8) > 0;
		const half      = 0.1875; // half-width of the button face
		const thickness = pressed ? 0.0625 : 0.125;
		const lo        = 0.375;
		const hi        = 0.625;

		if      (facing === 1) this.setBlockBounds(0.0,            lo, 0.5 - half, thickness,       hi, 0.5 + half);
		else if (facing === 2) this.setBlockBounds(1.0 - thickness, lo, 0.5 - half, 1.0,            hi, 0.5 + half);
		else if (facing === 3) this.setBlockBounds(0.5 - half, lo, 0.0,            0.5 + half, hi, thickness);
		else if (facing === 4) this.setBlockBounds(0.5 - half, lo, 1.0 - thickness, 0.5 + half, hi, 1.0);
	}

	/**
	 * Notifies the button's own position and the block behind the mounted face.
	 * (formerly func_82536_d)
	 */
	#notifyNeighbours(world, x, y, z, facing) {
		world.notifyBlocksOfNeighborChange(x, y, z, this.blockID);
		if      (facing === 1) world.notifyBlocksOfNeighborChange(x - 1, y, z, this.blockID);
		else if (facing === 2) world.notifyBlocksOfNeighborChange(x + 1, y, z, this.blockID);
		else if (facing === 3) world.notifyBlocksOfNeighborChange(x, y, z - 1, this.blockID);
		else if (facing === 4) world.notifyBlocksOfNeighborChange(x, y, z + 1, this.blockID);
		else                   world.notifyBlocksOfNeighborChange(x, y - 1, z, this.blockID);
	}
}