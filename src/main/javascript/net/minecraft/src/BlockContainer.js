// BlockContainer.js
import { Block } from './Block.js';

export class BlockContainer extends Block {
	constructor(id, material) {
		super(id, material);
		this.isBlockContainer = true;
	}

	onBlockAdded(world, x, y, z) {
		super.onBlockAdded(world, x, y, z);
	}

	breakBlock(world, x, y, z, id, meta) {
		super.breakBlock(world, x, y, z, id, meta);
		world.removeBlockTileEntity(x, y, z);
	}

	onBlockEventReceived(world, x, y, z, eventId, eventParam) {
		super.onBlockEventReceived(world, x, y, z, eventId, eventParam);
		const tile = world.getBlockTileEntity(x, y, z);
		return tile !== null ? tile.receiveClientEvent(eventId, eventParam) : false;
	}

	/**
	 * Abstract — must be implemented by subclasses.
	 * Returns a new tile entity instance for this block.
	 * @abstract
	 * @param {World} world
	 * @returns {TileEntity}
	 */
	createNewTileEntity(world) {
		throw new Error(`${this.constructor.name}.createNewTileEntity() is not implemented`);
	}
}