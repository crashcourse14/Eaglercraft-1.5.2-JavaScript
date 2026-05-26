// BlockDirectional.js
import { Block } from './Block.js';

export class BlockDirectional extends Block {
	constructor(id, material) {
		super(id, material);
	}

	/** Extracts the facing direction (0–3) from block metadata */
	static getDirection(meta) {
		return meta & 3;
	}
}