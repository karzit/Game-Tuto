export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  add(point) {
    const any = new Vector(this.x, this.y);
    any.x += point.x;
    any.y += point.y;

    return any;
  }
  sub(point) {
    const any = new Vector(this.x, this.y);
    any.x -= point.x;
    any.y -= point.y;

    return any;
  }
  mul(value) {
    const any = new Vector(this.x, this.y);
    any.x *= value;
    any.y *= value;

    return any;
  }
  avg(value) {
    const any = new Vector(this.x, this.y);
    any.x /= value;
    any.y /= value;

    return any;
  }
  normalrize() {
    return Math.sqrt(this.x * this.x  + this.y * this.y);
  }
  fromLength(point) {
    return Math.abs(this.x - point.x) + Math.abs(this.y - point.y);
  }

}