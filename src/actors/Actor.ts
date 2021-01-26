import Vector3 from '../math/Vector3';
import PrimitiveBatch from '../graphics/PrimitiveBatch';

export default class Actor {
  readonly size = new Vector3();
  readonly position = new Vector3();
  readonly velocity = new Vector3();
  readonly color = new Vector3();
  opacity = 1;

  onRender(batch: PrimitiveBatch) {
    batch.drawRect(
      this.position.x, this.position.y,
      this.size.x, this.size.y,
      this.color.x, this.color.y, this.color.z, this.opacity);
  }

  collides(other: Actor, delta: number) {
    const dx = (this.velocity.x - other.velocity.x) * delta;
    const ax = this.position.x;
    const aw = this.size.x;
    const bx = other.position.x;
    const bw = other.size.x;

    if (ax > bx + bw || ax + aw < bx)
      return false;


  }
}
