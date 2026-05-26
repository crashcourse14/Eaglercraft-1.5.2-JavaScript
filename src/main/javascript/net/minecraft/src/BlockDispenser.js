// BlockDispenser.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { BlockPistonBase } from './BlockPistonBase.js';
import { EntityItem } from './EntityItem.js';
import { ItemStack } from './ItemStack.js';
import { EnumFacing } from './EnumFacing.js';
import { PositionImpl } from './PositionImpl.js';
import { TileEntityDispenser } from './TileEntityDispenser.js';
import { Container } from './Container.js';
import { EaglercraftRandom } from './EaglercraftRandom.js';

export class BlockDispenser extends BlockContainer {
	random = new EaglercraftRandom();
	#furnaceTopIcon      = null;
	#furnaceFrontIcon    = null;
	#frontVerticalIcon   = null; // formerly field_96473_e — vertical dispenser front face

	constructor(id) {
		super(id, Material.rock);
		this.setCreativeTab(CreativeTabs.tabRedstone);
	}

	tickRate(world)              { return 4; }
	hasComparatorInputOverride() { return true; }

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

	createNewTileEntity(world) {
		return new TileEntityDispenser();
	}

	// -------------------------------------------------------------------------
	// Textures
	// -------------------------------------------------------------------------

	registerIcons(reg) {
		this.blockIcon          = reg.registerIcon('furnace_side');
		this.#furnaceTopIcon    = reg.registerIcon('furnace_top');
		this.#furnaceFrontIcon  = reg.registerIcon('dispenser_front');
		this.#frontVerticalIcon = reg.registerIcon('dispenser_front_vertical');
	}

	/**
	 * Selects the correct texture for each face of the dispenser.
	 *
	 * Facing direction is stored in bits 0–2 of metadata.
	 * - The face the dispenser points toward shows the front texture.
	 * - Top/bottom faces (0/1) show the top texture.
	 * - All other faces show the side (furnace_side) texture.
	 * - Vertical dispensers (facing 0 or 1) use the vertical front icon.
	 */
	getIcon(side, meta) {
		const facing     = meta & 7;
		const isVertical = facing === 0 || facing === 1;

		if (side === facing) {
			// The face the dispenser shoots from
			return isVertical ? this.#frontVerticalIcon : this.#furnaceFrontIcon;
		}

		if (side === 0 || side === 1) {
			// Top/bottom always show the furnace-top texture
			return this.#furnaceTopIcon;
		}

		if (isVertical) {
			// Vertical dispenser: all horizontal sides show the top texture
			return this.#furnaceTopIcon;
		}

		return this.blockIcon;
	}

	// -------------------------------------------------------------------------
	// Placement
	// -------------------------------------------------------------------------

	onBlockAdded(world, x, y, z) {
		super.onBlockAdded(world, x, y, z);
		this.#setDispenserDefaultDirection(world, x, y, z);
	}

	/** No-op stub — sets a default facing when the dispenser is placed */
	#setDispenserDefaultDirection(world, x, y, z) {}

	onBlockPlacedBy(world, x, y, z, entity, stack) {
		const facing = BlockPistonBase.determineOrientation(world, x, y, z, entity);
		world.setBlockMetadataWithNotify(x, y, z, facing, 2);

		if (stack.hasDisplayName()) {
			world.getBlockTileEntity(x, y, z).setCustomName(stack.getDisplayName());
		}
	}

	// -------------------------------------------------------------------------
	// Redstone triggering
	// -------------------------------------------------------------------------

	onNeighborBlockChange(world, x, y, z, neighborId) {
		const powered  = world.isBlockIndirectlyGettingPowered(x, y,     z)
		              || world.isBlockIndirectlyGettingPowered(x, y + 1, z);
		const meta     = world.getBlockMetadata(x, y, z);
		const wasLit   = (meta & 8) !== 0;

		if (powered && !wasLit) {
			world.scheduleBlockUpdate(x, y, z, this.blockID, this.tickRate(world));
			world.setBlockMetadataWithNotify(x, y, z, meta | 8, 4);
		} else if (!powered && wasLit) {
			world.setBlockMetadataWithNotify(x, y, z, meta & -9, 4);
		}
	}

	/** Stub — fires the dispenser; subclasses implement the actual projectile logic */
	dispense(world, x, y, z) {}

	/** Returns the dispense behaviour for the given item; null = default behaviour */
	getBehaviorForItemStack(stack) { return null; }

	// -------------------------------------------------------------------------
	// Break — scatter inventory
	// -------------------------------------------------------------------------

	breakBlock(world, x, y, z, id, meta) {
		const tile = world.getBlockTileEntity(x, y, z);

		if (tile !== null) {
			for (let slot = 0; slot < tile.getSizeInventory(); ++slot) {
				const stack = tile.getStackInSlot(slot);
				if (stack === null) continue;

				const ox = this.random.nextFloat() * 0.8 + 0.1;
				const oy = this.random.nextFloat() * 0.8 + 0.1;
				const oz = this.random.nextFloat() * 0.8 + 0.1;

				while (stack.stackSize > 0) {
					let count = this.random.nextInt(21) + 10;
					if (count > stack.stackSize) count = stack.stackSize;
					stack.stackSize -= count;

					const item = new EntityItem(
						world,
						x + ox, y + oy, z + oz,
						new ItemStack(stack.itemID, count, stack.getItemDamage()),
					);

					if (stack.hasTagCompound()) {
						item.getEntityItem().setTagCompound(stack.getTagCompound().copy());
					}

					const spread = 0.05;
					item.motionX = this.random.nextGaussian() * spread;
					item.motionY = this.random.nextGaussian() * spread + 0.2;
					item.motionZ = this.random.nextGaussian() * spread;
					world.spawnEntityInWorld(item);
				}
			}

			world.func_96440_m(x, y, z, id);
		}

		super.breakBlock(world, x, y, z, id, meta);
	}

	// -------------------------------------------------------------------------
	// Comparator override
	// -------------------------------------------------------------------------

	getComparatorInputOverride(world, x, y, z, side) {
		return Container.calcRedstoneFromInventory(world.getBlockTileEntity(x, y, z));
	}

	// -------------------------------------------------------------------------
	// Static helpers
	// -------------------------------------------------------------------------

	/**
	 * Returns the 3D position in front of the dispenser's output face,
	 * offset 70% of the way toward that face from the block centre.
	 */
	static getIPositionFromBlockSource(source) {
		const facing = BlockDispenser.getFacing(source.getBlockMetadata());
		return new PositionImpl(
			source.getX() + 0.7 * facing.getFrontOffsetX(),
			source.getY() + 0.7 * facing.getFrontOffsetY(),
			source.getZ() + 0.7 * facing.getFrontOffsetZ(),
		);
	}

	/** Returns the EnumFacing for the given metadata value (bits 0–2) */
	static getFacing(meta) {
		return EnumFacing.getFront(meta & 7);
	}
}