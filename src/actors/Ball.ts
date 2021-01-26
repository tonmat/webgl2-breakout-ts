import Vector3 from "../math/Vector3";
import {clamp} from "../math/Math";
import PrimitiveBatch from "../graphics/PrimitiveBatch";

export default class Ball {
    readonly size = new Vector3();
    readonly position = new Vector3();
    readonly velocity = new Vector3().set(200, 400);
    readonly color = new Vector3();
    opacity = 1;
    private viewport = new Vector3().set(1280, 720);

    onWindowResize(width: number, height: number) {
        this.viewport.set(width, height, 0);
        this.size.set(10, 10);
    }

    onUpdate(delta: number) {
        this.position.fma(delta, this.velocity);

        if (this.position.x < 0)
            this.velocity.x = Math.abs(this.velocity.x);
        else if (this.position.x > this.viewport.x - this.size.x)
            this.velocity.x = -Math.abs(this.velocity.x);
        if (this.position.y < 0)
            this.velocity.y = Math.abs(this.velocity.y);
        else if (this.position.y > this.viewport.y - this.size.y)
            this.velocity.y = -Math.abs(this.velocity.y);

        this.position.x = clamp(this.position.x, 0, this.viewport.x - this.size.x);
        this.position.y = clamp(this.position.y, 0, this.viewport.y - this.size.y);
    }

    onRender(batch: PrimitiveBatch) {
        batch.drawRect(
            this.position.x, this.position.y,
            this.size.x, this.size.y,
            this.color.x, this.color.y, this.color.z, this.opacity)
    }
}