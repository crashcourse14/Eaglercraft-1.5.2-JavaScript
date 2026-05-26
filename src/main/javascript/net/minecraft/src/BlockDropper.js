// BlockDropper.js
import { BlockDispenser } from './BlockDispenser.js';
import { TileEntityDropper } from './TileEntityDropper.js';
import { BlockSourceImpl } from './BlockSourceImpl.js';
import { TileEntityHopper } from './TileEntityHopper.js';
import { Facing } from './Facing.js';

export class BlockDropper extends BlockDispenser {
	constructor(id) {
		super(id);
	}

	createNewTileEntity(world) {
		return new TileEntityDropper();
	}

	getBehaviorForItemStack(stack) { return null; }

	registerIcons(reg) {
		this.blockIcon          = reg.registerIcon('furnace_side');
		this.furnaceTopIcon     = reg.registerIcon('furnace_top');
		this.furnaceFrontIcon   = reg.registerIcon('dropper_front');
		this.field_96473_e      = reg.registerIcon('dropper_front_vertical');
	}

	/**
	 * Attempts to push one item from a random occupied slot into the inventory
	 * directly in front of the dropper. If there is no inventory there, the slot
	 * is simply cleared (the item disappears). Plays a click sound when empty.
	 */
	dispense(world, x, y, z) {
		const source = new BlockSourceImpl(world, x, y, z);
		const tile   = source.getBlockTileEntity();
		if (tile === null) return;

		const slot = tile.getRandomStackFromInventory();
		if (slot < 0) {
			world.playAuxSFX(1001, x, y, z, 0);
			return;
		}

		const stack   = tile.getStackInSlot(slot);
		const facing  = world.getBlockMetadata(x, y, z) & 7;
		const targetX = x + Facing.offsetsXForSide[facing];
		const targetY = y + Facing.offsetsYForSide[facing];
		const targetZ = z + Facing.offsetsZForSide[facing];
		const inv     = TileEntityHopper.getInventoryAtLocation(world, targetX, targetY, targetZ);

		let result;
		if (inv !== null) {
			// Try to insert one item into the adjacent inventory
			const inserted = TileEntityHopper.insertStack(
				inv,
				stack.copy().splitStack(1),
				Facing.oppositeSide[facing],
			);

			if (inserted === null) {
				// Insertion succeeded — decrement the source stack
				result = stack.copy();
				if (--result.stackSize === 0) result = null;
			} else {
				// Insertion failed — leave the stack unchanged
				result = stack.copy();
			}
		} else {
			// No target inventory — drop the item (result = null clears the slot)
			result = null;
		}

		tile.setInventorySlotContents(slot, result);
	}
}