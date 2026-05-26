// BlockDeadBush.js
import { BlockFlower } from './BlockFlower.js';
import { Block } from './Block.js';
import { Material } from './Material.js';

export class BlockDeadBush extends BlockFlower {
	constructor(id) {
		super(id, Material.vine);
		this.setBlockBounds(0.1, 0.0, 0.1, 0.9, 0.8, 0.9);
	}

	/** Dead bushes only grow on sand */
	canThisPlantGrowOnThisBlockID(blockId) {
		return blockId === Block.sand.blockID;
	}

	/** Drops nothing (-1 = no item) */
	idDropped(meta, rng, fortune) { return -1; }
}