import { AABB } from './AABB.js';
import { Vector } from './Vector.js';

export class MovingObject extends AABB {
  /**
   * @public @type {Vector}
   */
  mAABBOffset;
  /**
   * @public @type {Vector}
   */
  oldPoint;

  /**
   * @public @type {Vector}
   */
  mOldSpeed;
  /**
   * @public @type {Vector}
   */
  mSpeed;

  /**
   * @public @type {Vector}
   */
  mScale;

  /**
   * @public @type {Boolean}
   */
  mPushedRightWall;
  /**
   * @public @type {Boolean}
   */
  mPusheRightWall;

  /**
   * @public @type {Boolean}
   */
  mPushedLeftWall;
  /**
   * @public @type {Boolean}
   */
  mPusheLeftWall;

  /**
   * @public @type {Boolean}
   */
  mWasOnGround;
  /**
   * @public @type {Boolean}
   */
  mOnGround;

  /**
   * @public @type {Boolean}
   */
  mWasAtCeiling;
  /**
   * @public @type {Boolean}
   */
  mAtCeiling;

  /**
   * 
   * @param {Vector} position 
   * @param {Vector} scale 
   */
  constructor(point, size) {
    super(point, size);
  }
  updatePhysics(deltaTime) {
    this.point = this.point.add(this.mSpeed.mul(deltaTime));

    this.mOnGround = false;
    if (this.point.y <= 0) {
      this.point.y = 0;
      this.mOnGround = true;
    }
    this.point = this.point;

  }
  updatePrev() {
    this.oldPoint = this.point;
    this.mOldSpeed = this.mSpeed;

    this.mWasOnGround = this.mOnGround;
    this.mPushedRightWall = this.mPusheRightWall;
    this.mPushedLeftWall = this.mPusheLeftWall;
    this.mWasAtCeiling = this.mAtCeiling;
  }
}

