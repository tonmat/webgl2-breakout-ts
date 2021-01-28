import {clamp} from '../math/index';
import Actor from './Actor';
import Container from "./Container";

export default class Ball extends Actor {
    private container: Container;

    constructor() {
        super();
        this.size.set(10, 10);
        this.position.set(0, 40);
        this.velocity.set(200, 400);
    }

    onContainerResized(container: Container) {
        this.container = container;
    }

    onUpdate(delta: number) {
        if (this.position.x < this.container.left)
            this.velocity.x = Math.abs(this.velocity.x);
        else if (this.position.x > this.container.right - this.size.x)
            this.velocity.x = -Math.abs(this.velocity.x);
        if (this.position.y < this.container.bottom)
            this.velocity.y = Math.abs(this.velocity.y);
        else if (this.position.y > this.container.top - this.size.y)
            this.velocity.y = -Math.abs(this.velocity.y);

        this.position.x = clamp(this.position.x, this.container.left, this.container.right - this.size.x);
        this.position.y = clamp(this.position.y, this.container.bottom, this.container.top - this.size.y);
    }
}
