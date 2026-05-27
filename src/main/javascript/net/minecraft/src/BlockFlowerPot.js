// BlockFlowerPot.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { Item } from './Item.js';
import { ItemStack } from './ItemStack.js';

export class BlockFlowerPot extends Block {
	constructor(id) {
		super(id, Material.circuits);
		this.setBlockBoundsForItemRender();
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 33; }
	isFlowerPot()         { return true; }

	idDropped(meta, rng, fortune) { return Item.flowerPot.itemID; }

	setBlockBoundsForItemRender() {
		const w = 0.375;
		const hw = w / 2.0;
		this.setBlockBounds(0.5 - hw, 0.0, 0.5 - hw, 0.5 + hw, w, 0.5 + hw);
	}

	// -------------------------------------------------------------------------
	// Placement / survival
	// -------------------------------------------------------------------------

	canPlaceBlockAt(world, x, y, z) {
		return super.canPlaceBlockAt(world, x, y, z)
			&& world.doesBlockHaveSolidTopSurface(x, y - 1, z);
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		if (!world.doesBlockHaveSolidTopSurface(x, y - 1, z)) {
			this.dropBlockAsItem(world, x, y, z, world.getBlockMetadata(x, y, z), 0);
			world.setBlockToAir(x, y, z);
		}
	}

	// -------------------------------------------------------------------------
	// Interaction
	// -------------------------------------------------------------------------

	/**
	 * Right-clicking with a compatible plant item places it in the pot,
	 * consuming one item from the player's hand (unless in creative).
	 */
	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) {
		const held = player.inventory.getCurrentItem();
		if (held === null) return false;
		if (world.getBlockMetadata(x, y, z) !== 0) return false; // pot already occupied

		const meta = BlockFlowerPot.getMetaForPlant(held);
		if (meta <= 0) return false;

		world.setBlockMetadataWithNotify(x, y, z, meta, 2);

		if (!player.capabilities.isCreativeMode && --held.stackSize <= 0) {
			player.inventory.setInventorySlotContents(player.inventory.currentItem, null);
		}

		return true;
	}

	idPicked(world, x, y, z) {
		const plant = BlockFlowerPot.getPlantForMeta(world.getBlockMetadata(x, y, z));
		return plant === null ? Item.flowerPot.itemID : plant.itemID;
	}

	getDamageValue(world, x, y, z) {
		const plant = BlockFlowerPot.getPlantForMeta(world.getBlockMetadata(x, y, z));
		return plant === null ? Item.flowerPot.itemID : plant.getItemDamage();
	}

	dropBlockAsItemWithChance(world, x, y, z, meta, chance, fortune) {
		super.dropBlockAsItemWithChance(world, x, y, z, meta, chance, fortune);
		if (meta > 0) {
			const plant = BlockFlowerPot.getPlantForMeta(meta);
			if (plant !== null) this.dropBlockAsItem_do(world, x, y, z, plant);
		}
	}

	// -------------------------------------------------------------------------
	// Static plant↔meta mapping
	// -------------------------------------------------------------------------

	/** Returns the ItemStack for the plant stored in the pot, or null if empty */
	static getPlantForMeta(meta) {
		switch (meta) {
			case  1: return new ItemStack(Block.plantRed);
			case  2: return new ItemStack(Block.plantYellow);
			case  3: return new ItemStack(Block.sapling, 1, 0);
			case  4: return new ItemStack(Block.sapling, 1, 1);
			case  5: return new ItemStack(Block.sapling, 1, 2);
			case  6: return new ItemStack(Block.sapling, 1, 3);
			case  7: return new ItemStack(Block.mushroomRed);
			case  8: return new ItemStack(Block.mushroomBrown);
			case  9: return new ItemStack(Block.cactus);
			case 10: return new ItemStack(Block.deadBush);
			case 11: return new ItemStack(Block.tallGrass, 1, 2);
			default: return null;
		}
	}

	/** Returns the metadata value for placing the given item in a flower pot, or 0 if unsupported */
	static getMetaForPlant(stack) {
		const id = stack.getItem().itemID;

		if (id === Block.plantRed.blockID)     return 1;
		if (id === Block.plantYellow.blockID)  return 2;
		if (id === Block.cactus.blockID)       return 9;
		if (id === Block.mushroomBrown.blockID)return 8;
		if (id === Block.mushroomRed.blockID)  return 7;
		if (id === Block.deadBush.blockID)     return 10;

		if (id === Block.sapling.blockID) {
			switch (stack.getItemDamage()) {
				case 0: return 3;
				case 1: return 4;
				case 2: return 5;
				case 3: return 6;
			}
		}

		if (id === Block.tallGrass.blockID && stack.getItemDamage() === 2) return 11;

		return 0;
	}
}