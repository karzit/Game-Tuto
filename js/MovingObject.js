import { app, App, Constants } from '../app.js';
import { AABB } from './AABB.js';
import { Map, TileType } from './Map.js';
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
  mPushedRightWall = false;
  /**
   * @public @type {Boolean}
   */
  mPusheRightWall = false;

  /**
   * @public @type {Boolean}
   */
  mPushedLeftWall = false;
  /**
   * @public @type {Boolean}
   */
  mPusheLeftWall = false;

  /**
   * @public @type {Boolean}
   */
  mWasOnGround = false;
  /**
   * @public @type {Boolean}
   */
  mOnGround = false;

  /**
   * @public @type {Boolean}
   */
  onOneWayPlatform = false;

  /**
   * @public @type {Boolean}
   */
  mWasAtCeiling = false;
  /**
   * @public @type {Boolean}
   */
  mAtCeiling = false;
  /**
   * @public @type {Boolean}
   */
  mIsOut = false;

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
    this.updatePrev();
    this.point = this.point.add(this.mSpeed.mul(deltaTime));

    const prevY = this.point.y;

    const hasCeiling = this.hasCeiling(map, this.oldPoint, this.point, this.mSpeed);
    if (this.mSpeed.y >= 0 && typeof hasCeiling != 'boolean') {
      this.point.y = app.stageheight - hasCeiling;
    }

    const collidesWithLeftWall = this.collidesWithLeftWall(map, this.oldPoint, this.point, this.mSpeed);
    if (this.mSpeed.x <= 0 && typeof collidesWithLeftWall != 'boolean') {
      this.point.x = collidesWithLeftWall;
      this.mSpeed.x = 0;
      this.mPusheLeftWall = true;
    } else {
      this.mPusheLeftWall = false;
    }

    const collidesWithRightWall = this.collidesWithRightWall(map, this.oldPoint, this.point, this.mSpeed);
    if (this.mSpeed.x >= 0 && typeof collidesWithRightWall != 'boolean') {
      this.point.x = collidesWithRightWall - this.size.width / 2;
      this.mSpeed.x = 0;
      this.mPusheRightWall = true;
    } else {
      this.mPusheRightWall = false;
    }

    this.point.y = prevY;

    const hasCeiling2 = this.hasCeiling(map, this.oldPoint, this.point, this.mSpeed);
    if (this.mSpeed.y >= 0 && typeof hasCeiling2 != 'boolean' && typeof hasCeiling != 'boolean') {
      this.point.y = app.stageheight - hasCeiling2;
      this.mSpeed.y = 0;
      this.mAtCeiling = true;
    } else {
      this.mAtCeiling = false;
    }

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
    this.onOneWayPlatform = false;
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
      const perWidth = (newLeft - oldLeft) / endY;

      const left = oldLeft + (perWidth * j);
      const right = left + this.size.width;


      const perHeight = (newBottom - oldBottom) / endY;

      const bottom = oldBottom + (perHeight * j);

      for (let i = left; ; i += Constants.cTileSize) {
        i = Math.min(i, right);

        const tileIndexX = map.getMapTileAtXPoint(i);

        const groundY = map.getMapTilePosition({ x: tileIndexX, y: j }).y;

        if (map.IsObstacle(tileIndexX, j)) {
          this.onOneWayPlatform = false;
          return groundY;
        } else if (map.IsOnWayPlatform(tileIndexX, j)) {
          if (Math.floor(groundY - bottom) < Math.floor(Constants.cOneWayPlatformThreshold + oldPoint.y - point.y)) {
            this.onOneWayPlatform = true;
          }
        }
        if (i >= right) {
          if (this.onOneWayPlatform) {
            return groundY;
          }
          break;
        }
      }
    }
    return false;
  }

  hasCeiling(map, oldPoint, point, speed) {
    const oldTop = oldPoint.y + this.size.height + this.size.height / 2;
    const oldLeft = oldPoint.x - this.size.width / 2;

    const newTop = point.y + this.size.height;
    const newLeft = point.x - this.size.width / 2;

    const endY = map.getMapTileAtYPoint(newTop);
    const begY = Math.max(map.getMapTileAtYPoint(oldTop) + 1, endY);

    for (let j = endY; j <= begY; j++) {
      const perWidth = (newLeft - oldLeft) / endY;

      const left = oldLeft + (perWidth * j);
      const right = left + this.size.width;


      for (let i = left; ; i += Constants.cTileSize) {
        i = Math.min(i, right);

        const tileIndexX = map.getMapTileAtXPoint(i);
        const groundY = map.getMapTilePosition({ x: tileIndexX, y: j }).y;

        if (map.IsObstacle(tileIndexX, j)) {
          return groundY + Constants.cTileSize + this.size.height;
        }
        if (i >= right) {
          break;
        }
      }
    }
    return false;
  }

  collidesWithLeftWall(map, oldPoint, point, speed) {
    const oldTop = oldPoint.y + this.size.height;
    const oldLeft = oldPoint.x - this.size.width / 2;

    const newTop = point.y + this.size.height;
    const newLeft = point.x - this.size.width / 2;

    const endX = map.getMapTileAtXPoint(newLeft);
    const begX = Math.max(map.getMapTileAtXPoint(oldLeft) - 1, endX);

    for (let j = begX; j >= endX; j--) {
      const perHeight = (newTop - oldTop) / endX;

      const top = oldTop + (perHeight * j);
      const bottom = top - this.size.height;

      for (let i = top; i > bottom; i -= Constants.cTileSize) {
        i = Math.max(i, bottom);

        const tileIndexY = map.getMapTileAtYPoint(i);
        const groundX = map.getMapTilePosition({ x: j, y: tileIndexY }).x;


        if (map.IsObstacle(j, tileIndexY)) {
          return groundX + Constants.cTileSize + this.size.width / 2;
        }
        if (i <= bottom) {
          break;
        }
      }
    }
    return false;
  }

  collidesWithRightWall(map, oldPoint, point, speed) {
    const oldTop = oldPoint.y + this.size.height;
    const oldRight = oldPoint.x + this.size.width / 2;

    const newTop = point.y + this.size.height;
    const newRight = point.x + this.size.width / 2;

    const endX = map.getMapTileAtXPoint(newRight);
    const begX = Math.max(map.getMapTileAtXPoint(oldRight) + 1, endX);

    for (let j = begX; j <= endX; j++) {
      const perHeight = (newTop - oldTop) / endX;

      const top = oldTop + (perHeight * j);
      const bottom = top - this.size.height;

      for (let i = top; i > bottom; i -= Constants.cTileSize) {
        i = Math.max(i, bottom);

        const tileIndexY = map.getMapTileAtYPoint(i);
        const groundX = map.getMapTilePosition({ x: j, y: tileIndexY }).x;


        if (map.IsObstacle(j, tileIndexY)) {
          return groundX - 1;
        }
        if (i <= bottom) {
          break;
        }
      }
    }
    return false;
  }
}
