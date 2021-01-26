export function clamp(n: number, min: number, max: number) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
}

export function lerp(i: number, a: number, b: number) {
    return a + clamp(i, 0, 1) * (b - a);
}