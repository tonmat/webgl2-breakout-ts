import VertexArray from './graphics/VertexArray';
import IndexBuffer from './graphics/IndexBuffer';
import VertexBuffer from './graphics/VertexBuffer';
import Shader from './graphics/Shader';
import primitiveVS from './assets/shader/primitive-vs.glsl';
import primitiveFS from './assets/shader/primitive-fs.glsl';

export default class App {
  private readonly gl: WebGL2RenderingContext;
  private indices: Uint32Array;
  private indices_pos: number;
  private vertices: Float32Array;
  private vertices_pos: number;
  private vertex_count: number;
  private projection: Float32Array;
  private vao: VertexArray;
  private ibo: IndexBuffer;
  private vbo: VertexBuffer;
  private shader: Shader;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.indices = new Uint32Array(8192 * 6);
    this.vertices = new Float32Array(8192 * 6 * 4);
    this.projection = new Float32Array(16);
    this.vao = new VertexArray(gl);
    this.ibo = new IndexBuffer(gl, this.indices.byteLength);
    this.vbo = new VertexBuffer(gl, this.vertices.byteLength);
    this.vao.setAttribute(this.vbo, 0, 2, gl.FLOAT, false, 6 * 4, 0);
    this.vao.setAttribute(this.vbo, 1, 4, gl.FLOAT, false, 6 * 4, 2 * 4);
    this.vao.unbind();
    this.ibo.unbind();
    this.vbo.unbind();
    this.shader = new Shader(gl, primitiveVS, primitiveFS);
  }

  onInit() {
  }

  onWindowResize(width: number, height: number) {
    this.gl.viewport(0, 0, width, height);
    this.setOrtho(0, width, 0, height, 0, 1);
  }

  onUpdate(delta: number) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.begin();
    this.drawRect(100, 100, 100, 100, 1, 1, 1, 1);
    this.end();
  }

  onDispose() {
  }

  private setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    this.projection[0] = 2 / (right - left);
    this.projection[1] = 0;
    this.projection[2] = 0;
    this.projection[3] = 0;

    this.projection[4] = 0;
    this.projection[5] = 2 / (top - bottom);
    this.projection[6] = 0;
    this.projection[7] = 0;

    this.projection[8] = 0;
    this.projection[9] = 0;
    this.projection[10] = -2 / (far - near);
    this.projection[11] = 0;

    this.projection[12] = -(right + left) / (right - left);
    this.projection[13] = -(top + bottom) / (top - bottom);
    this.projection[14] = -(far + near) / (far - near);
    this.projection[15] = 1;
  }

  private begin() {
    this.indices_pos = 0;
    this.vertices_pos = 0;
    this.vertex_count = 0;
  }

  private end() {
    this.ibo.update(this.indices, this.indices_pos);
    this.ibo.unbind();
    this.vbo.update(this.vertices, this.vertices_pos);
    this.vbo.unbind();

    this.vao.bind();
    this.shader.setUniformMatrix4('u_proj', this.projection);
    this.gl.drawElements(this.gl.TRIANGLES, this.indices_pos, this.gl.UNSIGNED_INT, 0);
    this.shader.unbind();
    this.vao.unbind();
  }

  private putIndex(i: number) {
    this.indices[this.indices_pos++] = i;
  }

  private putVertex(x: number, y: number, r: number, g: number, b: number, a: number) {
    this.vertices[this.vertices_pos++] = x;
    this.vertices[this.vertices_pos++] = y;
    this.vertices[this.vertices_pos++] = r;
    this.vertices[this.vertices_pos++] = g;
    this.vertices[this.vertices_pos++] = b;
    this.vertices[this.vertices_pos++] = a;
    this.vertex_count++;
  }

  private drawRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number, a: number) {
    this.putIndex(this.vertex_count);
    this.putIndex(this.vertex_count + 1);
    this.putIndex(this.vertex_count + 2);
    this.putIndex(this.vertex_count + 2);
    this.putIndex(this.vertex_count + 3);
    this.putIndex(this.vertex_count);
    this.putVertex(x, y, r, g, b, a);
    this.putVertex(x + w, y, r, g, b, a);
    this.putVertex(x + w, y + h, r, g, b, a);
    this.putVertex(x, y + h, r, g, b, a);
  }
}
