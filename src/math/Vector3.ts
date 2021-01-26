import {clamp} from "./Math";

export default class Vector3 {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    set(x: number | Vector3, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3)
            return this.set(x.x, x.y, x.z);
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    setZero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    add(x: number | Vector3, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3)
            return this.add(x.x, x.y, x.z);
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    sub(x: number | Vector3, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3)
            return this.sub(x.x, x.y, x.z);
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }

    dot(x: number | Vector3, y: number = 0, z: number = 0): number {
        if (x instanceof Vector3)
            return this.dot(x.x, x.y, x.z);
        return this.x * x + this.y * y + this.z * z;
    }

    cross(x: number | Vector3, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3)
            return this.cross(x.x, x.y, x.z);
        return this.set(
            this.y * z - this.z * y,
            this.z * x - this.x * z,
            this.x * y - this.y * x);
    }

    scalar(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    fma(s: number, x: number | Vector3, y: number = 0, z: number = 0): Vector3 {
        if (x instanceof Vector3)
            return this.fma(s, x.x, x.y, x.z);
        this.x += s * x;
        this.y += s * y;
        this.z += s * z;
        return this;
    }

    length2() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(length: number = 1) {
        const invLength = length / this.length();
        this.x *= invLength;
        this.y *= invLength;
        this.z *= invLength;
        return this;
    }

    lerp(i: number, x: number | Vector3, y: number = this.y, z: number = this.z): Vector3 {
        if (x instanceof Vector3)
            return this.lerp(i, x.x, x.y, x.z);
        i = clamp(i, 0, 1);
        this.x += i * (x - this.x);
        this.y += i * (y - this.y);
        this.z += i * (z - this.z);
        return this;
    }
}