import Vector3 from '../math/Vector3';
import { clamp } from '../math/index';
import Actor from './Actor';

export default class Player extends Actor {
  readonly targetPosition = new Vector3().set(0, 20);
  private container = new Vector3();

  constructor() {
    super();
    this.size.set(100, 20);
    this.position.set(0, 20);
  }

  onContainerResized(container: Vector3) {
    this.container.set(container);
  }

  onMouseMove(x: number, y: number) {
    this.targetPosition.x = x - 0.5 * this.size.x;
  }

  onUpdate(delta: number) {
    this.velocity.set(this.position).scalar(-1);
    this.position.lerp(10 * delta, this.targetPosition);
    this.position.x = clamp(this.position.x, 0, this.container.x - this.size.x);
    this.velocity.add(this.position).scalar(1 / delta);
  }
}
