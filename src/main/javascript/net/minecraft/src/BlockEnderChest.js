// BlockEnderChest.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { CreativeTabs } from './CreativeTabs.js';
import { Block } from './Block.js';
import { MathHelper } from './MathHelper.js';
import { TileEntityEnderChest } from './TileEntityEnderChest.js';

export class BlockEnderChest extends BlockContainer {
	constructor(id) {
		super(id, Material.rock);
		this.setCreativeTab(CreativeTabs.tabDecorations);
		this.setBlockBounds(0.0625, 0.0, 0.0625, 0.9375, 0.875, 0.9375);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	canSilkHarvest()      { return true; }
	getRenderType()       { return 22; }

	idDropped(meta, rng, fortune) { return Block.obsidian.blockID; }
	quantityDropped(rng)          { return 8; }

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return true; }

	createNewTileEntity(world) {
		return new TileEntityEnderChest();
	}

	registerIcons(reg) {
		this.blockIcon = reg.registerIcon('obsidian');
	}

	/** Maps yaw index to facing metadata: 0→2(N), 1→5(E), 2→3(S), 3→4(W) */
	onBlockPlacedBy(world, x, y, z, entity, stack) {
		const yawIndex = MathHelper.floor_double(entity.rotationYaw * 4.0 / 360.0 + 0.5) & 3;
		const facing   = [2, 5, 3, 4][yawIndex];
		world.setBlockMetadataWithNotify(x, y, z, facing, 2);
	}

	/**
	 * Spawns 3 portal particles per tick around the chest.
	 * Each particle is offset along a randomly chosen axis with a small
	 * velocity nudge in the same direction.
	 *
	 * Note: the original Java code contains several dead assignments
	 * (var10000 is overwritten before use); the particle positions below
	 * match the final computed values actually passed to spawnParticle.
	 */
	randomDisplayTick(world, x, y, z, rng) {
		for (let i = 0; i < 3; ++i) {
			const signX = rng.nextInt(2) * 2 - 1; // ±1
			const signZ = rng.nextInt(2) * 2 - 1; // ±1

			const px = x + 0.5 + 0.25 * signX;
			const py = y + rng.nextFloat();
			const pz = z + 0.5 + 0.25 * signZ;

			const vx = rng.nextFloat() * signX;
			const vy = (rng.nextFloat() - 0.5) * 0.125;
			const vz = rng.nextFloat() * signZ;

		    world.spawnParticle('portal', px, py, pz, vx, vy, vz);
		}
	}
}