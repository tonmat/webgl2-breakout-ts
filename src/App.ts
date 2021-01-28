import PrimitiveBatch from './graphics/PrimitiveBatch';
import Player from './actors/Player';
import Ball from './actors/Ball';
import {clamp} from './math/index';
import Vector3 from './math/Vector3';
import Actor from "./actors/Actor";

const TARGET_RATIO = 1280 / 720;

export default class App {
    private gl: WebGL2RenderingContext;
    private viewport;
    private container;
    private batch;
    private actors;
    private player;
    private ball;
    private mouse;
    private gameOver = false;
    private gameOverPre = false;
    private time = 0;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.viewport = new Vector3();
        this.container = new Vector3();
        this.batch = new PrimitiveBatch(gl, 1024);
        this.player = new Player();
        this.ball = new Ball();
        this.actors = Array<Actor>();
        this.actors.push(this.player);
        this.actors.push(this.ball);
        this.mouse = new Vector3();
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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
        if (this.gameOverPre) {
            this.time += delta;
            this.player.opacity = clamp(1 - this.time, 0, 1);
            if (this.time >= 1)
                this.gameOver = true;
        } else {
            this.time += delta;
            for (const actor of this.actors)
                actor.onUpdate(delta);

            if (this.ball.moveAndCollide(delta, [this.player])) {
                let dx = (this.ball.position.x + 0.5 * this.ball.size.x) - (this.player.position.x + 0.5 * this.player.size.x)
                dx = dx / this.player.size.x;
                this.ball.velocity.y = Math.sign(this.ball.velocity.y);
                this.ball.velocity.x = 2 * dx;
                this.ball.velocity.normalize(clamp(this.time * 4, 400, 2000));
            }

            if (this.ball.position.y <= 0) {
                this.actors.splice(this.actors.indexOf(this.ball), 1)
                this.gameOverPre = true;
                this.time = 0;
            }
        }

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.batch.begin();
        for (const actor of this.actors)
            actor.onRender(this.batch);
        this.batch.end();
    }

    onDispose() {
        this.batch.dispose();
        delete this.gl;
        delete this.batch;
    }
}
