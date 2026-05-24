// BlockClay.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { Item } from './Item.js';

export class BlockClay extends Block {
	constructor(id) {
		super(id, Material.clay);
		this.setCreativeTab(CreativeTabs.tabBlock);
	}

	idDropped(meta, rng, fortune) { return Item.clay.itemID; }
	quantityDropped(rng)          { return 4; }
}