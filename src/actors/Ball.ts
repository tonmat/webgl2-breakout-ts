import Vector3 from "../math/Vector3";
import {clamp} from "../math/Math";
import PrimitiveBatch from "../graphics/PrimitiveBatch";

export default class Ball {
    readonly size = new Vector3().set(10, 10);
    readonly position = new Vector3().set(0, 40);
    readonly velocity = new Vector3().set(200, 400);
    readonly color = new Vector3();
    opacity = 1;
    private container = new Vector3().set(1280, 720);

    onContainerResized(container: Vector3) {
        this.container.set(container);
    }

    onUpdate(delta: number) {
        this.position.fma(delta, this.velocity);

        if (this.position.x < 0)
            this.velocity.x = Math.abs(this.velocity.x);
        else if (this.position.x > this.container.x - this.size.x)
            this.velocity.x = -Math.abs(this.velocity.x);
        if (this.position.y < 0)
            this.velocity.y = Math.abs(this.velocity.y);
        else if (this.position.y > this.container.y - this.size.y)
            this.velocity.y = -Math.abs(this.velocity.y);

        this.position.x = clamp(this.position.x, 0, this.container.x - this.size.x);
        this.position.y = clamp(this.position.y, 0, this.container.y - this.size.y);
    }

    onRender(batch: PrimitiveBatch) {
        batch.drawRect(
            this.position.x, this.position.y,
            this.size.x, this.size.y,
            this.color.x, this.color.y, this.color.z, this.opacity)
    }
}