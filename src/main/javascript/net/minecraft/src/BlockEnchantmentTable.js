// BlockEnchantmentTable.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { Block } from './Block.js';
import { TileEntityEnchantmentTable } from './TileEntityEnchantmentTable.js';

export class BlockEnchantmentTable extends BlockContainer {
	#topIcon    = null;
	#bottomIcon = null;

	constructor(id) {
		super(id, Material.rock);
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.75, 1.0);
		this.setLightOpacity(0);
		this.setCreativeTab(CreativeTabs.tabDecorations);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }

	getIcon(side, meta) {
		if (side === 0) return this.#bottomIcon;
		if (side === 1) return this.#topIcon;
		return this.blockIcon;
	}

	registerIcons(reg) {
		this.blockIcon   = reg.registerIcon('enchantment_side');
		this.#topIcon    = reg.registerIcon('enchantment_top');
		this.#bottomIcon = reg.registerIcon('enchantment_bottom');
	}

	createNewTileEntity(world) {
		return new TileEntityEnchantmentTable();
	}

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

	onBlockPlacedBy(world, x, y, z, entity, stack) {
		super.onBlockPlacedBy(world, x, y, z, entity, stack);
		if (stack.hasDisplayName()) {
			world.getBlockTileEntity(x, y, z).func_94134_a(stack.getDisplayName());
		}
	}

	/**
	 * Spawns enchantment table particles that drift from nearby bookshelves
	 * toward the table. Only bookshelf blocks with a clear line-of-sight
	 * through the midpoint to the table will spawn particles.
	 */
	randomDisplayTick(world, x, y, z, rng) {
		super.randomDisplayTick(world, x, y, z, rng);

		for (let bx = x - 2; bx <= x + 2; ++bx) {
			for (let bz = z - 2; bz <= z + 2; ++bz) {
				// Skip the inner 3×3 ring (only check the outer border)
				if (bx > x - 2 && bx < x + 2 && bz === z - 1) {
					bz = z + 2;
				}

				if (rng.nextInt(16) !== 0) continue;

				// Check both the table level and one above for bookshelves
				for (let by = y; by <= y + 1; ++by) {
					if (world.getBlockId(bx, by, bz) !== Block.bookShelf.blockID) continue;

					// Bookshelf must have a clear path at the midpoint to the table
					const midX = Math.trunc((bx - x) / 2) + x;
					const midZ = Math.trunc((bz - z) / 2) + z;
					if (!world.isAirBlock(midX, by, midZ)) break;

					world.spawnParticle(
						'enchantmenttable',
						x + 0.5, y + 2.0, z + 0.5,
						(bx - x) + rng.nextFloat() - 0.5,
						(by - y) - rng.nextFloat() - 1.0,
						(bz - z) + rng.nextFloat() - 0.5,
					);
				}
			}
		}
	}
}