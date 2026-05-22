// AABBPool.js
import { AxisAlignedBB } from './AxisAlignedBB.js';

export class AABBPool {
  /** Maximum number of times the pool can be "cleaned" before the list is shrunk */
  #maxNumCleans;
  /** Number of Pool entries to remove when cleanPool is called maxNumCleans times */
  #numEntriesToRemove;
  /** List of AABB stored in this Pool */
  #listAABB = [];
  /** Next index to use when adding a Pool Entry */
  #nextPoolIndex = 0;
  /** Largest index reached by this Pool (can be reset to 0 upon calling cleanPool) */
  #maxPoolIndex = 0;
  /** Number of times this Pool has been cleaned */
  #numCleans = 0;

  constructor(maxNumCleans, numEntriesToRemove) {
    this.#maxNumCleans = maxNumCleans;
    this.#numEntriesToRemove = numEntriesToRemove;
  }

  /**
   * Creates a new AABB, or reuses one that's no longer in use.
   * AABBs returned from this function should only be used for one frame or tick,
   * as after that they will be reused.
   */
  getAABB(minX, minY, minZ, maxX, maxY, maxZ) {
    let aabb;
    if (this.#nextPoolIndex >= this.#listAABB.length) {
      aabb = new AxisAlignedBB(minX, minY, minZ, maxX, maxY, maxZ);
      this.#listAABB.push(aabb);
    } else {
      aabb = this.#listAABB[this.#nextPoolIndex];
      aabb.setBounds(minX, minY, minZ, maxX, maxY, maxZ);
    }
    ++this.#nextPoolIndex;
    return aabb;
  }

  /**
   * Marks the pool as "empty", starting over when adding new entries.
   * If this is called maxNumCleans times, the list size is reduced.
   */
  cleanPool() {
    if (this.#nextPoolIndex > this.#maxPoolIndex) {
      this.#maxPoolIndex = this.#nextPoolIndex;
    }
    if (this.#numCleans++ === this.#maxNumCleans) {
      const targetSize = Math.max(
        this.#maxPoolIndex,
        this.#listAABB.length - this.#numEntriesToRemove
      );
      this.#listAABB.splice(targetSize);
      this.#maxPoolIndex = 0;
      this.#numCleans = 0;
    }
    this.#nextPoolIndex = 0;
  }

  /** Clears the AABBPool */
  clearPool() {
    this.#nextPoolIndex = 0;
    this.#listAABB.length = 0;
  }

  get listAABBSize() {
    return this.#listAABB.length;
  }

  get nextPoolIndex() {
    return this.#nextPoolIndex;
  }
}