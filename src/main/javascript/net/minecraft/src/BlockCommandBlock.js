// BlockCommandBlock.js
import { BlockContainer } from './BlockContainer.js';
import { Material } from './Material.js';
import { TileEntityCommandBlock } from './TileEntityCommandBlock.js';

export class BlockCommandBlock extends BlockContainer {
	constructor(id) {
		super(id, Material.iron);
	}

	createNewTileEntity(world) {
		return new TileEntityCommandBlock();
	}

	tickRate(world) { return 1; }
	hasComparatorInputOverride() { return true; }

	updateTick(world, x, y, z, rng) {
		const tile = world.getBlockTileEntity(x, y, z);
		if (tile instanceof TileEntityCommandBlock) {
			tile.func_96102_a(tile.executeCommandOnPowered(world));
			world.func_96440_m(x, y, z, this.blockID);
		}
	}

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) {
		const tile = world.getBlockTileEntity(x, y, z);
		if (tile !== null) player.displayGUIEditSign(tile);
		return true;
	}

	getComparatorInputOverride(world, x, y, z, side) {
		const tile = world.getBlockTileEntity(x, y, z);
		return tile instanceof TileEntityCommandBlock ? tile.func_96103_d() : 0;
	}

	onBlockPlacedBy(world, x, y, z, entity, stack) {
		if (stack.hasDisplayName()) {
			world.getBlockTileEntity(x, y, z).setCommandSenderName(stack.getDisplayName());
		}
	}
}