import { app, Constants } from '../app.js';
import { MovingObject } from './MovingObject.js';
import { Vector } from './Vector.js';

const CharacterState = {
  Stand: 'Stand',
  Walk: 'Walk',
  Jump: 'Jump',
  GrabLedge: 'GrabLedge',
}

const sprites = {
  [CharacterState.Stand]: ['#3afa'],
  [CharacterState.Walk]: ['#f56a'],
  [CharacterState.Jump]: ['#3faa'],
  [CharacterState.GrabLedge]: ['#af3a'],
}

export class Charactor extends MovingObject {
  /**
   * @public @type {'Stand'|'Walk'|'Jump'|'GrabLedge'}
   */
  mCurrentState = 'Stand';
  /**
   * @public @type {Number}
   */
  mJumpSpeed;
  /**
   * @public @type {Number}
   */
  mWalkSpeed;

  constructor(point) {
    super(point, Constants.cSize);

    this.mJumpSpeed = Constants.cJumpSpeed;
    this.mWalkSpeed = Constants.cWalkSpeed;

    this.mOnGround = false;

    this.mScale = new Vector(1, 1);
  }
  update(delta, pressedKeys, map) {
    switch (this.mCurrentState) {
      case CharacterState.Stand:
        this.standUpdate(delta, pressedKeys);
        break;
      case CharacterState.Walk:
        this.walkUpdate(delta, pressedKeys);
        break;
      case CharacterState.Jump:
        this.jumpUpdate(delta, pressedKeys);
        break;
      case CharacterState.GrabLedge:
        break;
    }
    this.updatePhysics(delta, map);
    if ((!this.mWasOnGround && this.mOnGround)
      || (!this.mWasAtCeiling && this.mAtCeiling)
      || (!this.mPushedLeftWall && this.mPusheLeftWall)
      || (!this.mPushedRightWall && this.mPusheRightWall)) {
      // alert('overlap');
    }
  }
  standUpdate(delta, pressedKeys) {
    this.mSpeed = new Vector(0, 0);
    if (!this.mOnGround) {
      this.mCurrentState = CharacterState.Jump;
      return;
    }

    if (pressedKeys['ArrowRight'] || pressedKeys['ArrowLeft']) {
      this.mCurrentState = CharacterState.Walk;
      return;
    }
    if (pressedKeys['ArrowUp']) {
      this.mSpeed.y = this.mJumpSpeed;
      this.mCurrentState = CharacterState.Jump;
      return;
    }
    if(pressedKeys['ArrowDown']) {
      if(this.onOneWayPlatform) {
        this.point.y -= Constants.cOneWayPlatformThreshold;
      }
      return;
    }
  }
  walkUpdate(delta, pressedKeys) {
    if (!pressedKeys['ArrowRight'] == !pressedKeys['ArrowLeft']) {
      this.mCurrentState = CharacterState.Stand;
      this.mSpeed.x = 0;
      return;
    }
    if (pressedKeys['ArrowRight']) {
      this.mSpeed.x = this.mWalkSpeed;
      if (this.mPusheRightWall) {
        this.mSpeed.x = 0;
      }

      this.mScale.x = Math.abs(this.mScale.x);
    } else if (pressedKeys['ArrowLeft']) {
      this.mSpeed.x = -this.mWalkSpeed;
      if (this.mPusheLeftWall) {
        this.mSpeed.x = 0;
      }

      this.mScale.x = Math.abs(this.mScale.x);
    }
    if (pressedKeys['ArrowUp']) {
      this.mSpeed.y = this.mJumpSpeed;
      this.mCurrentState = CharacterState.Jump;
      return;
    } else if (!this.mOnGround) {
      this.mCurrentState = CharacterState.Jump;
      return;
    }
    
    if(pressedKeys['ArrowDown']) {
      if(this.onOneWayPlatform) {
        this.point.y -= Constants.cOneWayPlatformThreshold;
      }
      return;
    }
  }
  jumpUpdate(delta, pressedKeys) {
    this.mSpeed.y += Math.min(Constants.Gravity * delta, Constants.MaxFallingSpeed);
    if(this.mOnGround) {
      this.mCurrentState = CharacterState.Stand;
      return;
    }
    if(this.mIsOut) {
      this.point = new Vector(100, app.stageheight / 1.5);
      this.mSpeed = new Vector(0,0);
      this.mIsOut = false;
      return;
    }

    if (pressedKeys['ArrowRight'] == pressedKeys['ArrowLeft']) {
      this.mSpeed.x = 0;
    } else if (pressedKeys['ArrowRight']) {
      this.mSpeed.x = this.mWalkSpeed;
      if (this.mPusheRightWall) {
        this.mSpeed.x = 0;
      }

      this.mScale.x = Math.abs(this.mScale.x);
    } else if (pressedKeys['ArrowLeft']) {
      this.mSpeed.x = -this.mWalkSpeed;
      if (this.mPusheLeftWall) {
        this.mSpeed.x = 0;
      }

      this.mScale.x = Math.abs(this.mScale.x);
    }

    if (!pressedKeys['ArrowUp'] && this.mSpeed.y > 0) {
      this.mSpeed.y = Math.min(this.mSpeed.y, Constants.minJumpSpeed)
    }
  }
  grabLedgeUpdate(delta, pressedKeys) { }

  render(ctx, stageheight) {
    ctx.beginPath();
    ctx.fillStyle = sprites[this.mCurrentState];
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