import Vector3 from "../math/Vector3";
import PrimitiveBatch from "../graphics/PrimitiveBatch";
import {clamp} from "../math/Math";

export default class Player {
    readonly size = new Vector3().set(100, 20);
    readonly position = new Vector3().set(0, 20);
    readonly velocity = new Vector3();
    readonly color = new Vector3();
    opacity = 1;
    private container = new Vector3();
    readonly targetPosition = new Vector3().set(0, 20);

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

    onRender(batch: PrimitiveBatch) {
        batch.drawRect(
            this.position.x, this.position.y,
            this.size.x, this.size.y,
            this.color.x, this.color.y, this.color.z, this.opacity)
    }
}