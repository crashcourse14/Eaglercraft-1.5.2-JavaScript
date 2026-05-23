// BlockBreakable.js
import { Block } from './Block.js';

export class BlockBreakable extends Block {
	#localFlag;
	#breakableBlockIcon;

	constructor(id, iconName, material, localFlag) {
		super(id, material);
		this.#localFlag = localFlag;
		this.#breakableBlockIcon = iconName;
	}

	isOpaqueCube() { return false; }

	/**
	 * Hides shared faces between two adjacent blocks of the same type
	 * unless localFlag is set (e.g. glass renders borders, ice does not).
	 */
	shouldSideBeRendered(access, x, y, z, side) {
		const neighborId = access.getBlockId(x, y, z);
		if (!this.#localFlag && neighborId === this.blockID) return false;
		return super.shouldSideBeRendered(access, x, y, z, side);
	}

    registerIcons(reg) {
        this.blockIcon = reg.registerIcon(this.#breakableBlockIcon);
    }
}