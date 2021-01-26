import Vector3 from "../math/Vector3";
import PrimitiveBatch from "../graphics/PrimitiveBatch";
import {clamp} from "../math/Math";

export default class Player {
    readonly size = new Vector3();
    readonly position = new Vector3();
    readonly velocity = new Vector3();
    readonly color = new Vector3();
    opacity = 1;
    private viewport = new Vector3();
    private targetPosition = new Vector3();

    onWindowResize(width: number, height: number) {
        this.viewport.set(width, height, 0);
        this.size.set(100, 20);
        this.targetPosition.y = 20;
    }

    onMouseMove(x: number, y: number) {
        this.targetPosition.x = x - 0.5 * this.size.x;
    }

    onUpdate(delta: number) {
        this.velocity.set(this.position).scalar(-1);
        this.position.lerp(10 * delta, this.targetPosition);
        this.position.x = clamp(this.position.x, 0, this.viewport.x - this.size.x);
        this.velocity.add(this.position).scalar(1 / delta);
    }

    onRender(batch: PrimitiveBatch) {
        batch.drawRect(
            this.position.x, this.position.y,
            this.size.x, this.size.y,
            this.color.x, this.color.y, this.color.z, this.opacity)
    }
}