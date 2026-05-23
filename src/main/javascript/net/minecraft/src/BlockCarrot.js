// BlockCarrot.js
import { BlockCrops } from './BlockCrops.js';
import { Item } from './Item.js';

export class BlockCarrot extends BlockCrops {
	#iconArray = null;

	constructor(id) {
		super(id);
	}

	/**
	 * Maps growth stage (0–7) to one of 4 icons.
	 * Stages 0–1 → icon 0, 2–3 → icon 1, 4–5 → icon 2, 6 treated as 5 → icon 2, 7 → icon 3.
	 */
	getIcon(side, meta) {
		if (meta < 7) {
			if (meta === 6) meta = 5;
			return this.#iconArray[meta >> 1];
		}
		return this.#iconArray[3];
	}

	getSeedItem() { return Item.carrot.itemID; }
	getCropItem() { return Item.carrot.itemID; }

	registerIcons(reg) {
		this.#iconArray = Array.from(
			{ length: 4 },
			(_, i) => reg.registerIcon(`carrots_${i}`),
		);
	}
}