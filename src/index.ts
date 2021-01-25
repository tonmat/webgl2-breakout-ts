import './global.css';

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2');

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);


document.body.appendChild(canvas);