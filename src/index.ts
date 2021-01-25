import './global.css';
import App from './App';

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');
const app = new App(gl);

function load() {
  app.onInit();

  window.addEventListener('unload', unload);
  window.addEventListener('resize', resize);
  document.body.appendChild(canvas);

  resize();

  let lastUpdateTime = 0;

  function loop(time: number) {
    const delta = time - lastUpdateTime;
    lastUpdateTime = time;
    app.onUpdate(delta);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

function unload() {
  window.removeEventListener('resize', resize);
  window.removeEventListener('unload', unload);
  app.onDispose();
  document.body.removeChild(canvas);
}

function resize() {
  canvas.setAttribute('width', window.innerWidth + 'px');
  canvas.setAttribute('height', window.innerHeight + 'px');
  app.onWindowResize(window.innerWidth, window.innerHeight);
}

window.addEventListener('load', load);

