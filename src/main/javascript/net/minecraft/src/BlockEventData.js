// BlockEventData.js
export class BlockEventData {
	#coordX;
	#coordY;
	#coordZ;
	#blockID;
	/** Different for each blockID */
	#eventID;
	/** Different for each blockID and eventID */
	#eventParameter;

	constructor(x, y, z, blockID, eventID, eventParameter) {
		this.#coordX          = x;
		this.#coordY          = y;
		this.#coordZ          = z;
		this.#blockID         = blockID;
		this.#eventID         = eventID;
		this.#eventParameter  = eventParameter;
	}

	getX()              { return this.#coordX; }
	getY()              { return this.#coordY; }
	getZ()              { return this.#coordZ; }
	getBlockID()        { return this.#blockID; }
	getEventID()        { return this.#eventID; }
	getEventParameter() { return this.#eventParameter; }

	equals(other) {
		if (!(other instanceof BlockEventData)) return false;
		return this.#coordX         === other.#coordX
			&& this.#coordY         === other.#coordY
			&& this.#coordZ         === other.#coordZ
			&& this.#blockID        === other.#blockID
			&& this.#eventID        === other.#eventID
			&& this.#eventParameter === other.#eventParameter;
	}

	toString() {
		return `TE(${this.#coordX},${this.#coordY},${this.#coordZ}),${this.#eventID},${this.#eventParameter},${this.#blockID}`;
	}
}