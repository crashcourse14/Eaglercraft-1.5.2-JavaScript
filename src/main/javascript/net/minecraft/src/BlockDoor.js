// BlockDoor.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { Item } from './Item.js';
import { IconFlipped } from './IconFlipped.js';

export class BlockDoor extends Block {
	static #doorIconNames = ['doorWood_lower', 'doorWood_upper', 'doorIron_lower', 'doorIron_upper'];

	/** Index into iconArray for this door's base icons (0 = wood, 2 = iron) */
	#doorTypeForIcon;
	#iconArray = null;

	constructor(id, material) {
		super(id, material);
		this.#doorTypeForIcon = material === Material.iron ? 2 : 0;
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
	}

	isOpaqueCube()        { return false; }
	renderAsNormalBlock() { return false; }
	getMobilityFlag()     { return 1; }
	getRenderType()       { return 7; }
	onBlockClicked(world, x, y, z, player) {}

	idDropped(meta, rng, fortune) {
		if ((meta & 8) !== 0) return 0; // head half drops nothing
		return this.blockMaterial === Material.iron ? Item.doorIron.itemID : Item.doorWood.itemID;
	}

	idPicked(world, x, y, z) {
		return this.blockMaterial === Material.iron ? Item.doorIron.itemID : Item.doorWood.itemID;
	}

	canPlaceBlockAt(world, x, y, z) {
		return y < 255
			&& world.doesBlockHaveSolidTopSurface(x, y - 1, z)
			&& super.canPlaceBlockAt(world, x, y, z)
			&& super.canPlaceBlockAt(world, x, y + 1, z);
	}

	// -------------------------------------------------------------------------
	// Textures
	// -------------------------------------------------------------------------

	registerIcons(reg) {
		const names = BlockDoor.#doorIconNames;
		this.#iconArray = new Array(names.length * 2);
		for (let i = 0; i < names.length; ++i) {
			this.#iconArray[i] = reg.registerIcon(names[i]);
			this.#iconArray[i + names.length] = new IconFlipped(this.#iconArray[i], true, false);
		}
	}

	getIcon(side, meta) {
		return this.#iconArray[this.#doorTypeForIcon];
	}

	/**
	 * Returns the correct face texture, accounting for door facing, open/closed
	 * state, and hinge side (which causes the texture to be mirrored).
	 */
	getBlockTexture(access, x, y, z, side) {
		if (side === 0 || side === 1) {
			return this.#iconArray[this.#doorTypeForIcon];
		}

		const fullMeta  = this.getFullMetadata(access, x, y, z);
		const facing    = fullMeta & 3;
		const isOpen    = (fullMeta & 4) !== 0;
		const isTop     = (fullMeta & 8) !== 0;
		const mirrorBit = (fullMeta & 16) !== 0;
		let   mirrored  = false;

		if (isOpen) {
			if (facing === 0 && side === 2) mirrored = !mirrored;
			if (facing === 1 && side === 5) mirrored = !mirrored;
			if (facing === 2 && side === 3) mirrored = !mirrored;
			if (facing === 3 && side === 4) mirrored = !mirrored;
		} else {
			if (facing === 0 && side === 5) mirrored = !mirrored;
			if (facing === 1 && side === 3) mirrored = !mirrored;
			if (facing === 2 && side === 4) mirrored = !mirrored;
			if (facing === 3 && side === 2) mirrored = !mirrored;
			if (mirrorBit) mirrored = !mirrored;
		}

		const base   = this.#doorTypeForIcon;
		const half   = isTop ? 1 : 0;                            // 0 = lower, 1 = upper
		const flip   = mirrored ? BlockDoor.#doorIconNames.length : 0;
		return this.#iconArray[base + half + flip];
	}

	// -------------------------------------------------------------------------
	// Bounds
	// -------------------------------------------------------------------------

	setBlockBoundsBasedOnState(access, x, y, z) {
		this.#setDoorRotation(this.getFullMetadata(access, x, y, z));
	}

	getCollisionBoundingBoxFromPool(world, x, y, z) {
		this.setBlockBoundsBasedOnState(world, x, y, z);
		return super.getCollisionBoundingBoxFromPool(world, x, y, z);
	}

	getSelectedBoundingBoxFromPool(world, x, y, z) {
		this.setBlockBoundsBasedOnState(world, x, y, z);
		return super.getSelectedBoundingBoxFromPool(world, x, y, z);
	}

	collisionRayTrace(world, x, y, z, start, end) {
		this.setBlockBoundsBasedOnState(world, x, y, z);
		return super.collisionRayTrace(world, x, y, z, start, end);
	}

	/**
	 * Sets the thin-panel bounds for the door based on its facing and open state.
	 * thickness = 3/16 of a block.
	 */
	#setDoorRotation(meta) {
		const t      = 0.1875; // panel thickness
		const facing = meta & 3;
		const isOpen = (meta & 4)  !== 0;
		const mirrorHinge = (meta & 16) !== 0;

		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 2.0, 1.0);

		if (facing === 0) {
			if (isOpen) this.setBlockBounds(0.0, 0.0, mirrorHinge ? 1-t : 0, 1.0, 1.0, mirrorHinge ? 1.0 : t);
			else        this.setBlockBounds(0.0, 0.0, 0.0,   t, 1.0, 1.0);
		} else if (facing === 1) {
			if (isOpen) this.setBlockBounds(mirrorHinge ? 0 : 1-t, 0.0, 0.0, mirrorHinge ? t : 1.0, 1.0, 1.0);
			else        this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 1.0, t);
		} else if (facing === 2) {
			if (isOpen) this.setBlockBounds(0.0, 0.0, mirrorHinge ? 0 : 1-t, 1.0, 1.0, mirrorHinge ? t : 1.0);
			else        this.setBlockBounds(1-t, 0.0, 0.0, 1.0, 1.0, 1.0);
		} else if (facing === 3) {
			if (isOpen) this.setBlockBounds(mirrorHinge ? 1-t : 0, 0.0, 0.0, mirrorHinge ? 1.0 : t, 1.0, 1.0);
			else        this.setBlockBounds(0.0, 0.0, 1-t,  1.0, 1.0, 1.0);
		}
	}

	// -------------------------------------------------------------------------
	// State queries
	// -------------------------------------------------------------------------

	getDoorOrientation(access, x, y, z) {
		return this.getFullMetadata(access, x, y, z) & 3;
	}

	isDoorOpen(access, x, y, z) {
		return (this.getFullMetadata(access, x, y, z) & 4) !== 0;
	}

	getBlocksMovement(access, x, y, z) {
		return (this.getFullMetadata(access, x, y, z) & 4) !== 0;
	}

	/**
	 * Combines the lower-half metadata (facing + open state) with the upper-half
	 * metadata (hinge side) into a single 5-bit value:
	 *   bits 0–1: facing, bit 2: open, bit 3: is upper half, bit 4: hinge side
	 */
	getFullMetadata(access, x, y, z) {
		const meta   = access.getBlockMetadata(x, y, z);
		const isTop  = (meta & 8) !== 0;
		const lower  = isTop ? access.getBlockMetadata(x, y - 1, z) : meta;
		const upper  = isTop ? meta : access.getBlockMetadata(x, y + 1, z);
		const hinge  = (upper & 1) !== 0;
		return (lower & 7) | (isTop ? 8 : 0) | (hinge ? 16 : 0);
	}

	// -------------------------------------------------------------------------
	// Activation / powering
	// -------------------------------------------------------------------------

	onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) {
		if (this.blockMaterial === Material.iron) return true;

		const fullMeta = this.getFullMetadata(world, x, y, z);
		const newMeta  = (fullMeta & 7) ^ 4; // toggle open bit
		const isTop    = (fullMeta & 8) !== 0;

		if (!isTop) {
			world.setBlockMetadataWithNotify(x, y,     z, newMeta, 2);
			world.markBlockRangeForRenderUpdate(x, y,     z, x, y,     z);
		} else {
			world.setBlockMetadataWithNotify(x, y - 1, z, newMeta, 2);
			world.markBlockRangeForRenderUpdate(x, y - 1, z, x, y,     z);
		}

		world.playAuxSFXAtEntity(player, 1003, x, y, z, 0);
		return true;
	}

	/** Opens or closes the door in response to a redstone signal change */
	onPoweredBlockChange(world, x, y, z, powered) {
		const fullMeta = this.getFullMetadata(world, x, y, z);
		const isOpen   = (fullMeta & 4) !== 0;
		if (isOpen === powered) return;

		const newMeta = (fullMeta & 7) ^ 4;
		const isTop   = (fullMeta & 8) !== 0;

		if (!isTop) {
			world.setBlockMetadataWithNotify(x, y,     z, newMeta, 2);
			world.markBlockRangeForRenderUpdate(x, y,     z, x, y,     z);
		} else {
			world.setBlockMetadataWithNotify(x, y - 1, z, newMeta, 2);
			world.markBlockRangeForRenderUpdate(x, y - 1, z, x, y,     z);
		}

		world.playAuxSFXAtEntity(null, 1003, x, y, z, 0);
	}

	onNeighborBlockChange(world, x, y, z, neighborId) {
		const meta  = world.getBlockMetadata(x, y, z);
		const isTop = (meta & 8) !== 0;

		if (!isTop) {
			// Lower half checks
			let destroyed = false;

			if (world.getBlockId(x, y + 1, z) !== this.blockID) {
				world.setBlockToAir(x, y, z);
				destroyed = true;
			}

			if (!world.doesBlockHaveSolidTopSurface(x, y - 1, z)) {
				world.setBlockToAir(x, y, z);
				destroyed = true;
				if (world.getBlockId(x, y + 1, z) === this.blockID) {
					world.setBlockToAir(x, y + 1, z);
				}
			}

			if (!destroyed) {
				const powered = world.isBlockIndirectlyGettingPowered(x, y, z)
				             || world.isBlockIndirectlyGettingPowered(x, y + 1, z);
				const neighborCanPower = neighborId > 0 && Block.blocksList[neighborId].canProvidePower();

				if ((powered || neighborCanPower) && neighborId !== this.blockID) {
					this.onPoweredBlockChange(world, x, y, z, powered);
				}
			}
		} else {
			// Upper half checks
			if (world.getBlockId(x, y - 1, z) !== this.blockID) {
				world.setBlockToAir(x, y, z);
			}

			if (neighborId > 0 && neighborId !== this.blockID) {
				this.onNeighborBlockChange(world, x, y - 1, z, neighborId);
			}
		}
	}

	onBlockHarvested(world, x, y, z, meta, player) {
		if (player.capabilities.isCreativeMode
				&& (meta & 8) !== 0
				&& world.getBlockId(x, y - 1, z) === this.blockID) {
			world.setBlockToAir(x, y - 1, z);
		}
	}
}