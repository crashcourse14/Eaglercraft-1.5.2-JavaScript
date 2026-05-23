// BlockButtonStone.js
import { BlockButton } from './BlockButton.js';
import { Block } from './Block.js';

export class BlockButtonStone extends BlockButton {
    constructor(id) {
        super(id, true); // true =  sensible to arrows
    }

    getIcon(side, meta) {
        return Block.planks.getBlockTextureFromSide(1);
    }
}