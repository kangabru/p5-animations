let angleChange = 0, angleRotate = 0;
let speedSlider, rotateSlider, wiggleOffsetSlider, wiggleAmountSlider, squircleSlider;
let spheres = [];

let logCount = 0, maxLogs = 100;
function safelog(message) {
    if (logCount < maxLogs) {
        console.log(message);
        logCount += 1;
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight - 40, WEBGL);
    spheres.push(new Squircle(150, 10, 05, 10, 15));

    // min, max, start, step
    speedSlider = createSlider(00, 100, 25, 1);
    rotateSlider = createSlider(0, 100, 25, 1);
    wiggleOffsetSlider = createSlider(0, 100, 50, 1);
    wiggleAmountSlider = createSlider(0, 100, 50, 1);
    squircleSlider = createSlider(0, 100, 100, 1);
}

function draw() {
    ortho();
    colorMode(HSL);
    background(255);

    rotateX(angleRotate);

    spheres.forEach(s => s.draw());
}

class Squircle {
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
        this._wiggleOffset = 0;
        this._wiggleOffsetRate = TWO_PI / 100;
    }

    draw() {
        let paths = [];

        // Create paths
        for (let i = 0; i < this.steps; i++) {
            let path = [];

            let gap = PI / this.steps;
            let angleY = this.offset + gap * i - HALF_PI; // -HALF_PI <-> HALF_PI
            let sinAngleY = sin(angleY);
            let wiggleHeight = min(this.rad / this.steps / 2, this.rad / 10);
            wiggleHeight *= wiggleAmountSlider.value() / 100;

            let angleStep = TWO_PI / 2 ** 6;
            for (let angle = 0; angle <= TWO_PI; angle += angleStep) {

                let squircleAmountRaw = 1 - abs(sinAngleY);
                let squircleAmount = squircleAmountRaw * squircleSlider.value() / 100;
                let angleOffset = angleY;

                let wiggleY = wiggleHeight * sin(this._wiggleOffset + angle * 8) * squircleAmountRaw;
                let y = this.rad * sinAngleY + wiggleY; // -rad <-> rad

                let addPoint = (anglePoint, anglePointAndOffset) => {
                    let partCos = abs(cos(anglePointAndOffset));
                    let partSin = abs(sin(anglePointAndOffset));
                    let radSq = map(squircleAmount, 0, 1, this.rad, this.rad / max(partCos, partSin));

                    let x = radSq * cos(anglePoint) * cos(angleY);
                    let z = radSq * sin(anglePoint) * cos(angleY);
                    path.push([x, y, z]);
                }

                // Add sharp corners to squares
                let angleAndOffset = angle + angleOffset;
                let angleMod = (angleAndOffset + HALF_PI / 2) % HALF_PI;
                if (angleMod < angleStep) {
                    addPoint(angle - angleMod, angleAndOffset - angleMod);
                }

                addPoint(angle, angleAndOffset);
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
        this._wiggleOffset += this._wiggleOffsetRate * wiggleOffsetSlider.value() / 100;

        // Reset limits
        let limit = (number, max) => number > max ? number - max : number;
        this.offset = limit(this.offset, PI / this.steps);
        this.rotX = limit(this.rotX, TWO_PI);
        this.rotY = limit(this.rotY, TWO_PI);
        this.rotZ = limit(this.rotZ, TWO_PI);
        this._wiggleOffset = limit(this._wiggleOffset, TWO_PI);
    }
}