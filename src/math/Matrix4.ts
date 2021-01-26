import Vector3 from "./Vector3";

export class Matrix4 {
    private static temp = new Matrix4();
    readonly data: Float32Array;

    constructor() {
        this.data = new Float32Array(16);
        this.setIdentity();
    }

    set(
        m00: number | Matrix4, m01: number = 0, m02: number = 0, m03: number = 0,
        m10: number = 0, m11: number = 0, m12: number = 0, m13: number = 0,
        m20: number = 0, m21: number = 0, m22: number = 0, m23: number = 0,
        m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 0) {

        if (m00 instanceof Matrix4) {
            for (let i = 0; i < 16; i++)
                this.data[i] = m00.data[i];
            return this;
        }

        /* @formatter:off */
        this.data[0] = m00; this.data[4] = m01; this.data[8] = m02; this.data[12] = m03;
        this.data[1] = m10; this.data[5] = m11; this.data[9] = m12; this.data[13] = m13;
        this.data[2] = m20; this.data[6] = m21; this.data[10] = m22; this.data[14] = m23;
        this.data[3] = m30; this.data[7] = m31; this.data[11] = m32; this.data[15] = m33;
        /* @formatter:on */
        return this;
    }

    setIdentity() {
        return this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
    }

    setTranslation(v: Vector3) {
        return this.set(
            0, 0, 0, v.x,
            0, 0, 0, v.y,
            0, 0, 0, v.z,
            0, 0, 0, 1);
    }

    setScale(v: Vector3) {
        return this.set(
            v.x, 0, 0, 0,
            0, v.y, 0, 0,
            0, 0, v.z, 0,
            0, 0, 0, 1)
    }

    setRotationX(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return this.set(
            1, 0, 0, 0,
            0, cos, -sin, 0,
            0, sin, cos, 0,
            0, 0, 0, 1)
    }

    setRotationY(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return this.set(
            cos, 0, sin, 0,
            0, 1, 0, 0,
            -sin, 0, cos, 0,
            0, 0, 0, 1,
        )
    }

    setRotationZ(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return this.set(
            cos, -sin, 0, 0,
            sin, cos, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        )
    }

    setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        return this.set(
            2 / (right - left), 0, 0, (right + left) / (left - right),
            0, 2 / (top - bottom), 0, (top + bottom) / (bottom - top),
            0, 0, 2 / (near - far), (far + near) / (near - far),
            0, 0, 0, 1);
    }

    multiply(other: Matrix4) {
        for (let row = 0; row < 4; row++) {
            let c0 = 0;
            let c1 = 0;
            let c2 = 0;
            let c3 = 0;
            for (let col = 0; col < 4; col++) {
                const r = this.data[row + col * 4];
                c0 += r * other.data[col];
                c1 += r * other.data[col + 4];
                c2 += r * other.data[col + 8];
                c3 += r * other.data[col + 12];
            }
            this.data[row] = c0;
            this.data[row + 4] = c1;
            this.data[row + 8] = c2;
            this.data[row + 12] = c3;
        }

        return this;
    }

    translate(v: Vector3) {
        return this.multiply(Matrix4.temp.setTranslation(v));
    }

    scale(v: Vector3) {
        return this.multiply(Matrix4.temp.setScale(v));
    }

    rotateX(angle: number) {
        return this.multiply(Matrix4.temp.setRotationX(angle));
    }

    rotateY(angle: number) {
        return this.multiply(Matrix4.temp.setRotationY(angle));
    }

    rotateZ(angle: number) {
        return this.multiply(Matrix4.temp.setRotationZ(angle));
    }

    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
        return this.multiply(Matrix4.temp.setOrtho(left, right, bottom, top, near, far));
    }

    determinant() {
        return (
            this.data[0] * this.data[5] * this.data[10] * this.data[15] + this.data[0] * this.data[9] * this.data[14] * this.data[7] + this.data[0] * this.data[13] * this.data[6] * this.data[11] -
            this.data[0] * this.data[13] * this.data[10] * this.data[7] - this.data[0] * this.data[9] * this.data[6] * this.data[15] - this.data[0] * this.data[5] * this.data[14] * this.data[11] -
            this.data[4] * this.data[1] * this.data[10] * this.data[15] - this.data[8] * this.data[1] * this.data[14] * this.data[7] - this.data[12] * this.data[1] * this.data[6] * this.data[11] +
            this.data[12] * this.data[1] * this.data[10] * this.data[7] + this.data[8] * this.data[1] * this.data[6] * this.data[15] + this.data[4] * this.data[1] * this.data[14] * this.data[11] +
            this.data[4] * this.data[9] * this.data[2] * this.data[15] + this.data[8] * this.data[13] * this.data[2] * this.data[7] + this.data[12] * this.data[5] * this.data[2] * this.data[11] -
            this.data[12] * this.data[9] * this.data[2] * this.data[7] - this.data[8] * this.data[5] * this.data[2] * this.data[15] - this.data[4] * this.data[13] * this.data[2] * this.data[11] -
            this.data[4] * this.data[9] * this.data[14] * this.data[3] - this.data[8] * this.data[13] * this.data[6] * this.data[3] - this.data[12] * this.data[5] * this.data[10] * this.data[3] +
            this.data[12] * this.data[9] * this.data[6] * this.data[3] + this.data[8] * this.data[5] * this.data[14] * this.data[3] + this.data[4] * this.data[13] * this.data[10] * this.data[3]);
    }

    invert() {
        const det = this.determinant();
        if (det === 0) {
            console.warn('cannot invert matrix!');
            return this;
        }
        const invDet = 1 / det;
        this.set(
            this.data[5] * this.data[10] * this.data[15] + this.data[9] * this.data[14] * this.data[7] + this.data[13] * this.data[6] * this.data[11] - this.data[13] * this.data[10] * this.data[7] - this.data[9] * this.data[6] * this.data[15] - this.data[5] * this.data[14] * this.data[11],
            -this.data[4] * this.data[10] * this.data[15] - this.data[8] * this.data[14] * this.data[7] - this.data[12] * this.data[6] * this.data[11] + this.data[12] * this.data[10] * this.data[7] + this.data[8] * this.data[6] * this.data[15] + this.data[4] * this.data[14] * this.data[11],
            this.data[4] * this.data[9] * this.data[15] + this.data[8] * this.data[13] * this.data[7] + this.data[12] * this.data[5] * this.data[11] - this.data[12] * this.data[9] * this.data[7] - this.data[8] * this.data[5] * this.data[15] - this.data[4] * this.data[13] * this.data[11],
            -this.data[4] * this.data[9] * this.data[14] - this.data[8] * this.data[13] * this.data[6] - this.data[12] * this.data[5] * this.data[10] + this.data[12] * this.data[9] * this.data[6] + this.data[8] * this.data[5] * this.data[14] + this.data[4] * this.data[13] * this.data[10],

            -this.data[1] * this.data[10] * this.data[15] - this.data[9] * this.data[14] * this.data[3] - this.data[13] * this.data[2] * this.data[11] + this.data[13] * this.data[10] * this.data[3] + this.data[9] * this.data[2] * this.data[15] + this.data[1] * this.data[14] * this.data[11],
            this.data[0] * this.data[10] * this.data[15] + this.data[8] * this.data[14] * this.data[3] + this.data[12] * this.data[2] * this.data[11] - this.data[12] * this.data[10] * this.data[3] - this.data[8] * this.data[2] * this.data[15] - this.data[0] * this.data[14] * this.data[11],
            -this.data[0] * this.data[9] * this.data[15] - this.data[8] * this.data[13] * this.data[3] - this.data[12] * this.data[1] * this.data[11] + this.data[12] * this.data[9] * this.data[3] + this.data[8] * this.data[1] * this.data[15] + this.data[0] * this.data[13] * this.data[11],
            this.data[0] * this.data[9] * this.data[14] + this.data[8] * this.data[13] * this.data[2] + this.data[12] * this.data[1] * this.data[10] - this.data[12] * this.data[9] * this.data[2] - this.data[8] * this.data[1] * this.data[14] - this.data[0] * this.data[13] * this.data[10],

            this.data[1] * this.data[6] * this.data[15] + this.data[5] * this.data[14] * this.data[3] + this.data[13] * this.data[2] * this.data[7] - this.data[13] * this.data[6] * this.data[3] - this.data[5] * this.data[2] * this.data[15] - this.data[1] * this.data[14] * this.data[7],
            -this.data[0] * this.data[6] * this.data[15] - this.data[4] * this.data[14] * this.data[3] - this.data[12] * this.data[2] * this.data[7] + this.data[12] * this.data[6] * this.data[3] + this.data[4] * this.data[2] * this.data[15] + this.data[0] * this.data[14] * this.data[7],
            this.data[0] * this.data[5] * this.data[15] + this.data[4] * this.data[13] * this.data[3] + this.data[12] * this.data[1] * this.data[7] - this.data[12] * this.data[5] * this.data[3] - this.data[4] * this.data[1] * this.data[15] - this.data[0] * this.data[13] * this.data[7],
            -this.data[0] * this.data[5] * this.data[14] - this.data[4] * this.data[13] * this.data[2] - this.data[12] * this.data[1] * this.data[6] + this.data[12] * this.data[5] * this.data[2] + this.data[4] * this.data[1] * this.data[14] + this.data[0] * this.data[13] * this.data[6],

            -this.data[1] * this.data[6] * this.data[11] - this.data[5] * this.data[10] * this.data[3] - this.data[9] * this.data[2] * this.data[7] + this.data[9] * this.data[6] * this.data[3] + this.data[5] * this.data[2] * this.data[11] + this.data[1] * this.data[10] * this.data[7],
            this.data[0] * this.data[6] * this.data[11] + this.data[4] * this.data[10] * this.data[3] + this.data[8] * this.data[2] * this.data[7] - this.data[8] * this.data[6] * this.data[3] - this.data[4] * this.data[2] * this.data[11] - this.data[0] * this.data[10] * this.data[7],
            -this.data[0] * this.data[5] * this.data[11] - this.data[4] * this.data[9] * this.data[3] - this.data[8] * this.data[1] * this.data[7] + this.data[8] * this.data[5] * this.data[3] + this.data[4] * this.data[1] * this.data[11] + this.data[0] * this.data[9] * this.data[7],
            this.data[0] * this.data[5] * this.data[10] + this.data[4] * this.data[9] * this.data[2] + this.data[8] * this.data[1] * this.data[6] - this.data[8] * this.data[5] * this.data[2] - this.data[4] * this.data[1] * this.data[10] - this.data[0] * this.data[9] * this.data[6]);
        for (let i = 0; i < 16; i++)
            this.data[i] *= invDet;
        return this;
    }

    project(v: Vector3) {
        return v.set(
            this.data[0] * v.x + this.data[4] * v.y + this.data[8] * v.z + this.data[12],
            this.data[1] * v.x + this.data[5] * v.y + this.data[9] * v.z + this.data[13],
            this.data[2] * v.x + this.data[6] * v.y + this.data[10] * v.z + this.data[14]);
    }

    unproject(v: Vector3) {
        return Matrix4.temp.set(this).invert().project(v);
    }
}