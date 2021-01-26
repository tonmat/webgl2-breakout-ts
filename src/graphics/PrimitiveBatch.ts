import VertexArray from "./VertexArray";
import IndexBuffer from "./IndexBuffer";
import VertexBuffer from "./VertexBuffer";
import Shader from "./Shader";
import primitiveVS from '../assets/shader/primitive-vs.glsl';
import primitiveFS from '../assets/shader/primitive-fs.glsl';
import {Matrix4} from "../math/Matrix4";

export default class PrimitiveBatch {
    private gl: WebGL2RenderingContext;
    private indices: Uint32Array;
    private indices_pos: number;
    private vertices: Float32Array;
    private vertices_pos: number;
    private vertex_count: number;
    private vao: VertexArray;
    private ibo: IndexBuffer;
    private vbo: VertexBuffer;
    private shader: Shader;

    constructor(gl: WebGL2RenderingContext, capacity: number) {
        this.gl = gl;
        this.indices = new Uint32Array(capacity * 6);
        this.vertices = new Float32Array(capacity * 6 * 4);
        this._projection = new Matrix4();
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

    private _projection: Matrix4;

    get projection() {
        return this._projection;
    }

    dispose() {
        this.vao.dispose();
        this.ibo.dispose();
        this.vbo.dispose();
        this.shader.dispose();
        delete this.gl;
        delete this.indices;
        delete this.indices_pos;
        delete this.vertices;
        delete this.vertices_pos;
        delete this.vertex_count;
        delete this.vao;
        delete this.ibo;
        delete this.vbo;
        delete this.shader;
    }

    begin() {
        this.indices_pos = 0;
        this.vertices_pos = 0;
        this.vertex_count = 0;
    }

    end() {
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

    drawRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number, a: number) {
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
}
