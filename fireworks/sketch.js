let quantitySlider, explodeSlider, rotateSlider, is3dCheckbox;
let gravity, minParticles = 3, explodeParticles;
let angleRotate = 0;
const windowOffset = 60;
let particles = [], fireworks = [];
let is3D = false, is2D = !is3D;

function setup() {
    createCanvas(windowWidth, windowHeight - windowOffset, is3D && WEBGL);

    quantitySlider = createSlider(0, 20, 10, 1);
    explodeSlider = createSlider(0, 40, 20, 1);
    if (is3D) rotateSlider = createSlider(0, 100, 50, 1);

    gravity = vector(0, 0.1, 0);
    for (let i = 0; i < minParticles; i++) {
        particles.push(new Firework());
    }
}

function draw() {
    colorMode(HSL);
    background([0, 0, 100, 0.1]);

    if (is3D) {
        translate(0, windowHeight / 2 - 100);
        angleMode(DEGREES);
        rotateX(10);

        angleMode(RADIANS);
        rotateY(angleRotate);

        strokeWeight(3);
        stroke(0);

        const size = 20;
        beginShape();
        vertex(-size, 0, -size);
        vertex(size, 0, -size);
        vertex(size, 0, size);
        vertex(-size, 0, size);
        vertex(-size, 0, -size);
        endShape();
    } else {
        translate(windowWidth / 2, windowHeight - windowOffset - 10);
    }

    strokeWeight(3);
    stroke(0);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    particles = particles.filter(particle => !particle.canDelete());
    fireworks = fireworks.filter(firework => !firework.canDelete());

    if (is3D) angleRotate += rotateSlider.value() / 2 ** 12;

    while (fireworks.length < quantitySlider.value()) {
        let firework = new Firework();
        particles.push(firework);
        fireworks.push(firework);
    }
}
