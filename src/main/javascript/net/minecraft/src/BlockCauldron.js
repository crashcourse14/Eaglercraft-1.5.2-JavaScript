// BlockCauldron.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { Item } from './Item.js';

export class BlockCauldron extends Block {
	#innerIcon        = null;
	#cauldronTopIcon  = null;
	#cauldronBottomIcon = null;

	constructor(id) {
		super(id, Material.iron);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 24; }

	idDropped(meta, rng, fortune) { return Item.cauldron.itemID; }
	idPicked(world, x, y, z)     { return Item.cauldron.itemID; }

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

	getIcon(side, meta) {
		if (side === 1) return this.#cauldronTopIcon;
		if (side === 0) return this.#cauldronBottomIcon;
		return this.blockIcon;
	}

	registerIcons(reg) {
		this.#innerIcon          = reg.registerIcon('cauldron_inner');
		this.#cauldronTopIcon    = reg.registerIcon('cauldron_top');
		this.#cauldronBottomIcon = reg.registerIcon('cauldron_bottom');
		this.blockIcon           = reg.registerIcon('cauldron_side');
	}

	/**
	 * Looks up a cauldron icon by name. Used externally by the renderer to
	 * access the inner and bottom textures without holding a direct reference.
	 * String identity comparison is preserved from Java (reference equality).
	 */
	static getIconByName(name) {
		if (name === 'cauldron_inner')  return Block.cauldron.#innerIcon;
		if (name === 'cauldron_bottom') return Block.cauldron.#cauldronBottomIcon;
		return null;
	}

	/**
	 * Five collision boxes make up the cauldron shape:
	 * a thin floor, and four walls (west, north, east, south).
	 */
	addCollisionBoxesToList(world, x, y, z, mask, list, entity) {
		const w = 0.125;

		// Floor
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.3125, 1.0);
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);

		// West wall
		this.setBlockBounds(0.0, 0.0, 0.0, w, 1.0, 1.0);
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);

		// North wall
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 1.0, w);
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);

		// East wall
		this.setBlockBounds(1.0 - w, 0.0, 0.0, 1.0, 1.0, 1.0);
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);

		// South wall
		this.setBlockBounds(0.0, 0.0, 1.0 - w, 1.0, 1.0, 1.0);
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);

		this.setBlockBoundsForItemRender();
	}

	setBlockBoundsForItemRender() {
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
	}

	/**
	 * Has a 1-in-20 chance each rain tick of incrementing the water level (max 3).
	 */
	fillWithRain(world, x, y, z) {
		if (world.rand.nextInt(20) === 0) {
			const meta = world.getBlockMetadata(x, y, z);
			if (meta < 3) {
				world.setBlockMetadataWithNotify(x, y, z, meta + 1, 2);
			}
		}
	}
}