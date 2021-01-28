import Vector3 from '../math/Vector3';
import PrimitiveBatch from '../graphics/PrimitiveBatch';

export default class Actor {
    readonly size = new Vector3();
    readonly position = new Vector3();
    readonly velocity = new Vector3();
    readonly color = new Vector3();
    bounce = 1;
    opacity = 1;

    onUpdate(delta: number) {
    }

    onRender(batch: PrimitiveBatch) {
        batch.drawRect(
            this.position.x, this.position.y,
            this.size.x, this.size.y,
            this.color.x, this.color.y, this.color.z, this.opacity);
    }

    moveAndCollide(delta: number, colliders: Actor[]) {
        const collision = this.getNearestCollision(delta, colliders);
        this.position.fma(delta, this.velocity);
        if (collision) {
            const reflection = 1 + this.bounce;
            this.position.add(
                -Math.abs(collision.normal.x) * reflection * collision.penetration.x,
                -Math.abs(collision.normal.y) * reflection * collision.penetration.y)
            this.velocity.add(
                -Math.abs(collision.normal.x) * reflection * this.velocity.x,
                -Math.abs(collision.normal.y) * reflection * this.velocity.y)
            return collision;
        }
    }

    private getNearestCollision(delta: number, colliders: Actor[]) {
        let nearestCollision;
        for (const collider of colliders) {
            const collision = this.checkCollision(delta, collider);
            if (collision) {
                if (nearestCollision && nearestCollision.time < collision.time)
                    continue;
                nearestCollision = collision;
            }
        }
        return nearestCollision;
    }

    private checkCollision(delta: number, collider: Actor): Collision {
        if (this === collider)
            return null;

        const dx = (this.velocity.x - collider.velocity.x) * delta;
        const dy = (this.velocity.y - collider.velocity.y) * delta;

        // broad phase

        {
            let left = this.position.x
            let right = this.position.x + dx;
            if (left > right) {
                const leftTemp = left;
                left = right;
                right = leftTemp;
            }
            right += this.size.x;

            let bottom = this.position.y;
            let top = this.position.y + dy;
            if (bottom > top) {
                const bottomTemp = bottom;
                bottom = top;
                top = bottomTemp;
            }
            top += this.size.y;

            if (
                (left >= collider.position.x + collider.size.x) ||
                (right <= collider.position.x) ||
                (bottom >= collider.position.y + collider.size.y) ||
                (top <= collider.position.y))
                return null;
        }

        // narrow phase

        const scaleX = 1 / dx;
        const scaleY = 1 / dy;

        let ntx, ftx;
        if (scaleX < 0) {
            ntx = (collider.position.x + collider.size.x) - this.position.x;
            ftx = collider.position.x - this.position.x;
        } else {
            ntx = collider.position.x - (this.position.x + this.size.x);
            ftx = (collider.position.x + collider.size.x) - (this.position.x + this.size.x);
        }
        ntx *= scaleX;
        ftx *= scaleX;

        let nty, fty;
        if (scaleY < 0) {
            nty = (collider.position.y + collider.size.y) - this.position.y;
            fty = collider.position.y - this.position.y;
        } else {
            nty = collider.position.y - (this.position.y + this.size.y);
            fty = (collider.position.y + collider.size.y) - (this.position.y + this.size.y);
        }
        nty *= scaleY;
        fty *= scaleY;

        const t = Math.max(ntx, nty);
        const s = Math.min(ftx, fty);

        if (t <= 1 && s >= 0) {
            const position = {
                x: this.position.x + t * dx,
                y: this.position.y + t * dy,
            };

            const normal = {x: 0, y: 0};
            if (ntx < nty)
                normal.y = -Math.sign(scaleY);
            else
                normal.x = -Math.sign(scaleX);

            const penetration = {
                x: (1 - t) * dx,
                y: (1 - t) * dy
            };

            return {
                collider,
                time: t,
                position,
                normal,
                penetration
            }
        }
        return null;
    }
}

interface Collision {
    collider: Actor;
    time: number;
    position: { x: number, y: number };
    normal: { x: number, y: number };
    penetration: { x: number, y: number };
}