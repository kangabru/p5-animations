let angleChange = 0, angleRotate = 0;
let speedSlider, rotateSlider;
let spheres = [];

function setup() {
    createCanvas(windowWidth, windowHeight - 40, WEBGL);
    spheres.push(new Sphere(150, 4, 05, 10, 15));
    spheres.push(new Sphere(090, 6, 15, 20, 25, [00, 00, 80]));

    // min, max, start, step
    speedSlider = createSlider(0, 100, 50, 1);
    rotateSlider = createSlider(0, 100, 50, 1);
}

function draw() {
    ortho();
    colorMode(HSL);
    background(255);

    rotateX(angleRotate);

    spheres.forEach(s => s.draw());
}

class Sphere {
    constructor(radius, steps = 5, rotX = 0, rotY = 0, rotZ = 0, color = undefined) {
        this.steps = steps;
        this.rad = radius;
        this.offset = random(0, PI);
        this.rotX = random(TWO_PI);
        this.rotY = random(TWO_PI);
        this.rotZ = random(TWO_PI);
        this.rotRateX = rotX;
        this.rotRateY = rotY;
        this.rotRateZ = rotZ;
        this.color = color;
    }

    draw() {
        let paths = [];

        // Create paths
        for (let i = 0; i < this.steps; i++) {
            let path = [];

            let gap = PI / this.steps;
            let angleY = this.offset + gap * i - PI / 2;
            let y = this.rad * sin(angleY);

            for (let angle = 0; angle < TWO_PI; angle += TWO_PI / 100) {
                let x = this.rad * cos(angle) * cos(angleY);
                let z = this.rad * sin(angle) * cos(angleY);
                path.push([x, y, z]);
            }

            paths.push(path);
        }

        // Draw paths
        noFill();
        strokeWeight(3);

        rotateX(this.rotX);
        rotateY(this.rotY);
        rotateZ(this.rotZ);

        paths.forEach(path => {
            let y = path[0][1];
            let color = this.color || [map(y, -this.rad, this.rad, 0, 255), 100, 70];
            stroke(color);
            beginShape();
            path.forEach(v => { vertex(v[0], v[1], v[2]) });
            endShape();
        });

        rotateX(-this.rotX);
        rotateY(-this.rotY);
        rotateZ(-this.rotZ);

        // Animate variables
        this.offset += speedSlider.value() / 2 ** 12;

        let speedFact = rotateSlider.value() / 2 ** 16;
        this.rotX += this.rotRateX * speedFact;
        this.rotY += this.rotRateY * speedFact;
        this.rotZ += this.rotRateZ * speedFact;

        // Reset limits
        let limit = (number, max) => number > max ? number - max : number;
        this.offset = limit(this.offset, PI / this.steps);
        this.rotX = limit(this.rotX, TWO_PI);
        this.rotY = limit(this.rotY, TWO_PI);
        this.rotZ = limit(this.rotZ, TWO_PI);
    }
}