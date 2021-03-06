import VertexBuffer from './VertexBuffer';

export default class VertexArray {
    private static binded: VertexArray = null;
    private gl: WebGL2RenderingContext;
    private id: WebGLVertexArrayObject;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.id = gl.createVertexArray();
        this.bind();
    }

    dispose() {
        if (VertexArray.binded === this)
            this.unbind();
        this.gl.deleteVertexArray(this.id);
        delete this.gl;
        delete this.id;
    }

    bind() {
        if (VertexArray.binded === this)
            return;
        this.gl.bindVertexArray(this.id);
        VertexArray.binded = this;
    }

    unbind() {
        if (VertexArray.binded === null)
            return;
        this.gl.bindVertexArray(null);
        VertexArray.binded = null;
    }

    setAttribute(buffer: VertexBuffer, index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr) {
        this.bind();
        buffer.bind();
        this.gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
        this.gl.enableVertexAttribArray(index);
    }
}
