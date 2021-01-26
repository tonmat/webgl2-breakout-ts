import PrimitiveBatch from "./graphics/PrimitiveBatch";
import Player from "./actors/Player";
import Ball from "./actors/Ball";
import {clamp} from "./math/Math";
import Vector3 from "./math/Vector3";

const TARGET_RATIO = 1280 / 720;

export default class App {
    private gl: WebGL2RenderingContext;
    private viewport;
    private container;
    private batch;
    private player;
    private ball;
    private mouse;
    private gameOver = false;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.viewport = new Vector3();
        this.container = new Vector3();
        this.batch = new PrimitiveBatch(gl, 1024);
        this.player = new Player();
        this.ball = new Ball();
        this.mouse = new Vector3();
    }

    get isGameOver() {
        return this.gameOver;
    }

    onWindowResize(width: number, height: number) {
        this.viewport.set(width, height);
        this.gl.viewport(0, 0, width, height);
        const ratio = width / height;
        if (ratio < TARGET_RATIO) {
            width = 720 * ratio;
            height = 720;
        } else {
            width = 1280;
            height = 1280 / ratio;
        }
        this.container.set(width, height);
        this.batch.projection.setOrtho(0, width, 0, height, 0, 1);
        this.player.onContainerResized(this.container);
        this.ball.onContainerResized(this.container);
    }

    onMouseMove(x: number, y: number) {
        this.mouse.set(x, this.viewport.y - y);
        this.mouse.x /= this.viewport.x;
        this.mouse.y /= this.viewport.y;
        this.mouse.scalar(2);
        this.mouse.add(-1, -1);
        this.batch.projection.unproject(this.mouse);
        this.player.onMouseMove(this.mouse.x, this.mouse.y);
    }

    onBegin() {
        this.ball.position.x = (this.container.x - this.ball.size.x) / 2
        this.player.position.x = (this.container.x - this.player.size.x) / 2
        this.player.targetPosition.set(this.player.position);
    }

    onUpdate(delta: number) {
        this.player.onUpdate(delta);
        this.ball.onUpdate(delta);

        if (
            this.ball.position.x < this.player.position.x + this.player.size.x &&
            this.ball.position.x + this.ball.size.x > this.player.position.x &&
            this.ball.position.y < this.player.position.y + this.player.size.y &&
            this.ball.position.y + this.ball.size.y > this.player.position.y) {

            this.ball.position.y = this.player.position.y + this.player.size.y;

            let dx = (this.ball.position.x + 0.5 * this.ball.size.x) - (this.player.position.x + 0.5 * this.player.size.x)
            dx = dx / this.player.size.x;
            const speed = this.ball.velocity.length();
            this.ball.velocity.y = 1;
            this.ball.velocity.x = 2 * dx;
            this.ball.velocity.normalize(clamp(speed * 1.02, 0, 2000));
        }

        if (this.ball.position.y <= 0)
            this.gameOver = true;

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.batch.begin();
        this.player.onRender(this.batch);
        this.ball.onRender(this.batch);
        this.batch.end();
    }

    onDispose() {
        this.batch.dispose();
        delete this.gl;
        delete this.batch;
    }
}
