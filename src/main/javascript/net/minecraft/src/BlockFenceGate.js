// BlockFenceGate.js
import { BlockDirectional } from './BlockDirectional.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { Block } from './Block.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';
import { MathHelper } from './MathHelper.js';

export class BlockFenceGate extends BlockDirectional {
	constructor(id) {
		super(id, Material.wood);
		this.setCreativeTab(CreativeTabs.tabRedstone);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 21; }
	shouldSideBeRendered(access, x, y, z, side) { return true; }
	registerIcons(reg)    {}

	getIcon(side, meta) {
		return Block.planks.getBlockTextureFromSide(side);
	}

	getBlocksMovement(access, x, y, z) {
		return BlockFenceGate.isFenceGateOpen(access.getBlockMetadata(x, y, z));
	}

	canPlaceBlockAt(world, x, y, z) {
		return world.getBlockMaterial(x, y - 1, z).isSolid()
			&& super.canPlaceBlockAt(world, x, y, z);
	}

	// -------------------------------------------------------------------------
	// Bounds
	// -------------------------------------------------------------------------

	/**
	 * Visual bounds: N–S facing (direction 0 or 2) → thin Z-axis panel;
	 * E–W facing (direction 1 or 3) → thin X-axis panel.
	 */
	setBlockBoundsBasedOnState(access, x, y, z) {
		const dir = BlockDirectional.getDirection(access.getBlockMetadata(x, y, z));
		if (dir === 0 || dir === 2) {
			this.setBlockBounds(0.0, 0.0, 0.375, 1.0, 1.0, 0.625);
		} else {
			this.setBlockBounds(0.375, 0.0, 0.0, 0.625, 1.0, 1.0);
		}
	}

	/**
	 * Open gates have no collision. Closed gates have a 1.5-block-tall collision
	 * box aligned with their facing axis to prevent jumping over them.
	 */
	getCollisionBoundingBoxFromPool(world, x, y, z) {
		const meta = world.getBlockMetadata(x, y, z);
		if (BlockFenceGate.isFenceGateOpen(meta)) return null;

		const dir = meta & 3;
		if (dir === 0 || dir === 2) {
			// N–S facing: collision along Z axis
			return AxisAlignedBB.getAABBPool().getAABB(
				x, y, z + 0.375, x + 1, y + 1.5, z + 0.625,
			);
		} else {
			// E–W facing: collision along X axis
			return AxisAlignedBB.getAABBPool().getAABB(
				x + 0.375, y, z, x + 0.625, y + 1.5, z + 1,
			);
		}
	}

	// -------------------------------------------------------------------------
	// Placement / activation
	// -------------------------------------------------------------------------

	onBlockPlacedBy(world, x, y, z, entity, stack) {
		const facing = (MathHelper.floor_double(entity.rotationYaw * 4.0 / 360.0 + 0.5) & 3) % 4;
		world.setBlockMetadataWithNotify(x, y, z, facing, 2);
	}

	/**
	 * Toggles the gate open or closed. When opening, if the player is facing
	 * the back of the gate (opposite direction), the gate swings to face the
	 * player instead so it always opens toward them.
	 */
	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) {
		let meta = world.getBlockMetadata(x, y, z);

		if (BlockFenceGate.isFenceGateOpen(meta)) {
			// Close: clear the open bit
			world.setBlockMetadataWithNotify(x, y, z, meta & -5, 2);
		} else {
			// Open: re-orient to face the player if they're on the opposite side
			const playerFacing = (MathHelper.floor_double(player.rotationYaw * 4.0 / 360.0 + 0.5) & 3) % 4;
			const gateFacing   = BlockDirectional.getDirection(meta);
			if (gateFacing === (playerFacing + 2) % 4) {
				meta = playerFacing;
			}
			world.setBlockMetadataWithNotify(x, y, z, meta | 4, 2);
		}

		world.playAuxSFXAtEntity(player, 1003, x, y, z, 0);
		return true;
	}

	// -------------------------------------------------------------------------
	// Static helpers
	// -------------------------------------------------------------------------

	/** Returns true if bit 2 of metadata is set (gate is open) */
	static isFenceGateOpen(meta) {
		return (meta & 4) !== 0;
	}
}