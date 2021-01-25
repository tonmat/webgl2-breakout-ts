function createShader(gl: WebGL2RenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (status === false) {
    console.error('could not compile shader');
    console.error(source);
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return 0;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  const status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (status === false) {
    console.error('could not link program');
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return 0;
  }
  return program;
}

export default class Shader {
  private static binded: Shader = null;
  private readonly gl: WebGL2RenderingContext;
  private readonly id: WebGLProgram;
  private readonly uniformLocationMap: { [key: string]: WebGLUniformLocation } = {};

  constructor(gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string) {
    this.gl = gl;
    this.id = createProgram(gl, vertexShader, fragmentShader);
  }

  dispose() {
    this.gl.deleteProgram(this.id);
  }

  bind() {
    if (Shader.binded === this)
      return;
    this.gl.useProgram(this.id);
    Shader.binded = this;
  }

  unbind() {
    if (Shader.binded === null)
      return;
    this.gl.useProgram(null);
    Shader.binded = null;
  }

  setUniformMatrix4(name: string, data: Float32List) {
    this.bind();
    this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, data);
  }

  private getUniformLocation(name: string) {
    let location = this.uniformLocationMap[name];
    if (location === undefined) {
      location = this.gl.getUniformLocation(this.id, name);
      this.uniformLocationMap[name] = location;
    }
    return location;
  }
}
