let angleChange = 0, angleRotate = 0;
let slide1, slider2, slider3;

const radius = 200;
let offset = 0;
let points = [];

let diff = 0.1;

function setup() {
    createCanvas(windowWidth, windowHeight - 50);

    slider1 = createSlider(0, 100, 5);
    slider2 = createSlider(0, 100, 50);
    slider3 = createSlider(0, 100, 50);

    for (let x = 0; x < 100; x++) {
        for (let y = 0; y < 100; y++) {
            let dx = map(x, 0, 100, -radius, radius);
            let dy = map(y, 0, 100, -radius, radius);
            let v = createVector(dx, dy);
            if (v.mag() <= radius)
                points.push(v)
        }
    }
}

function draw() {
    translate(width / 2, height / 2);
    // scale(0.5);
    background(255);

    stroke(0);
    noFill();
    strokeWeight(1);

    ellipse(0, 0, radius * 2);

    diff = slider1.value() / 1000;
    let s2 = slider2.value();
    let s3 = slider3.value();

    for (let i = 0; i < points.length; i++) {
        const v = points[i];

        let f = 50 + s2 * 5;

        let rad = v.mag();
        let angle = acos(v.x / v.mag()) / (v.x > 0 ? 1 : -1);

        let maxDisAngle = HALF_PI;
        let maxDisRad = radius - rad; // Max displacement in center

        let nAngle = angle + n(v.x / f, v.y / f, offset) * maxDisAngle;
        let nRad = rad + n(v.x / f + 100, v.y / f + 100, offset) * maxDisRad;
        nRad = nRad < 0 ? -nRad : nRad;

        let x = cos(nAngle) * nRad;
        let y = sin(nAngle) * nRad;

        point(x, y);
    }

    offset += diff;
}

function n(x, y, z) {
    return noise(x, y, z) * 2 - 1;
    // let noises = [];
    // for (let i = 0; i < 5; i++) {
    //     const iDiff = diff * i;
    //     let _noise = noise(x + iDiff, y + iDiff, z + iDiff) * 2 - 1;
    //     noises.push(_noise);
    // }
    // return noises.reduce((p, c) => p + c, 0) / noises.length;
}