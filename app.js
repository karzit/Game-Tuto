import { Charactor } from './js/Character.js';
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
  }

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

    this.deltaTime = 0;
    this.lastTimestamp = 0;

    this.events();
  }
  init() {
    this.objs.push(new Charactor(new Vector(100, 1000)));

    window.requestAnimationFrame(this.render.bind(this));
  }
  resize() {
    this.stagewidth = this.canvas.clientWidth * 4;
    this.stageheight = this.canvas.clientHeight * 4;

    this.canvas.width = this.stagewidth * 2;
    this.canvas.height = this.stageheight * 2;
    this.ctx.scale(2, 2);
  }
  render(t) {
    this.deltaTime = (t - this.lastTimestamp) / App.perfectFrameTime;
    this.lastTimestamp = t;

    this.ctx.clearRect(0, 0, this.stagewidth, this.stageheight)
    this.objs.forEach(x => {
      x.update(this.deltaTime, this.pressedKeys);
    });
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