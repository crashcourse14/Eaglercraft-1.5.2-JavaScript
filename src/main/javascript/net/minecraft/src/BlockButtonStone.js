// BlockButtonStone.js
import { BlockButton } from './BlockButton.js';
import { Block } from './Block.js';

export class BlockButtonStone extends BlockButton {
	constructor(id) {
		super(id, false); // false = not sensible to arrows
	}

	getIcon(side, meta) {
		return Block.stone.getBlockTextureFromSide(1);
	}
}