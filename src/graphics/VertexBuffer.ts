export default class VertexBuffer {
    private static binded: VertexBuffer = null;
    private gl: WebGL2RenderingContext;
    private id: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext, size: number) {
        this.gl = gl;
        this.id = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ARRAY_BUFFER, size, gl.DYNAMIC_DRAW);
    }

    dispose() {
        if (VertexBuffer.binded === this)
            this.unbind();
        this.gl.deleteBuffer(this.id);
        delete this.gl;
        delete this.id;
    }

    bind() {
        if (VertexBuffer.binded === this)
            return;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.id);
        VertexBuffer.binded = this;
    }

    unbind() {
        if (VertexBuffer.binded === null)
            return;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        VertexBuffer.binded = null;
    }

    update(data: ArrayBufferView, length: GLuint) {
        this.bind();
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, data, 0, length);
    }
}
