import { Charactor } from './js/Character.js';
import { Map, TileType } from './js/Map.js';
import { Vector } from './js/Vector.js';

export const Constants = {
  Gravity: -2,//중력 가속도
  MaxFallingSpeed: 100,//최대 속도
  minJumpSpeed: 5,//
  cWalkSpeed: 10,
  cJumpSpeed: 30,
  cMinJumpSpeed: 200,
  cSize: {
    width: 60,
    height: 200,
  },
  cTileSize: 100,
};

export class App {
  /**
   * @public @static @type {Number}
   */
  static perfectFrameTime = 1000 / 60
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.prevPressedKeys = {};
    this.pressedKeys = {};

    this.objs = [];

    const tileMap = [
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty],
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Block],
      [TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Empty, TileType.Block, TileType.Block],
      [TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block, TileType.Block],
    ];



    this.map = new Map(tileMap);

    this.deltaTime = 0;
    this.lastTimestamp = 0;

    this.events();
  }
  init() {
    this.objs.push(new Charactor(new Vector(100, this.stageheight / 1.5)));

    window.requestAnimationFrame(this.render.bind(this));
  }
  resize() {
    this.stagewidth = this.canvas.clientWidth * 4;
    this.stageheight = this.canvas.clientHeight * 4;

    this.canvas.width = this.stagewidth * 2;
    this.canvas.height = this.stageheight * 2;
    this.ctx.scale(2, 2);



    Constants.cTileSize = this.stagewidth / 19;//100
    Constants.Gravity = -2;
    Constants.MaxFallingSpeed = this.stagewidth/10;
    Constants.minJumpSpeed = this.stageheight/200;
    Constants.cWalkSpeed = this.stagewidth/200;
    Constants.cJumpSpeed = Constants.minJumpSpeed*5;
    Constants.cMinJumpSpeed = Constants.minJumpSpeed*3;
    Constants.cSize = {
      width: this.stagewidth/35,
      height: this.stageheight/5.5,
    };
  }
  render(t) {
    this.deltaTime = (t - this.lastTimestamp) / App.perfectFrameTime;
    this.lastTimestamp = t;

    this.ctx.clearRect(0, 0, this.stagewidth, this.stageheight)
    this.objs.forEach(x => {
      x.update(this.deltaTime, this.pressedKeys, this.map);
    });

    this.map.render(this.ctx, this.stageheight);
    this.objs.forEach(x => {
      x.render(this.ctx, this.stageheight);
    });
    this.prevPressedKeys = { ...this.pressedKeys };
    window.requestAnimationFrame(this.render.bind(this));
  }
  events() {
    document.addEventListener('keydown', (e) => {
      this.pressedKeys[e.key] = true;
    });
    document.addEventListener('keyup', (e) => {
      this.pressedKeys[e.key] = false;
    });
  }
}

export const app = new App();
app.resize();
app.init();