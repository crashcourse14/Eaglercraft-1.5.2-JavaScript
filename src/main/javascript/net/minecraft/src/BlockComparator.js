// BlockComparator.js
import { BlockRedstoneLogic } from './BlockRedstoneLogic.js';
import { Block } from './Block.js';
import { Item } from './Item.js';
import { Direction } from './Direction.js';
import { TileEntityComparator } from './TileEntityComparator.js';

export class BlockComparator extends BlockRedstoneLogic {
	constructor(id, powered) {
		super(id, powered);
		this.isBlockContainer = true;
	}

	// -------------------------------------------------------------------------
	// Basic overrides
	// -------------------------------------------------------------------------

	idDropped(meta, rng, fortune) { return Item.comparator.itemID; }
	idPicked(world, x, y, z)     { return Item.comparator.itemID; }
	getRenderType()               { return 37; }

	createNewTileEntity(world) {
		return new TileEntityComparator();
	}

	getTileEntityComparator(access, x, y, z) {
		return access.getBlockTileEntity(x, y, z);
	}

	registerIcons(reg) {
		this.blockIcon = reg.registerIcon(this.isRepeaterPowered ? 'comparator_lit' : 'comparator');
	}

	// -------------------------------------------------------------------------
	// Active / idle block references (used by parent class)
	// -------------------------------------------------------------------------

	/** Returns the powered (active) comparator block */
	getActiveBlock()  { return Block.redstoneComparatorActive; }  // formerly func_94485_e
	/** Returns the unpowered (idle) comparator block */
	getIdleBlock()    { return Block.redstoneComparatorIdle; }     // formerly func_94484_i

	// -------------------------------------------------------------------------
	// Textures
	// -------------------------------------------------------------------------

	getIcon(side, meta) {
		const lit = this.isRepeaterPowered || (meta & 8) !== 0;
		if (side === 0) {
			return lit
				? Block.torchRedstoneActive.getBlockTextureFromSide(0)
				: Block.torchRedstoneIdle.getBlockTextureFromSide(0);
		}
		if (side === 1) {
			return lit ? Block.redstoneComparatorActive.blockIcon : this.blockIcon;
		}
		return Block.stoneDoubleSlab.getBlockTextureFromSide(1);
	}

	// -------------------------------------------------------------------------
	// Comparator mode and output
	// -------------------------------------------------------------------------

	/** Returns the tick delay for this comparator (always 2) */
	getTickDelay(meta) { return 2; }  // formerly func_94481_j_

	/** Returns true if the comparator is in subtraction mode (bit 2 set) */
	isInSubtractionMode(meta) { return (meta & 4) === 4; }  // formerly func_94490_c

	/** Returns true if the output should be powered given the current inputs */
	isOutputPowered(meta) {            // formerly func_96470_c
		return this.isRepeaterPowered || (meta & 8) !== 0;
	}

	/**
	 * Computes the output signal strength for the current mode.
	 * Subtraction mode: max(front - side, 0). Comparison mode: front input as-is.
	 * (formerly func_94491_m)
	 */
	#computeOutput(world, x, y, z, meta) {
		return this.isInSubtractionMode(meta)
			? Math.max(this.getInputStrength(world, x, y, z, meta) - this.getSideInputStrength(world, x, y, z, meta), 0)
			: this.getInputStrength(world, x, y, z, meta);
	}

	/**
	 * Returns true if the comparator's output should be active:
	 * - always active at signal 15
	 * - inactive at signal 0
	 * - otherwise active when front >= side (comparison mode)
	 * (formerly func_94478_d)
	 */
	#shouldBeActive(world, x, y, z, meta) {
		const front = this.getInputStrength(world, x, y, z, meta);
		if (front >= 15) return true;
		if (front === 0)  return false;
		const side = this.getSideInputStrength(world, x, y, z, meta);
		return side === 0 || front >= side;
	}

	/**
	 * Returns the stored output value from the tile entity.
	 * (formerly func_94480_d)
	 */
	getStoredOutput(access, x, y, z, meta) {
		return this.getTileEntityComparator(access, x, y, z).func_96100_a();
	}

	// -------------------------------------------------------------------------
	// Signal strength
	// -------------------------------------------------------------------------

	/**
	 * Checks the block directly in front for a comparator override signal,
	 * or looks one block further if separated by a normal cube.
	 */
	getInputStrength(world, x, y, z, meta) {
		let strength = super.getInputStrength(world, x, y, z, meta);
		const dir    = BlockComparator.getDirection(meta);
		let bx       = x + Direction.offsetX[dir];
		let bz       = z + Direction.offsetZ[dir];
		let id       = world.getBlockId(bx, y, bz);

		if (id > 0) {
			const block = Block.blocksList[id];
			if (block.hasComparatorInputOverride()) {
				strength = block.getComparatorInputOverride(world, bx, y, bz, Direction.rotateOpposite[dir]);
			} else if (strength < 15 && Block.isNormalCube(id)) {
				bx += Direction.offsetX[dir];
				bz += Direction.offsetZ[dir];
				id  = world.getBlockId(bx, y, bz);
				if (id > 0 && Block.blocksList[id].hasComparatorInputOverride()) {
					strength = Block.blocksList[id].getComparatorInputOverride(world, bx, y, bz, Direction.rotateOpposite[dir]);
				}
			}
		}

		return strength;
	}

	// -------------------------------------------------------------------------
	// Activation / ticking
	// -------------------------------------------------------------------------

	/**
	 * Toggles between comparison and subtraction mode on right-click,
	 * preserving the power state bits.
	 */
	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) {
		const meta      = world.getBlockMetadata(x, y, z);
		const powered   = this.isRepeaterPowered || (meta & 8) !== 0;
		const subtract  = !this.isInSubtractionMode(meta); // toggle mode
		const newMeta   = (subtract ? 4 : 0) | (powered ? 8 : 0) | (meta & 3);

		world.playSoundEffect(x + 0.5, y + 0.5, z + 0.5, 'random.click', 0.3, subtract ? 0.55 : 0.5);
		world.setBlockMetadataWithNotify(x, y, z, newMeta, 2);
		this.#updateOutput(world, x, y, z, world.rand);
		return true;
	}

	/**
	 * Schedules a tick if the output or power state has changed.
	 * (formerly func_94479_f)
	 */
	scheduleUpdateIfNeeded(world, x, y, z, meta) {
		if (!world.isBlockTickScheduled(x, y, z, this.blockID)) {
			const currentMeta   = world.getBlockMetadata(x, y, z);
			const newOutput     = this.#computeOutput(world, x, y, z, currentMeta);
			const storedOutput  = this.getTileEntityComparator(world, x, y, z).func_96100_a();
			const newActive     = this.#shouldBeActive(world, x, y, z, currentMeta);
			const currentActive = this.isOutputPowered(currentMeta);

			if (newOutput !== storedOutput || currentActive !== newActive) {
				const highPriority = this.isHighPriority(world, x, y, z, currentMeta);
				world.func_82740_a(x, y, z, this.blockID, this.getTickDelay(0), highPriority ? -1 : 0);
			}
		}
	}

	/**
	 * Recalculates and applies the comparator's output signal, updating the tile
	 * entity and toggling the powered metadata bit as needed.
	 * (formerly func_96476_c)
	 */
	#updateOutput(world, x, y, z, rng) {
		const meta        = world.getBlockMetadata(x, y, z);
		const newOutput   = this.#computeOutput(world, x, y, z, meta);
		const tile        = this.getTileEntityComparator(world, x, y, z);
		const storedOutput = tile.func_96100_a();
		tile.func_96099_a(newOutput);

		if (storedOutput !== newOutput || !this.isInSubtractionMode(meta)) {
			const shouldBeActive = this.#shouldBeActive(world, x, y, z, meta);
			const isPowered      = this.isRepeaterPowered || (meta & 8) !== 0;

			if (isPowered && !shouldBeActive) {
				world.setBlockMetadataWithNotify(x, y, z, meta & -9, 2);
			} else if (!isPowered && shouldBeActive) {
				world.setBlockMetadataWithNotify(x, y, z, meta | 8, 2);
			}

			this.notifyNeighbours(world, x, y, z);
		}
	}

	updateTick(world, x, y, z, rng) {
		if (this.isRepeaterPowered) {
			const meta = world.getBlockMetadata(x, y, z);
			world.setBlock(x, y, z, this.getIdleBlock().blockID, meta | 8, 4);
		}
		this.#updateOutput(world, x, y, z, rng);
	}

	// -------------------------------------------------------------------------
	// Lifecycle
	// -------------------------------------------------------------------------

	onBlockAdded(world, x, y, z) {
		super.onBlockAdded(world, x, y, z);
		world.setBlockTileEntity(x, y, z, this.createNewTileEntity(world));
	}

	breakBlock(world, x, y, z, id, meta) {
		super.breakBlock(world, x, y, z, id, meta);
		world.removeBlockTileEntity(x, y, z);
		this.notifyNeighbours(world, x, y, z);
	}

	onBlockEventReceived(world, x, y, z, eventId, eventParam) {
		super.onBlockEventReceived(world, x, y, z, eventId, eventParam);
		const tile = world.getBlockTileEntity(x, y, z);
		return tile !== null ? tile.receiveClientEvent(eventId, eventParam) : false;
	}
}