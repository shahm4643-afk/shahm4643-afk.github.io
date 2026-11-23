class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.diameter = 5;
    this.color = "red";
  }

  display() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.y -= this.speed;
    } else if (choice < 50) {
      this.y += this.speed;
    } else if (choice < 75) {
      this.x -= this.speed;
    } else {
      this.x += this.speed;
    }
  }
}

let shah;
let othershah;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220); // Moved here so trails stay visible
  noStroke();
  
  shah = new Walker(width / 2, height / 2);
  othershah = new Walker(width / 2, height / 2);
  othershah.color = "blue";
}

function draw() {
  shah.move();
  shah.display();

  othershah.move();
  othershah.display();
}