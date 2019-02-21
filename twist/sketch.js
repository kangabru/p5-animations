let angle1 = 0, angle2 = 0;
let size = 400, rad = size / 2;

let angleChange = 0, angleRotate = 0;
let angleSlider, rotateSlider, stepsSlider;

function setup() {
    createCanvas(windowWidth, windowHeight - 40, WEBGL);

    // min, max, start, step
    angleSlider = createSlider(0, 100, 50, 1);
    rotateSlider = createSlider(0, 100, 25, 1);
    stepsSlider = createSlider(1, 10, 6, 1);
}

function draw() {
    ortho();
    colorMode(HSL);
    background(255);

    rotateX(angleRotate); // Rotate camera

    // Create path
    let path = [], steps = 100;
    let angle1 = 0, angle2 = HALF_PI;

    for (let i = 0; i < steps; i++) {
        let x = rad * cos(angle1) * cos(angle2);
        let y = rad * sin(angle1) * cos(angle2);
        let z = rad * sin(angle2);
        path.push([x, y, z]);

        angle1 += PI / steps * sin(angleChange) * stepsSlider.value();
        angle2 += PI / steps;
    }

    // Draw line
    noFill();
    stroke(0);
    strokeWeight(3);

    beginShape(); // Render normal path
    for (let i = 0; i < path.length; i++) {
        const v0 = path[i];
        vertex(v0[0], v0[1], v0[2]);
        if (i === 0) vertex(-v0[0], -v0[1], v0[2]); // Join to reversed path
    }
    endShape();

    beginShape(); // Render revered path
    for (let i = 0; i < path.length; i++) {
        const v0 = path[i];
        vertex(-v0[0], -v0[1], v0[2]);
        if (i === path.length - 1) vertex(v0[0], v0[1], v0[2]); // Join to normal path
    }
    endShape();

    // Animate rotation and number of path spins
    angleRotate += rotateSlider.value() / 2 ** 12;
    angleChange += angleSlider.value() / 2 ** 12;

    // Reset limits
    if (angleRotate > TWO_PI) angleRotate -= TWO_PI;
    if (angleChange > TWO_PI) angleChange -= TWO_PI;
}
