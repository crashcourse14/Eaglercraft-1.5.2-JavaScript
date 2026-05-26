// BlockDetectorRail.js
import { BlockRailBase } from './BlockRailBase.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';
import { EntityMinecart } from './EntityMinecart.js';
import { IEntitySelector } from './IEntitySelector.js';
import { Container } from './Container.js';

export class BlockDetectorRail extends BlockRailBase {
	#iconArray = null;

	constructor(id) {
		super(id, true);
		this.setTickRandomly(true);
	}

	tickRate(world)               { return 20; }
	canProvidePower()             { return true; }
	hasComparatorInputOverride()  { return true; }

	getIcon(side, meta) {
		return (meta & 8) !== 0 ? this.#iconArray[1] : this.#iconArray[0];
	}

	registerIcons(reg) {
		this.#iconArray = [
			reg.registerIcon('detectorRail'),
			reg.registerIcon('detectorRail_on'),
		];
	}

	// -------------------------------------------------------------------------
	// Redstone power
	// -------------------------------------------------------------------------

	isProvidingWeakPower(access, x, y, z, side) {
		return (access.getBlockMetadata(x, y, z) & 8) !== 0 ? 15 : 0;
	}

	isProvidingStrongPower(access, x, y, z, side) {
		return (access.getBlockMetadata(x, y, z) & 8) === 0 ? 0 : (side === 1 ? 15 : 0);
	}

	// -------------------------------------------------------------------------
	// Comparator override
	// -------------------------------------------------------------------------

	/**
	 * If a powered minecart with an inventory is on the rail, returns a redstone
	 * signal strength proportional to how full that inventory is.
	 */
	getComparatorInputOverride(world, x, y, z, side) {
		if ((world.getBlockMetadata(x, y, z) & 8) === 0) return 0;

		const m    = 0.125;
		const carts = world.selectEntitiesWithinAABB(
			EntityMinecart,
			AxisAlignedBB.getAABBPool().getAABB(
				x + m,     y,     z + m,
				x + 1 - m, y + 1 - m, z + 1 - m,
			),
			IEntitySelector.selectInventories,
		);

		return carts.length > 0
			? Container.calcRedstoneFromInventory(carts[0])
			: 0;
	}

	// -------------------------------------------------------------------------
	// Placement / ticking
	// -------------------------------------------------------------------------

	onBlockAdded(world, x, y, z) {
		super.onBlockAdded(world, x, y, z);
		this.#updateRailState(world, x, y, z, world.getBlockMetadata(x, y, z));
	}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Checks for minecarts in the rail's bounding box and toggles the powered
	 * bit (bit 3) in the block's metadata accordingly.
	 * Schedules a tick-off update while a cart is present.
	 */
	#updateRailState(world, x, y, z, meta) {
		const wasPowered = (meta & 8) !== 0;
		const m          = 0.125;

		const carts = world.getEntitiesWithinAABB(
			EntityMinecart,
			AxisAlignedBB.getAABBPool().getAABB(
				x + m,     y,     z + m,
				x + 1 - m, y + 1 - m, z + 1 - m,
			),
		);
		const hasCart = carts.length > 0;

		if (hasCart && !wasPowered) {
			world.setBlockMetadataWithNotify(x, y, z, meta | 8, 3);
			world.notifyBlocksOfNeighborChange(x, y,     z, this.blockID);
			world.notifyBlocksOfNeighborChange(x, y - 1, z, this.blockID);
			world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
		}

		if (!hasCart && wasPowered) {
			world.setBlockMetadataWithNotify(x, y, z, meta & 7, 3);
			world.notifyBlocksOfNeighborChange(x, y,     z, this.blockID);
			world.notifyBlocksOfNeighborChange(x, y - 1, z, this.blockID);
			world.markBlockRangeForRenderUpdate(x, y, z, x, y, z);
		}

		if (hasCart) {
			world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world));
		}

		world.func_96440_m(x, y, z, this.blockID);
	}
}