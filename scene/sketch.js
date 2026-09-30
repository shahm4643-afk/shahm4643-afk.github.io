// Interactive Scene
// Muhammad Abidi
// Sep 27
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


state = "wallInFront";
 
// Slider 
let sliderWidth = 100;
let sliderHeight = 20;
let x, y, speed;

// Ball
let ballX, ballY, dx, dy;
let radius = 20;

async function setup() {
  createCanvas(windowWidth, windowHeight);


  // Slider
  x = windowWidth/2 - (sliderWidth/2);
  y = windowHeight/1.1 - (sliderHeight/2);
  speed = 10;

  // Ball
  ballX = width/2;
  ballY = height/2;
  dx = 10;
  dy = 10;

}



function draw() {
  background(220);
  movingSlider();
  playSlider(); 
  displayBall();
  bounceIfNeeded();
}

function movingSlider() {
  fill("black");
  rect(x, y, sliderWidth, sliderHeight);
}

function playSlider() {
  if (keyIsDown(RIGHT_ARROW) && x < width - sliderWidth) {
    x += speed;
  }
  if (keyIsDown(LEFT_ARROW) && x > 0) {
    x -= speed;
  }
}

function bounceIfNeeded() {
  if (ballX <= 0 + radius || ballX >= width - radius) {
    dx *= -1;
  }

  if (ballY < radius) {
    dy *= -1;
  }

  if (ballY + radius >= y && ballX >= x && ballX <= x + sliderWidth) {
    dy *= -1;
    ballY = y - radius;
    
  }
}

 function displayBall() {
  ballX += dx;
  ballY += dy;

  fill("black")
  circle(ballX, ballY, radius*2);
 }