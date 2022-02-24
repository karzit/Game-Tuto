import { Constants } from '../app.js';
import { Vector } from './Vector.js';

export const TileType = {
  Empty: 'Empty',
  Block: 'Block',
  OneWay: 'OneWay',
  // Empty : 'Empty',
}

const sprites = {
  [TileType.Empty]: (ctx, point) => {
    ctx.beginPath();
    ctx.fillStyle = 'transparent';
    ctx.rect(point.x, point.y, Constants.cTileSize, Constants.cTileSize);
    ctx.fill();
    ctx.closePath();
  },
  [TileType.Block]: (ctx, point) => {
    ctx.beginPath();
    ctx.fillStyle = '#aaaa';
    ctx.rect(point.x, point.y, Constants.cTileSize, Constants.cTileSize);
    ctx.fill();
    ctx.closePath();
  },
  [TileType.OneWay]: (ctx, point) => {
    ctx.beginPath();
    ctx.fillStyle = '#888a';
    ctx.rect(point.x, point.y, Constants.cTileSize, Constants.cOneWayPlatformThreshold);
    ctx.fill();
    ctx.closePath();
  },
}

export class Map {
  /**
   * @private @type {Array<TileType>}
   */
  mTiles = [];

  /**
   * @public @type {Number}
   */
  mWidth;
  /**
   * @public @type {Number}
   */
  mHeight;

  /**
   * @public @type {Vector}
   */
  mPosition
  constructor(mTiles) {
    this.mTiles = mTiles;
    this.mHeight = mTiles.length - 1;
    this.mWidth = mTiles[0].length - 1;

    this.mPosition = new Vector(0, 0);
  }
  getMapTileAtPoint(point) {
    return new Vector(Math.floor((point.x - this.mPosition.x) / Constants.cTileSize)),
      this.mHeight - Math.floor((point.y - this.mPosition.y) / Constants.cTileSize);
  }
  getMapTileAtXPoint(pointX) {
    return Math.floor((pointX - this.mPosition.x) / Constants.cTileSize);
  }
  getMapTileAtYPoint(pointY) {
    return this.mHeight - Math.floor((pointY - this.mPosition.y) / Constants.cTileSize);
  }
  /**
   * 
   * @param {{x:Number,y:Number}} param0 
   * @returns {Vector}
   */
  getMapTilePosition({ x, y }) {
    return new Vector(
      x * Constants.cTileSize + this.mPosition.x,
      y * Constants.cTileSize + this.mPosition.y,
    )
  }
  getTile(x, y) {
    if (x < 0 || x > this.mWidth || y < 0 || y > this.mHeight) {
      return TileType.Block;
    }
    return this.mTiles[y][x];
  }
  IsObstacle(x, y) {
    return this.getTile(x, y) == TileType.Block;
  }
  IsOnWayPlatform(x, y) {
    return this.getTile(x, y) == TileType.OneWay;
  }
  isEmpty(x, y) {
    return this.getTile(x, y) == TileType.Empty;
  }
  IsGround(x, y) {
    const type = this.getTile(x, y);
    return type == TileType.OneWay || type == TileType.Block;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {*} stageWidth 
   */
  render(ctx, stageWidth) {
    this.mTiles.forEach((tiels, i) => {
      tiels.forEach((tile, j) => {
        const point = this.getMapTilePosition({
          y: i,
          x: j,
        });

        sprites[tile](ctx, point);

        // ctx.beginPath();
        // ctx.fillStyle = sprites[tile];
        // ctx.rect(point.x, point.y, Constants.cTileSize, Constants.cTileSize);
        // ctx.fill();
        // ctx.closePath();

        // ctx.beginPath();
        // ctx.fillStyle = '#000';
        // ctx.font = '48px serif';
        // ctx.textBaseline = 'middle';
        // ctx.textAlign = 'center'
        // ctx.fillText(`${i}`, point.x + Constants.cTileSize / 2, point.y + Constants.cTileSize / 2);
        // ctx.closePath();
      })
    });
  }
}