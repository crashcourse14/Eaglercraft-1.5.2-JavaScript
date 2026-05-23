// BlockBookshelf.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { Item } from './Item.js';

export class BlockBookshelf extends Block {
    constructor(id) {
        super(id, Material.wood);
        this.setCreativeTab(CreativeTabs.tabBlock);
    }

    /** Top and bottom faces show the planks texture; all other sides use the bookshelf texture */
    getIcon(side, meta) {
    return (side === 0 || side === 1)
        ? Block.planks.getBlockTextureFromSide(side)
        : super.getIcon(side, meta);
    }

    quantityDropped(rng)          { return 3; }
    idDropped(meta, rng, fortune) { return Item.book.itemID; }
}