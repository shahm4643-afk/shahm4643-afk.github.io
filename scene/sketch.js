// Interactive Scene
// Muhammad Abidi
// Sep 27
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let level = "easy";
let state = "menu";
 
// Slider 
let sliderWidth = 100;
let sliderHeight = 20;
let x, y, speed;
let draggingMouse = false;

// Ball
let ballX, ballY, dx, dy;
let radius = 20;
let startSpeed = 5;

//Keyboard interaction
let bgColor = 220;
let objColor = "black";

// Game info
let lives = 3;
let score = 0;

// Buttons
let buttonW = 200;
let buttonH = 60;
let buttonX, buttonY, easyY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);


  // Slider
  x = windowWidth/2 - (sliderWidth/2);
  y = windowHeight/1.1 - (sliderHeight/2);
  speed = 10;

  // Button positions
  buttonX = width/ 2 - buttonW/2;
  easyY = height/2 - 80;
  buttonY = height /2 + 40;

  resetBall();

}



function draw() {

  background(bgColor);

  if (state === "menu") {
    menuScreen();
  }

  else if (state === "playing") {
    
    displayScore();
    displayLives();
    movingSlider();
    playSlider(); 
    displayBall();
    bounceIfNeeded();
  }
  else if (state === "gameOver") {
    gameOverScreen();
  }
}
//Screens
function menuScreen() {
  fill(objColor);
  textSize(48);
  text("Choose a level", width / 2, height / 2 - 140);

  drawButton("Easy", buttonX, easyY);
  drawButton("Hard", buttonX, buttonY);
}

function gameOverScreen() {
  fill(objColor);
  textSize(48);
  text("GameOver", width / 2, height / 2 - 60);
  textSize(24);
  text("Score: " + score, width / 2, height / 2 - 10);

  drawButton("Restart", buttonX, buttonY);
}

function displayScore() {
  fill(objColor);
  textSize(100);
  text(score, width / 2, height / 2);
}

function displayLives() {
  fill(objColor);
  textSize(24);
  text("Lives: " + lives, 70, 30);
}

function drawButton(label, bx, by) {
  fill(objColor);
  rect(bx, by, buttonW, buttonH);
  fill(bgColor);
  textSize(24);
  text(label, bx + buttonW / 2, by + buttonH / 2);
}

//moving the ball and slider
function movingSlider() {
  fill(objColor);
  rect(x, y, sliderWidth, sliderHeight);
}

function playSlider() {
  if ((keyIsDown(RIGHT_ARROW) || keyIsDown("d")) && x < width - sliderWidth) {
    x += speed;
  }
  if ((keyIsDown(LEFT_ARROW) || keyIsDown("a")) && x > 0) {
    x -= speed;
  }
}



function displayBall() {
  ballX += dx;
  ballY += dy;

  fill(objColor);
  circle(ballX, ballY, radius * 2);
}

function resetBall() {
  ballX = width / 2;
  ballY = height / 4;
  dx = 0;
  dy = startSpeed;
  speed = 10;   // slider speed goes back to normal too
}

function bounceIfNeeded() {
  // Left and right walls
  if (ballX <= radius || ballX >= width - radius) {
    dx = -dx;
  }

  // Top wall
  if (ballY <= radius) {
    dy = -dy;
  }

  // Slider (only when the ball is moving down)
  if (dy > 0 && ballY + radius >= y && ballX >= x && ballX <= x + sliderWidth) {
    ballY = y - radius;
    dy = -dy - 2;
    speed += 0.3;
    score += 1;

    if (dx === 0) {
      dx = random([-2, 2]);   // first hit right or left to randomise
    }
    else if (dx > 0) {
      dx += 2;
    }
    else {
      dx -= 2;
    }
  }

  // Ball fell off the bottom
  if (ballY > height) {
    lives -= 1;
    if (lives === 0) {
      state = "gameOver";
    }
    else {
      resetBall();
    }
  }
}



function startGame(chosenLevel) {
  level = chosenLevel;

  if (level === "easy") {
    startSpeed = 5;
  }
  else {
    startSpeed = 8;   // ball drops faster for harder level
  }

  lives = 3;
  score = 0;
  x = width / 2 - sliderWidth / 2;
  resetBall();
  state = "playing";
}

// interticing the mosue with the slider

function isMouseOver(bx, by, w, h) {
  return mouseX >= bx && mouseX <= bx + w && mouseY >= by && mouseY <= by + h;
}

function mousePressed() {
  if (state === "menu") {
    if (isMouseOver(buttonX, easyY, buttonW, buttonH)) {
      startGame("easy");
    }
    if (isMouseOver(buttonX, buttonY, buttonW, buttonH)) {
      startGame("hard");
    }
  }
  else if (state === "playing") {
    if (isMouseOver(x, y, sliderWidth, sliderHeight)) {
      draggingMouse = true;
    }
  }
  else if (state === "gameOver") {
    if (isMouseOver(buttonX, buttonY, buttonW, buttonH)) {
      startGame(level);
    }
  }
}

function mouseDragged() {
  if (draggingMouse) {
    x = mouseX - sliderWidth / 2;
    x = constrain(x, 0, width - sliderWidth);
  }
}

function mouseReleased() {
  draggingMouse = false;
}

//using keyboard

function keyPressed() {
  if (key === "b") {
    bgColor = "blue";
    objColor = "black";
  }
  if (key === "y") {
    bgColor = "yellow";
    objColor = "black";
  }
  if (key === "r") {
    bgColor = "red";
    objColor = "black";
  }
  if (key === "g") {
    bgColor = "green";
    objColor = "black";
  }
  if (key === "p") {
    bgColor = "pink";
    objColor = "black";
  }
  if (key === "w") {
    bgColor = "white";
    objColor = "black";
  }  
}