let vector = (x, y, z) => createVector(x, y, z);
let r = (mag) => mag ? random(mag) : random(-1, 1);

class Particle {
    constructor(pos, vel, color) {
        this.pos = (pos && pos.copy()) || vector(0, 0, 0);
        this.vel = (vel && vel.copy()) || vector(0, 0, 0);
        this.color = color || [random(255), random(255), random(255)];
    }

    update() {
        this.pos = this.pos.add(this.vel);
        this.vel = this.vel.add(gravity);
    }

    draw() {
        stroke(0);
        strokeWeight(10);
        stroke(this.color);
        const p = this.pos;
        point(p.x, p.y, p.z);
    }

    canDelete() {
        return this.pos.y > 0 || (is2D && (this.pos.x < -windowWidth / 2 || this.pos.x > windowWidth / 2));
    }
}

class Firework extends Particle {
    constructor() {
        let pos = vector(0, 0, 0);
        let vel = vector(r(), -r(5), r()).normalize().mult(3 + r(6));
        super(pos, vel);

        this.limit = random(200);
        this.time = 0;
        this.timeVelOffset = 2 * r();
        this.isDead = false;

    }

    update() {
        super.update();
        this.time += 1;

        // Explode at apex
        if (this.vel.y >= this.timeVelOffset) {
            if (!this.isDead) for (let i = 0; i < explodeSlider.value(); i++) {
                particles.push(new Explosion(this.pos, this.vel, this.color));
            }

            this.isDead = true;
        }
    }

    canDelete() {
        return super.canDelete() || this.isDead;
    }
}

class Explosion extends Particle {
    constructor(initPos, initVel, color) {
        let newVel = vector(r(), r(-4), r()).normalize().mult(2 + r(4));
        super(initPos, newVel.add(initVel), color);
    }

    draw() {
        stroke(0);
        strokeWeight(4);
        stroke(this.color);
        const p = this.pos;
        point(p.x, p.y, p.z);
    }
}