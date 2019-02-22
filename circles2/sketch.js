let offset = 0, rotateAngle = 0;
let speedSlider, sizeSlider;
let spheres = [];

function setup() {
    createCanvas(windowWidth, windowHeight - 40, WEBGL);
    spheres.push(new Sphere(150));
    // spheres.push(new Sphere(090, 6, 15, 20, 25, [00, 00, 80]));

    // min, max, start, step
    speedSlider = createSlider(0, 100, 50, 1);
    sizeSlider = createSlider(0, 100, 50, 1);
}

function draw() {
    // ortho();
    colorMode(HSL);
    background(255);

    rotateY(rotateAngle);

    spheres.forEach(s => s.draw());

    offset += speedSlider.value() / 2 ** 13;
    if (offset > PI) offset -= PI;

    rotateAngle += speedSlider.value() / 2 ** 13;
    if (rotateAngle > TWO_PI) rotateAngle -= TWO_PI;
}

class Sphere {
    constructor(radius, color = undefined) {
        this.rad = radius;
        this.color = color;
    }

    draw() {
        noFill();
        strokeWeight(3);

        // Create paths
        const stepsY = 8, stepsX = 6;
        const stepY = TWO_PI / stepsY, stepX = PI / stepsX;

        let isOdd = true;
        for (let ax = 0; ax < PI; ax += stepX) {
            let axo = ax - HALF_PI;
            axo += offset;
            if (axo > HALF_PI) axo -= PI;

            for (let ay = 0; ay < TWO_PI; ay += stepY) {
                let ayo = ay + (isOdd ? stepY / 2 : 0)
                rotateY(ayo);
                rotateX(axo);
                translate(0, 0, this.rad);

                let axMap = map(cos(ax), -1, 1, 0, 255);
                let ayMap = map(cos(ay + rotateAngle), -1, 1, 0.1, 1)
                stroke([axMap, 80, 50, ayMap]);
                let radMax = 2 * PI * this.rad / stepsY * 0.7;
                let radAct = radMax * cos(axo);
                ellipse(0, 0, radAct);

                // Draw secondary circles
                const iSteps = 3;
                let iSize = sizeSlider.value() / 5;
                for (let i = 1; i <= iSteps; i++) {
                    let iDist = i * iSize * cos(axo);
                    let iRad = radAct - iDist;
                    translate(0, 0, iDist);
                    ellipse(0, 0, iRad);
                    translate(0, 0, -iDist);
                }

                translate(0, 0, -this.rad);
                rotateX(-axo);
                rotateY(-ayo);
            }

            isOdd = !isOdd;
        }
    }
}