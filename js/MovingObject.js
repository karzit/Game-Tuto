import { app, App, Constants } from '../app.js';
import { AABB } from './AABB.js';
import { Map } from './Map.js';
import { Vector } from './Vector.js';

export class MovingObject extends AABB {
  /**
   * @private @type {Vector}
   */
  mStartPoint
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
   * @public @type {Boolean}
   */
  mIsOut

  /**
   * 
   * @param {Vector} position 
   * @param {{width:Number,height:Number}} size 
   */
  constructor(point, size) {
    super(point, size);
    this.oldPoint = point;
    this.mStartPoint = point;
  }
  updatePhysics(deltaTime, map) {
    this.point = this.point.add(this.mSpeed.mul(deltaTime));

    const hasgorund = this.hasGround(map, this.oldPoint, this.point, this.mSpeed)
    if (this.mSpeed.y <= 0 && typeof hasgorund != 'boolean') {
      this.point.y = app.stageheight - hasgorund;
      this.mSpeed.y = 0;
      this.mOnGround = true;
    } else {
      this.mOnGround = false;
    }
    if (this.point.y < 0 && this.mSpeed.y <= 0) {
      this.mIsOut = true;
      return;
    }

  }
  updatePrev() {
    this.oldPoint = new Vector(this.point.x, this.point.y);
    this.mOldSpeed = this.mSpeed;

    this.mWasOnGround = this.mOnGround;
    this.mPushedRightWall = this.mPusheRightWall;
    this.mPushedLeftWall = this.mPusheLeftWall;
    this.mWasAtCeiling = this.mAtCeiling;
  }
  check() {
    if (this.mIsOut) {
      this.point = this.mStartPoint;
      this.mSpeed = new Vector(0, 0);
      this.mIsOut = 0;
    }
  }

  /**
   * 
   * @param {Map} map 
   * @param {Vector} oldPoint 
   * @param {Vector} point 
   * @param {Number} speed 
   */
  hasGround(map, oldPoint, point, speed) {
    const oldBottom = oldPoint.y;
    const oldLeft = oldPoint.x - this.size.width / 2;
    const oldRight = oldPoint.x + this.size.width / 2;

    const newBottom = point.y;
    const newLeft = point.x - this.size.width / 2;
    const newRight = point.x + this.size.width / 2;

    const endY = map.getMapTileAtYPoint(newBottom);
    const begY = Math.max(map.getMapTileAtYPoint(oldBottom) - 1, endY);
    const dist = Math.max(Math.abs(endY - begY), 1);

    for (let j = begY; j >= endY; j--) {
      const per = (newLeft - oldLeft)/endY;

      const left = oldLeft + (per * j);
      const right = left + this.size.width;
      for (let i = left; ; i += Constants.cTileSize) {
        i = Math.min(i, right);

        const tileIndexX = map.getMapTileAtXPoint(i);

        if (map.IsObstacle(tileIndexX, j)) {
          return map.getMapTilePosition({
            x: tileIndexX,
            y: j
          }).y;
        }
        if (i >= right) {
          break;
        }
      }
    }
    return false;
  }
}
