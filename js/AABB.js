import { Vector } from './Vector.js';

export class AABB {
  /**
   * 
   * @param {Vector} point 
   * @param {{width:Number,height:Number}} size 
   */
  constructor(point, size) {
    this.point = point;
    this.size = size;
  }
  overlab(aabb) {
    if (this.point.x - aabb.center.x > this.size.width / 2 + aabb.size.width / 2) {
      return false;
    }
    if (this.point.y - aabb.center.y > aabb.size.height) {
      return false;
    }
  }
  /**
  * 
  * @param {CanvasRenderingContext2D} ctx
  * @param {Number} stageheight
  */
  render(ctx, stageheight) {
    ctx.beginPath();
    ctx.fillStyle = '#3af';
    ctx.rect(
      this.point.x - this.size.width / 2,
      stageheight - (this.point.y + this.size.height),
      this.size.width,
      this.size.height
    );
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(
      this.point.x,
      stageheight - (this.point.y),
      10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}