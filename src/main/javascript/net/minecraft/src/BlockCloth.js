// BlockCloth.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { ItemStack } from './ItemStack.js';

export class BlockCloth extends Block {
	#iconArray = null;

	constructor() {
		super(35, Material.cloth);
		this.setCreativeTab(CreativeTabs.tabBlock);
	}

	getIcon(side, meta)   { return this.#iconArray[meta % this.#iconArray.length]; }
	damageDropped(meta)   { return meta; }

	/** Converts a dye damage value to the matching block metadata (and vice versa) */
	static getBlockFromDye(dye)   { return ~dye & 15; }
	static getDyeFromBlock(block) { return ~block & 15; }

	getSubBlocks(id, tab, list) {
		for (let i = 0; i < 16; ++i) {
			list.push(new ItemStack(id, 1, i));
		}
	}

	registerIcons(reg) {
		this.#iconArray = Array.from(
			{ length: 16 },
			(_, i) => reg.registerIcon(`cloth_${i}`),
		);
	}
}