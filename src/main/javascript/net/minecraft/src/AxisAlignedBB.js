// AxisAlignedBB.js
import { AABBLocalPool } from './AABBLocalPool.js';
import { MovingObjectPosition } from './MovingObjectPosition.js';

/** ThreadLocal AABBPool — single-threaded JS uses the singleton directly */
const theAABBLocalPool = new AABBLocalPool();

export class AxisAlignedBB {
  minX; minY; minZ;
  maxX; maxY; maxZ;

  /** Returns a new bounding box with the specified bounds */
  static getBoundingBox(minX, minY, minZ, maxX, maxY, maxZ) {
    return new AxisAlignedBB(minX, minY, minZ, maxX, maxY, maxZ);
  }

  /** Gets the AABBPool (mirrors Java's ThreadLocal accessor) */
  static getAABBPool() {
    return theAABBLocalPool.getValue();
  }

  constructor(minX, minY, minZ, maxX, maxY, maxZ) {
    this.minX = minX; this.minY = minY; this.minZ = minZ;
    this.maxX = maxX; this.maxY = maxY; this.maxZ = maxZ;
  }

  /** Sets the bounds of the bounding box */
  setBounds(minX, minY, minZ, maxX, maxY, maxZ) {
    this.minX = minX; this.minY = minY; this.minZ = minZ;
    this.maxX = maxX; this.maxY = maxY; this.maxZ = maxZ;
    return this;
  }

  /**
   * Expands the bounding box to include the given coordinate offset,
   * extending only the min/max side that the offset points toward.
   */
  addCoord(x, y, z) {
    let minX = this.minX, minY = this.minY, minZ = this.minZ;
    let maxX = this.maxX, maxY = this.maxY, maxZ = this.maxZ;
    if (x < 0) minX += x; else if (x > 0) maxX += x;
    if (y < 0) minY += y; else if (y > 0) maxY += y;
    if (z < 0) minZ += z; else if (z > 0) maxZ += z;
    return AxisAlignedBB.getAABBPool().getAABB(minX, minY, minZ, maxX, maxY, maxZ);
  }

  /** Returns a bounding box expanded by the specified amounts on all sides */
  expand(x, y, z) {
    return AxisAlignedBB.getAABBPool().getAABB(
      this.minX - x, this.minY - y, this.minZ - z,
      this.maxX + x, this.maxY + y, this.maxZ + z,
    );
  }

  /** Returns a new bounding box offset by the specified vector */
  getOffsetBoundingBox(x, y, z) {
    return AxisAlignedBB.getAABBPool().getAABB(
      this.minX + x, this.minY + y, this.minZ + z,
      this.maxX + x, this.maxY + y, this.maxZ + z,
    );
  }

  /**
   * If this and the given BB overlap on Y and Z, returns the closest X offset
   * that keeps them separated; otherwise returns the original offset unchanged.
   */
  calculateXOffset(other, offset) {
    if (other.maxY <= this.minY || other.minY >= this.maxY) return offset;
    if (other.maxZ <= this.minZ || other.minZ >= this.maxZ) return offset;
    if (offset > 0 && other.maxX <= this.minX) {
      const gap = this.minX - other.maxX;
      if (gap < offset) offset = gap;
    }
    if (offset < 0 && other.minX >= this.maxX) {
      const gap = this.maxX - other.minX;
      if (gap > offset) offset = gap;
    }
    return offset;
  }

  /**
   * If this and the given BB overlap on X and Z, returns the closest Y offset
   * that keeps them separated; otherwise returns the original offset unchanged.
   */
  calculateYOffset(other, offset) {
    if (other.maxX <= this.minX || other.minX >= this.maxX) return offset;
    if (other.maxZ <= this.minZ || other.minZ >= this.maxZ) return offset;
    if (offset > 0 && other.maxY <= this.minY) {
      const gap = this.minY - other.maxY;
      if (gap < offset) offset = gap;
    }
    if (offset < 0 && other.minY >= this.maxY) {
      const gap = this.maxY - other.minY;
      if (gap > offset) offset = gap;
    }
    return offset;
  }

  /**
   * If this and the given BB overlap on X and Y, returns the closest Z offset
   * that keeps them separated; otherwise returns the original offset unchanged.
   */
  calculateZOffset(other, offset) {
    if (other.maxX <= this.minX || other.minX >= this.maxX) return offset;
    if (other.maxY <= this.minY || other.minY >= this.maxY) return offset;
    if (offset > 0 && other.maxZ <= this.minZ) {
      const gap = this.minZ - other.maxZ;
      if (gap < offset) offset = gap;
    }
    if (offset < 0 && other.minZ >= this.maxZ) {
      const gap = this.maxZ - other.minZ;
      if (gap > offset) offset = gap;
    }
    return offset;
  }

  /** Returns whether the given bounding box intersects with this one */
  intersectsWith(other) {
    return other.maxX > this.minX && other.minX < this.maxX
        && other.maxY > this.minY && other.minY < this.maxY
        && other.maxZ > this.minZ && other.minZ < this.maxZ;
  }

  /** Mutates this bounding box by offsetting it by the specified vector */
  offset(x, y, z) {
    this.minX += x; this.minY += y; this.minZ += z;
    this.maxX += x; this.maxY += y; this.maxZ += z;
    return this;
  }

  /** Returns true if the supplied Vec3 is completely inside the bounding box */
  isVecInside(vec) {
    return vec.xCoord > this.minX && vec.xCoord < this.maxX
        && vec.yCoord > this.minY && vec.yCoord < this.maxY
        && vec.zCoord > this.minZ && vec.zCoord < this.maxZ;
  }

  /** Returns the average length of the edges of the bounding box */
  getAverageEdgeLength() {
    return ((this.maxX - this.minX) + (this.maxY - this.minY) + (this.maxZ - this.minZ)) / 3.0;
  }

  /** Returns a bounding box contracted (inset) by the specified amounts */
  contract(x, y, z) {
    return AxisAlignedBB.getAABBPool().getAABB(
      this.minX + x, this.minY + y, this.minZ + z,
      this.maxX - x, this.maxY - y, this.maxZ - z,
    );
  }

  /** Returns a pooled copy of this bounding box */
  copy() {
    return AxisAlignedBB.getAABBPool().getAABB(
      this.minX, this.minY, this.minZ,
      this.maxX, this.maxY, this.maxZ,
    );
  }

  /**
   * Calculates the intercept of a line segment [start, end] with this AABB.
   * Returns a MovingObjectPosition with the face hit, or null if no intersection.
   *
   * Face indices: 0=minY, 1=maxY, 2=minZ, 3=maxZ, 4=minX, 5=maxX
   */
  calculateIntercept(start, end) {
    const candidates = [
      { vec: start.getIntermediateWithXValue(end, this.minX), check: v => this.#isVecInYZ(v), face: 4 },
      { vec: start.getIntermediateWithXValue(end, this.maxX), check: v => this.#isVecInYZ(v), face: 5 },
      { vec: start.getIntermediateWithYValue(end, this.minY), check: v => this.#isVecInXZ(v), face: 0 },
      { vec: start.getIntermediateWithYValue(end, this.maxY), check: v => this.#isVecInXZ(v), face: 1 },
      { vec: start.getIntermediateWithZValue(end, this.minZ), check: v => this.#isVecInXY(v), face: 2 },
      { vec: start.getIntermediateWithZValue(end, this.maxZ), check: v => this.#isVecInXY(v), face: 3 },
    ];

    let closest = null;
    let closestFace = -1;

    for (const { vec, check, face } of candidates) {
      if (vec === null || !check(vec)) continue;
      if (closest === null || start.squareDistanceTo(vec) < start.squareDistanceTo(closest)) {
        closest = vec;
        closestFace = face;
      }
    }

    return closest === null ? null : new MovingObjectPosition(0, 0, 0, closestFace, closest);
  }

  /** Returns true if the vec lies within the Y and Z extents of this AABB */
  #isVecInYZ(vec) {
    return vec !== null
      && vec.yCoord >= this.minY && vec.yCoord <= this.maxY
      && vec.zCoord >= this.minZ && vec.zCoord <= this.maxZ;
  }

  /** Returns true if the vec lies within the X and Z extents of this AABB */
  #isVecInXZ(vec) {
    return vec !== null
      && vec.xCoord >= this.minX && vec.xCoord <= this.maxX
      && vec.zCoord >= this.minZ && vec.zCoord <= this.maxZ;
  }

  /** Returns true if the vec lies within the X and Y extents of this AABB */
  #isVecInXY(vec) {
    return vec !== null
      && vec.xCoord >= this.minX && vec.xCoord <= this.maxX
      && vec.yCoord >= this.minY && vec.yCoord <= this.maxY;
  }

  /** Copies the bounds from another AABB into this one */
  setBB(other) {
    this.minX = other.minX; this.minY = other.minY; this.minZ = other.minZ;
    this.maxX = other.maxX; this.maxY = other.maxY; this.maxZ = other.maxZ;
  }

  toString() {
    return `box[${this.minX}, ${this.minY}, ${this.minZ} -> ${this.maxX}, ${this.maxY}, ${this.maxZ}]`;
  }
}