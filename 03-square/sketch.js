// Square moving around the corner
let size = 100;
let x = 0;
let y = 0;
let speed = 5;
let state = "right";
async function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

display();
move();



}

//  if (x <= windowWidth - size) {
//     x += speed;
//   } 
//   else if (y <= windowHeight- size) {
//     y += speed;
//   } 
//   else if (x <= windowWidth - size) {
//     x += speed;
//   } 

function move() {
  if (state === 'right') {
    x += speed;
    if (x >= width - size) {
      state = 'down';
    }
  } 
  else if (state === 'down') {
    y += speed;
    if (y >= height - size) {
      state = 'left';
    }
  }
  else if (state === 'left') {
    x -= speed;
    if (x <= 0) {
      state = 'up';
    }
  }
  else if (state === 'up') {
    y-=speed;
    if y <= 0
  }

}


function display() {
  fill("black");
  rect(x, y, size, size);
}

