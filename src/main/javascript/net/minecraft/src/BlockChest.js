// BlockChest.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { MathHelper } from './MathHelper.js';
import { TileEntityChest } from './TileEntityChest.js';
import { InventoryLargeChest } from './InventoryLargeChest.js';
import { EntityItem } from './EntityItem.js';
import { EntityOcelot } from './EntityOcelot.js';
import { ItemStack } from './ItemStack.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';
import { Container } from './Container.js';
import { EaglercraftRandom } from './EaglercraftRandom.js';

export class BlockChest extends BlockContainer {
	#random = new EaglercraftRandom();

	/** 0 = normal chest, 1 = trapped chest */
	isTrapped;

	constructor(id, isTrapped) {
		super(id, Material.wood);
		this.isTrapped = isTrapped;
		this.setCreativeTab(CreativeTabs.tabDecorations);
		this.setBlockBounds(0.0625, 0.0, 0.0625, 0.9375, 0.875, 0.9375);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getRenderType()       { return 22; }
	hasComparatorInputOverride() { return true; }
	canProvidePower()     { return this.isTrapped === 1; }

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

	registerIcons(reg) {
		this.blockIcon = reg.registerIcon('wood');
	}

	createNewTileEntity(world) {
		return new TileEntityChest();
	}

	// -------------------------------------------------------------------------
	// Bounds
	// -------------------------------------------------------------------------

	/**
	 * Expands the bounds on the side that connects to an adjacent chest half,
	 * so the two halves of a double chest appear seamlessly joined.
	 */
	setBlockBoundsBasedOnState(access, x, y, z) {
		const id = this.blockID;
		if      (access.getBlockId(x,     y, z - 1) === id) this.setBlockBounds(0.0625, 0.0, 0.0,    0.9375, 0.875, 0.9375);
		else if (access.getBlockId(x,     y, z + 1) === id) this.setBlockBounds(0.0625, 0.0, 0.0625, 0.9375, 0.875, 1.0);
		else if (access.getBlockId(x - 1, y, z)     === id) this.setBlockBounds(0.0,    0.0, 0.0625, 0.9375, 0.875, 0.9375);
		else if (access.getBlockId(x + 1, y, z)     === id) this.setBlockBounds(0.0625, 0.0, 0.0625, 1.0,    0.875, 0.9375);
		else                                                  this.setBlockBounds(0.0625, 0.0, 0.0625, 0.9375, 0.875, 0.9375);
	}

	// -------------------------------------------------------------------------
	// Placement
	// -------------------------------------------------------------------------

	onBlockAdded(world, x, y, z) {
		super.onBlockAdded(world, x, y, z);
		this.unifyAdjacentChests(world, x, y, z);

		const id = this.blockID;
		if (world.getBlockId(x,     y, z - 1) === id) this.unifyAdjacentChests(world, x,     y, z - 1);
		if (world.getBlockId(x,     y, z + 1) === id) this.unifyAdjacentChests(world, x,     y, z + 1);
		if (world.getBlockId(x - 1, y, z)     === id) this.unifyAdjacentChests(world, x - 1, y, z);
		if (world.getBlockId(x + 1, y, z)     === id) this.unifyAdjacentChests(world, x + 1, y, z);
	}

	onBlockPlacedBy(world, x, y, z, entity, stack) {
		const id = this.blockID;
		const N  = world.getBlockId(x,     y, z - 1);
		const S  = world.getBlockId(x,     y, z + 1);
		const W  = world.getBlockId(x - 1, y, z);
		const E  = world.getBlockId(x + 1, y, z);

		// Map yaw to facing metadata: 0→2(N), 1→5(E), 2→3(S), 3→4(W)
		const yawIndex = MathHelper.floor_double(entity.rotationYaw * 4.0 / 360.0 + 0.5) & 3;
		const facing   = [2, 5, 3, 4][yawIndex];

		if (N !== id && S !== id && W !== id && E !== id) {
			// Single chest — just set our facing
			world.setBlockMetadataWithNotify(x, y, z, facing, 3);
		} else {
			// Double chest — align both halves
			if ((N === id || S === id) && (facing === 4 || facing === 5)) {
				const neighborZ = N === id ? z - 1 : z + 1;
				world.setBlockMetadataWithNotify(x, y, neighborZ, facing, 3);
				world.setBlockMetadataWithNotify(x, y, z, facing, 3);
			}
			if ((W === id || E === id) && (facing === 2 || facing === 3)) {
				const neighborX = W === id ? x - 1 : x + 1;
				world.setBlockMetadataWithNotify(neighborX, y, z, facing, 3);
				world.setBlockMetadataWithNotify(x, y, z, facing, 3);
			}
		}

		if (stack.hasDisplayName()) {
			world.getBlockTileEntity(x, y, z).func_94043_a(stack.getDisplayName());
		}
	}

	/** No-op stub — subclasses (e.g. trapped chest) can override to merge adjacent chests */
	unifyAdjacentChests(world, x, y, z) {}

	canPlaceBlockAt(world, x, y, z) {
		const id = this.blockID;
		let neighbors = 0;
		if (world.getBlockId(x - 1, y, z)     === id) ++neighbors;
		if (world.getBlockId(x + 1, y, z)     === id) ++neighbors;
		if (world.getBlockId(x,     y, z - 1) === id) ++neighbors;
		if (world.getBlockId(x,     y, z + 1) === id) ++neighbors;

		if (neighbors > 1) return false;

		return !this.#isThereANeighborChest(world, x - 1, y, z)
			&& !this.#isThereANeighborChest(world, x + 1, y, z)
			&& !this.#isThereANeighborChest(world, x,     y, z - 1)
			&& !this.#isThereANeighborChest(world, x,     y, z + 1);
	}

	// -------------------------------------------------------------------------
	// Neighbour events
	// -------------------------------------------------------------------------

	onNeighborBlockChange(world, x, y, z, neighborId) {
		super.onNeighborBlockChange(world, x, y, z, neighborId);
		const tile = world.getBlockTileEntity(x, y, z);
		if (tile !== null) tile.updateContainingBlockInfo();
	}

	// -------------------------------------------------------------------------
	// Break — scatter inventory
	// -------------------------------------------------------------------------

	breakBlock(world, x, y, z, id, meta) {
		const tile = world.getBlockTileEntity(x, y, z);

		if (tile !== null) {
			for (let slot = 0; slot < tile.getSizeInventory(); ++slot) {
				const stack = tile.getStackInSlot(slot);
				if (stack === null) continue;

				const ox = this.#random.nextFloat() * 0.8 + 0.1;
				const oy = this.#random.nextFloat() * 0.8 + 0.1;
				const oz = this.#random.nextFloat() * 0.8 + 0.1;

				while (stack.stackSize > 0) {
					let count = this.#random.nextInt(21) + 10;
					if (count > stack.stackSize) count = stack.stackSize;
					stack.stackSize -= count;

					const item = new EntityItem(
						world,
						x + ox, y + oy, z + oz,
						new ItemStack(stack.itemID, count, stack.getItemDamage()),
					);
					const spread = 0.05;
					item.motionX = this.#random.nextGaussian() * spread;
					item.motionY = this.#random.nextGaussian() * spread + 0.2;
					item.motionZ = this.#random.nextGaussian() * spread;

					if (stack.hasTagCompound()) {
						item.getEntityItem().setTagCompound(stack.getTagCompound().copy());
					}

					world.spawnEntityInWorld(item);
				}
			}

			world.func_96440_m(x, y, z, id);
		}

		super.breakBlock(world, x, y, z, id, meta);
	}

	// -------------------------------------------------------------------------
	// Inventory access
	// -------------------------------------------------------------------------

	/**
	 * Returns the inventory for this chest, or null if blocked (solid block or
	 * sitting ocelot above, or blocked partner half of a double chest).
	 * Wraps two adjacent single chests in an InventoryLargeChest when present.
	 */
	getInventory(world, x, y, z) {
		let inv = world.getBlockTileEntity(x, y, z);
		if (inv === null) return null;
		if (world.isBlockNormalCube(x, y + 1, z))          return null;
		if (BlockChest.#isOcelotBlockingChest(world, x, y, z)) return null;

		const id = this.blockID;

		// Check each double-chest partner — null out if it's also blocked
		if (world.getBlockId(x - 1, y, z) === id &&
			(world.isBlockNormalCube(x - 1, y + 1, z) || BlockChest.#isOcelotBlockingChest(world, x - 1, y, z))) return null;
		if (world.getBlockId(x + 1, y, z) === id &&
			(world.isBlockNormalCube(x + 1, y + 1, z) || BlockChest.#isOcelotBlockingChest(world, x + 1, y, z))) return null;
		if (world.getBlockId(x, y, z - 1) === id &&
			(world.isBlockNormalCube(x, y + 1, z - 1) || BlockChest.#isOcelotBlockingChest(world, x, y, z - 1))) return null;
		if (world.getBlockId(x, y, z + 1) === id &&
			(world.isBlockNormalCube(x, y + 1, z + 1) || BlockChest.#isOcelotBlockingChest(world, x, y, z + 1))) return null;

		// Merge with adjacent half to form a double chest
		if (world.getBlockId(x - 1, y, z) === id)
			inv = new InventoryLargeChest('container.chestDouble', world.getBlockTileEntity(x - 1, y, z), inv);
		if (world.getBlockId(x + 1, y, z) === id)
			inv = new InventoryLargeChest('container.chestDouble', inv, world.getBlockTileEntity(x + 1, y, z));
		if (world.getBlockId(x, y, z - 1) === id)
			inv = new InventoryLargeChest('container.chestDouble', world.getBlockTileEntity(x, y, z - 1), inv);
		if (world.getBlockId(x, y, z + 1) === id)
			inv = new InventoryLargeChest('container.chestDouble', inv, world.getBlockTileEntity(x, y, z + 1));

		return inv;
	}

	// -------------------------------------------------------------------------
	// Redstone (trapped chest)
	// -------------------------------------------------------------------------

	isProvidingWeakPower(access, x, y, z, side) {
		if (!this.canProvidePower()) return 0;
		const players = access.getBlockTileEntity(x, y, z).numUsingPlayers;
		return MathHelper.clamp_int(players, 0, 15);
	}

	isProvidingStrongPower(access, x, y, z, side) {
		return side === 1 ? this.isProvidingWeakPower(access, x, y, z, side) : 0;
	}

	getComparatorInputOverride(world, x, y, z, side) {
		return Container.calcRedstoneFromInventory(this.getInventory(world, x, y, z));
	}

	// -------------------------------------------------------------------------
	// Private helpers
	// -------------------------------------------------------------------------

	/**
	 * Returns true if the block at (x,y,z) is this chest type AND that chest
	 * already has at least one same-type neighbour (i.e. it's part of a double
	 * chest), which would prevent a third chest from joining.
	 */
	#isThereANeighborChest(world, x, y, z) {
		if (world.getBlockId(x, y, z) !== this.blockID) return false;
		const id = this.blockID;
		return world.getBlockId(x - 1, y, z) === id
			|| world.getBlockId(x + 1, y, z) === id
			|| world.getBlockId(x, y, z - 1) === id
			|| world.getBlockId(x, y, z + 1) === id;
	}

	/**
	 * Returns true if a sitting ocelot is present in the 1×1×1 space directly
	 * above the chest, which prevents the chest from being opened.
	 */
    static #isOcelotBlockingChest(world, x, y, z) {
		const ocelots = world.getEntitiesWithinAABB(
			EntityOcelot,
			AxisAlignedBB.getAABBPool().getAABB(x, y + 1, z, x + 1, y + 2, z + 1),
		);
		return ocelots.some(o => o.isSitting());
	}
}