// Object notation and Arrays demo


// let x = ;
// let y = ;
// let dx = ;
// let dy = ;

let TheCircles = [];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // TheCircle = {
  //   x: random(width),
  //   y: random(height),
  //   dx: random( 5, -5),
  //   dy: random( 5, -5),
  //   radius: random(10, 50),
  //   r: random(255),
  //   g: random(255),
  //   b: random(255),
  // };
}

function draw() {
  background(220);

  for (let TheCircle of TheCircles) {
  // moving circle
    TheCircle.x += TheCircle.dx;
    TheCircle.y += TheCircle.dy;

    if (TheCircle.x < 0 + TheCircle.radius || TheCircle.x >= width - TheCircle.radius) {
      TheCircle.dx *= -1;
    }
    if (TheCircle.y < 0 + TheCircle.radius || TheCircle.y >= height - TheCircle.radius) {
      TheCircle.dy *= -1;
    }

    fill(TheCircle.r, TheCircle.g, TheCircle.b);
    circle(TheCircle.x, TheCircle.y, 2*TheCircle.radius);
  }
}
function mousePressed() {
  spawnCircle();

}


function spawnCircle() {
  let someCircle = {
    x: mouseX,
    y: mouseY,
    dx: random( 5, -5),
    dy: random( 5, -5),
    radius: random(10, 50),
    r: random(255),
    g: random(255),
    b: random(255),
  };
  TheCircles.push(someCircle);

}