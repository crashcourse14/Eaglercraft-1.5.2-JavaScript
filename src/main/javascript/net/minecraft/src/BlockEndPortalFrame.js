// BlockEndPortalFrame.js
import { Block } from './Block.js';
import { Material } from './Material.js';
import { MathHelper } from './MathHelper.js';

export class BlockEndPortalFrame extends Block {
	#topIcon = null;
	#eyeIcon = null;

	constructor(id) {
		super(id, Material.rock);
	}

	isOpaqueCube() { return false; }
	getRenderType() { return 26; }
	idDropped(meta, rng, fortune) { return 0; }

	registerIcons(reg) {
		this.blockIcon = reg.registerIcon('endframe_side');
		this.#topIcon  = reg.registerIcon('endframe_top');
		this.#eyeIcon  = reg.registerIcon('endframe_eye');
	}

	getIcon(side, meta) {
		if (side === 1) return this.#topIcon;
		if (side === 0) return Block.whiteStone.getBlockTextureFromSide(side);
		return this.blockIcon;
	}

	/** Returns the ender eye icon, used by the renderer when an eye is inserted */
	getEyeIcon() { return this.#eyeIcon; }

	setBlockBoundsForItemRender() {
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.8125, 1.0);
	}

	/**
	 * Two collision boxes: the main frame body, and a smaller box for the
	 * ender eye sitting on top when one has been inserted.
	 */
	addCollisionBoxesToList(world, x, y, z, mask, list, entity) {
		this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 0.8125, 1.0);
		super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);

		if (BlockEndPortalFrame.isEnderEyeInserted(world.getBlockMetadata(x, y, z))) {
			this.setBlockBounds(0.3125, 0.8125, 0.3125, 0.6875, 1.0, 0.6875);
			super.addCollisionBoxesToList(world, x, y, z, mask, list, entity);
		}

		this.setBlockBoundsForItemRender();
	}

	/** Returns true if bit 2 of the metadata is set (an ender eye has been placed) */
	static isEnderEyeInserted(meta) {
		return (meta & 4) !== 0;
	}

	/**
	 * Facing is encoded as (yawIndex + 2) % 4, pointing the frame
	 * away from the placer toward the portal centre.
	 */
	onBlockPlacedBy(world, x, y, z, entity, stack) {
		const facing = (MathHelper.floor_double(entity.rotationYaw * 4.0 / 360.0 + 0.5) & 3 + 2) % 4;
		world.setBlockMetadataWithNotify(x, y, z, facing, 2);
	}
}