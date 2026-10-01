// Interactive Scene
// Muhammad Abidi
// Sep 27
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let state = "playing";
 
// Slider 
let sliderWidth = 100;
let sliderHeight = 20;
let x, y, speed;

// Ball
let ballX, ballY, dx, dy;
let radius = 20;

// Buttons
let buttonW = 200;
let buttonH = 60;
let buttonX, buttonY;

function setup() {
  createCanvas(windowWidth, windowHeight);


  // Slider
  x = windowWidth/2 - (sliderWidth/2);
  y = windowHeight/1.1 - (sliderHeight/2);
  speed = 10;

  // Ball
  ballX = width/2;
  ballY = height/2;
  dx = 0;
  dy = 5;

  // Button positions
  buttonX = width/2 - buttonW/2;
  buttonY = height/2 + 40;

}



function draw() {
  background(220);
  if (state === "playing") {
    movingSlider();
    playSlider(); 
    displayBall();
    bounceIfNeeded();
  }
  else if (state === "gameOver") {
    gameOverScreen();
  }
}

function movingSlider() {
  fill("black");
  rect(x, y, sliderWidth, sliderHeight);
}

function playSlider() {
  if (keyIsDown(UP_ARROW) && x < width - sliderWidth) {
    x += speed;
  }
  if (keyIsDown(DOWN_ARROW) && x > 0) {
    x -= speed;
  }
}

function bounceIfNeeded() {
  if (ballX <= radius || ballX >= width - radius){ //checking left and right walls
    dx = -dx;
  }
  if (ballY <= radius) {   //checking the top 
    dy = -dy;
  }

  if (dy > 0 && ballY + radius >=y && ballX >= x && ballX <= x + sliderWidth) {
    ballY = y - radius;
    dy = -dy -2;
    speed += 0.1;
  
    if (dx > 0) {
      dx += 2;
    }
    else {
      dx -= 2;
    }
  }
  if (ballY > height) {
    state = "gameOver";
  }
}

function displayBall() {
  ballX += dx;
  ballY += dy;

  fill("black");
  circle(ballX, ballY, radius*2);
}

function gameOverScreen() {
  fill("black");
  textAlign(CENTER, CENTER);
  textSize(48);
  text("HAHAHA you lost", width / 2, height / 2 - 40);

  // Restart button
  rect(buttonX, buttonY, buttonW, buttonH);
  fill("white");
  textSize(24);
  text("Restart", width / 2, buttonY + buttonH / 2);
}

function mousePressed() {
  if (state === "gameOver") {
    if (mouseX >= buttonX && mouseX <= buttonX + buttonW &&
        mouseY >= buttonY && mouseY <= buttonY + buttonH) {
      restartGame();
    }
  }
}

function restartGame() {
  ballX = width / 2;
  ballY = height / 4;
  dx = 0;
  dy = 5;
  x = width / 2 - sliderWidth / 2;
  state = "playing";
}

function displayScore() {

}