import './global.css';
import App from './App';

function load() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    const app = new App(gl);

    function unload() {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', mousemove)
        window.addEventListener('keyup', keyup)
        app.onDispose();
        document.body.removeChild(canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
    }

    function resize() {
        canvas.setAttribute('width', window.innerWidth + 'px');
        canvas.setAttribute('height', window.innerHeight + 'px');
        app.onWindowResize(window.innerWidth, window.innerHeight);
    }

    function mousemove(e: MouseEvent) {
        app.onMouseMove(e.clientX, e.clientY);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mousemove)
    window.removeEventListener('keyup', keyup)
    document.body.appendChild(canvas);

    resize();

    let lastUpdateTime = 0;

    function loop(time: number) {
        if (lastUpdateTime === 0) {
            app.onBegin();
            lastUpdateTime = time;
            requestAnimationFrame(loop);
            return;
        }

        const delta = time - lastUpdateTime;
        lastUpdateTime = time;
        app.onUpdate(0.001 * delta);
        if (app.isGameOver)
            unload();
        else
            requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

function keyup(e: KeyboardEvent) {
    if (e.key === 'ScrollLock' && e.altKey) {
        load();
    }
}

window.addEventListener('keyup', keyup)