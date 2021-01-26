export default class IndexBuffer {
    private static binded: IndexBuffer = null;
    private gl: WebGL2RenderingContext;
    private id: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext, size: number) {
        this.gl = gl;
        this.id = gl.createBuffer();
        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, size, gl.DYNAMIC_DRAW);
    }

    dispose() {
        if (IndexBuffer.binded === this)
            this.unbind();
        this.gl.deleteBuffer(this.id);
        delete this.gl;
        delete this.id;
    }

    bind() {
        if (IndexBuffer.binded === this)
            return;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.id);
        IndexBuffer.binded = this;
    }

    unbind() {
        if (IndexBuffer.binded === null)
            return;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        IndexBuffer.binded = null;
    }

    update(data: ArrayBufferView, length: GLuint) {
        this.bind();
        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, data, 0, length);
    }
}
