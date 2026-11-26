// Fireworks OOP
const PARTICLES_PER_CLICK = 100;

class Particle {
  constructor(x, y) {
    this.x = x, 
    this.y = y,
    this.dx = random(5, -5);
    this.dy = random(5, -5);
    this.diameter = 7;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.opacity = 255;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.diameter);
  }

  
  update() {
    this.x += this.dx;
    this.y += this.dy;

    this.opacity--;


  }
}

let theFireworks = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  firework = new Particle(width/2, height/2);
}

function draw() {
  background("black");
  for (let firework of theFireworks) {
    firework.update();
    firework.display();
  }
}

function mousePressed() {
  for (let i = 0; i < PARTICLES_PER_CLICK; i++) {
    let somefirworks = new Particle(mouseX, mouseY);
    theFireworks.push(somefirworks);
  }

}