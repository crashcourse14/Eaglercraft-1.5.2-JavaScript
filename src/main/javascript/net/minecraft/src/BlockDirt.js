import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { Item } from './Item.js';

export class BlockDirt extends Block {
    constructor(id) {
        super(id, Material.gound);
        this.setCreativeTab(CreativeTabs.tabBlock);
    }

}