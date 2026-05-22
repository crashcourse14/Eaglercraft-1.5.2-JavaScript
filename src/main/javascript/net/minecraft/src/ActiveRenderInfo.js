// ActiveRenderInfo.js
import { EaglerAdapter } from './EaglerAdapter.js';
import { GLAllocation } from './GLAllocation.js';
import { MathHelper } from './MathHelper.js';
import { Block } from './Block.js';
import { BlockFluid } from './BlockFluid.js';
import { ChunkPosition } from './ChunkPosition.js';

export class ActiveRenderInfo {
  /** The calculated view object X coordinate */
  static objectX = 0.0;
  /** The calculated view object Y coordinate */
  static objectY = 0.0;
  /** The calculated view object Z coordinate */
  static objectZ = 0.0;

  /** The X component of the entity's yaw rotation */
  static rotationX = 0.0;
  /** The combined X and Z components of the entity's pitch rotation */
  static rotationXZ = 0.0;
  /** The Z component of the entity's yaw rotation */
  static rotationZ = 0.0;
  /** The Y component (scaled along the Z axis) of the entity's pitch rotation */
  static rotationYZ = 0.0;
  /** The Y component (scaled along the X axis) of the entity's pitch rotation */
  static rotationXY = 0.0;

  /** The current GL viewport */
  static #viewport = new Int32Array(4);
  /** The current GL modelview matrix */
  static #modelview = GLAllocation.createDirectFloatBuffer(16);
  /** The current GL projection matrix */
  static #projection = GLAllocation.createDirectFloatBuffer(16);
  /** The computed view object coordinates */
  static #objectCoords = GLAllocation.createDirectFloatBuffer(3);

  /**
   * Updates the current render info and camera location based on entity look
   * angles and 1st/3rd person view mode.
   */
  static updateRenderInfo(player, thirdPerson) {
    const mv = ActiveRenderInfo.#modelview;
    const proj = ActiveRenderInfo.#projection;
    const vp = ActiveRenderInfo.#viewport;
    const oc = ActiveRenderInfo.#objectCoords;

    mv.fill(0); proj.fill(0);
    EaglerAdapter.glGetFloat(EaglerAdapter.GL_MODELVIEW_MATRIX, mv);
    EaglerAdapter.glGetFloat(EaglerAdapter.GL_PROJECTION_MATRIX, proj);
    EaglerAdapter.glGetInteger(EaglerAdapter.GL_VIEWPORT, vp);

    const centerX = (vp[0] + vp[2]) / 2;
    const centerY = (vp[1] + vp[3]) / 2;
    EaglerAdapter.gluUnProject(centerX, centerY, 0.0, mv, proj, vp, oc);

    ActiveRenderInfo.objectX = oc[0];
    ActiveRenderInfo.objectY = oc[1];
    ActiveRenderInfo.objectZ = oc[2];

    const sign = thirdPerson ? -1 : 1;
    const pitch = player.rotationPitch;
    const yaw   = player.rotationYaw;
    const yawRad   = yaw   * Math.PI / 180.0;
    const pitchRad = pitch * Math.PI / 180.0;

    ActiveRenderInfo.rotationX  =  MathHelper.cos(yawRad) * sign;
    ActiveRenderInfo.rotationZ  =  MathHelper.sin(yawRad) * sign;
    ActiveRenderInfo.rotationYZ = -ActiveRenderInfo.rotationZ * MathHelper.sin(pitchRad) * sign;
    ActiveRenderInfo.rotationXY =  ActiveRenderInfo.rotationX * MathHelper.sin(pitchRad) * sign;
    ActiveRenderInfo.rotationXZ =  MathHelper.cos(pitchRad);
  }

  /**
   * Returns a Vec3 representing the projection along the given entity's view
   * for the given partial-tick distance.
   */
  static projectViewFromEntity(entity, partialTick) {
    const x = entity.prevPosX + (entity.posX - entity.prevPosX) * partialTick;
    const y = entity.prevPosY + (entity.posY - entity.prevPosY) * partialTick + entity.getEyeHeight();
    const z = entity.prevPosZ + (entity.posZ - entity.prevPosZ) * partialTick;

    return entity.worldObj.getWorldVec3Pool().getVecFromPool(
      x + ActiveRenderInfo.objectX,
      y + ActiveRenderInfo.objectY,
      z + ActiveRenderInfo.objectZ,
    );
  }

  /**
   * Returns the block ID at the current camera location (either air or fluid),
   * taking into account the height of fluid blocks.
   */
  static getBlockIdAtEntityViewpoint(world, entity, partialTick) {
    const vec  = ActiveRenderInfo.projectViewFromEntity(entity, partialTick);
    const pos  = new ChunkPosition(vec);
    let blockId = world.getBlockId(pos.x, pos.y, pos.z);

    if (blockId !== 0 && Block.blocksList[blockId].blockMaterial.isLiquid()) {
      const fluidHeight = BlockFluid.getFluidHeightPercent(
        world.getBlockMetadata(pos.x, pos.y, pos.z)
      ) - 0.11111111;
      const surfaceY = (pos.y + 1) - fluidHeight;

      if (vec.yCoord >= surfaceY) {
        blockId = world.getBlockId(pos.x, pos.y + 1, pos.z);
      }
    }

    return blockId;
  }
}