// BlockBrewingStand.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { Item } from './Item.js';
import { TileEntityBrewingStand } from './TileEntityBrewingStand.js';
import { EntityItem } from './EntityItem.js';
import { ItemStack } from './ItemStack.js';
import { Container } from './Container.js';
import { EaglercraftRandom } from './EaglercraftRandom.js';

export class BlockBrewingStand extends BlockContainer {
	#rand = new EaglercraftRandom();
	#theIcon = null;

	constructor(id) {
		super(id, Material.iron);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 25; }
	hasComparatorInputOverride() { return true; }

	idDropped(meta, rng, fortune) { return Item.brewingStand.itemID; }
	idPicked(world, x, y, z)     { return Item.brewingStand.itemID; }

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

	createNewTileEntity(world) {
		return new TileEntityBrewingStand();
	}

	/**
	 * Two collision boxes: a thin central post and a wide flat base.
	 */
	addCollisionBoxesToList(world, x, y, z, mask, list, entity) {
		this.setBlockBounds(0.4375, 0.0, 0.4375, 0.5625, 0.875, 0.5625);
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);
		this.setBlockBoundsForItemRender();
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);
	}

	setBlockBoundsForItemRender() {
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.125, 1.0);
	}

	/** Forwards a custom display name from the placed ItemStack to the tile entity */
	onBlockPlacedBy(world, x, y, z, entity, stack) {
		if (stack.hasDisplayName()) {
			world.getBlockTileEntity(x, y, z).func_94131_a(stack.getDisplayName());
		}
	}

	/** Spawns a smoke particle above the stand each random display tick */
	randomDisplayTick(world, x, y, z, rng) {
		const px = x + 0.4 + rng.nextFloat() * 0.2;
		const py = y + 0.7 + rng.nextFloat() * 0.3;
		const pz = z + 0.4 + rng.nextFloat() * 0.2;
		world.spawnParticle('smoke', px, py, pz, 0.0, 0.0, 0.0);
	}

	/**
	 * Scatters all inventory contents as item entities before the block is removed.
	 * Each stack is split into random chunk sizes of 10–30 to spread the items out.
	 */
	breakBlock(world, x, y, z, id, meta) {
		const tile = world.getBlockTileEntity(x, y, z);

		if (tile instanceof TileEntityBrewingStand) {
			const ox = this.#rand.nextFloat() * 0.8 + 0.1;
			const oy = this.#rand.nextFloat() * 0.8 + 0.1;
			const oz = this.#rand.nextFloat() * 0.8 + 0.1;

			for (let slot = 0; slot < tile.getSizeInventory(); ++slot) {
				const stack = tile.getStackInSlot(slot);
				if (stack === null) continue;

				while (stack.stackSize > 0) {
					let count = this.#rand.nextInt(21) + 10;
					if (count > stack.stackSize) count = stack.stackSize;
					stack.stackSize -= count;

					const item = new EntityItem(
						world,
						x + ox, y + oy, z + oz,
						new ItemStack(stack.itemID, count, stack.getItemDamage()),
					);
					const spread = 0.05;
					item.motionX = this.#rand.nextGaussian() * spread;
					item.motionY = this.#rand.nextGaussian() * spread + 0.2;
					item.motionZ = this.#rand.nextGaussian() * spread;
					world.spawnEntityInWorld(item);
				}
			}
		}

		super.breakBlock(world, x, y, z, id, meta);
	}

	getComparatorInputOverride(world, x, y, z, side) {
		return Container.calcRedstoneFromInventory(world.getBlockTileEntity(x, y, z));
	}

	registerIcons(reg) {
		super.registerIcons(reg);
		this.#theIcon = reg.registerIcon('brewingStand_base');
	}

	getBrewingStandIcon() { return this.#theIcon; }
}