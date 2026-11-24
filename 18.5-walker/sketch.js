// Walker demo


class Walker {
  constructor(x, y, theColor) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.diameter = 5;
    this.color = theColor;
  }

  display() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.y -= this.speed;
    } 
    else if (choice < 50) {
      this.y += this.speed;
    } 
    else if (choice < 75) {
      this.x -= this.speed;
    } 
    else {
      this.x += this.speed;
    }
  }
}

// let shah;
// let othershah;
let theWalkers = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220); // Moved here so trails stay visible
  // shah = new Walker(width / 2, height / 2);
  // othershah = new Walker(width / 2, height / 2);
  // othershah.color = "blue";
  noStroke();
  
}

function draw() {
  // shah.move();
  // shah.display();

  // othershah.move();
  // othershah.display();
  for (let theWalker of theWalkers) {
    theWalker.move();
    theWalker.display();
  }
}

function mousePressed() {

  let someWalker = new Walker(mouseX, mouseY, color(random(255), random(255), random(255)));
  theWalkers.push(someWalker);
}