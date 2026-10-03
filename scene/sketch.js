// Interactive Scene
// Muhammad Abidi
// Sep 27
//
// Notes: I reused bouncing ball physics we used in class and 
// changed it into something that could easily be used into my assignment

// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let level = "easy";
let state = "menu";
 
// Slider 
let sliderWidth = 120;
let sliderHeight = 20;
let x, y, speed;
let draggingMouse = false;

// Ball
let ballX, ballY, dx, dy;
let radius = 20;
let startSpeed = 5;

//Keyboard interaction
let bgColor = 220;
let SliderColor = "black";

// Game info
let lives = 3;
let score = 0;
let highScore = 0;
let previousState = "menu";

// Buttons
let buttonW = 200;
let buttonH = 60;
let buttonX, buttonY, easyY, controlsY;
let homeW = 100;
let homeH = 40;
let homeX, homeY;

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
  controlsY = height / 2 + 120;
  homeX = width - homeW - 20;
  homeY = 20;  

  resetBall();



  //Extra for experts
  let saved = getItem("highScore");
  if (saved !== null) {
    highScore = saved;
  }
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
  else if (state === "info") {
    infoScreen();
  } 
  if (state !== "menu") {
    drawHomeButton();
  }
}

//Screens
function menuScreen() {
  fill("black");
  textSize(48);
  text("Choose Your difficulty", width / 2, height / 2 - 150);

  textSize(24);
  text("Your best is " + highScore, width / 2, height / 2 - 105);

  drawButton("Easy", buttonX, easyY);
  drawButton("Hard", buttonX, buttonY);
  drawButton("Controls", buttonX, controlsY);
}

function gameOverScreen() {
  fill(SliderColor);
  textSize(48);
  text("GameOver", width / 2, height / 2 - 80);
  textSize(24);
  text("Score: " + score, width / 2, height / 2 - 30);
  text("Best: " + highScore, width / 2, height / 2 + 5);

  drawButton("Restart", buttonX, buttonY);
}

function infoScreen() {
  fill(SliderColor);
  textSize(48);
  text("Controls", width / 2, height / 2 - 200);

  textSize(24);
  text("Move the slider: Left / Right arrows or A / D", width / 2, height / 2 - 120);
  text("Or click the slider and drag it with the mouse", width / 2, height / 2 - 80);
  text("Change background: B = blue, Y = yellow, R = red", width / 2, height / 2 - 20);
  text("G = green, P = pink, W = white", width / 2, height / 2 + 20);
  text("Press ESC again to go back", width / 2, height / 2 + 100);
}

function displayScore() {
  fill(SliderColor);
  textSize(100);
  text(score, width / 2, height / 2);
}

function displayLives() {
  fill(SliderColor);
  textSize(24);
  
  text("Lives " + lives, 70, 30);
}

function drawButton(label, bx, by) {
  fill(SliderColor);
  rect(bx, by, buttonW, buttonH);
  fill(bgColor);
  textSize(24);
  text(label, bx + buttonW / 2, by + buttonH / 2);
}

//moving the ball and slider
function movingSlider() {
  fill(SliderColor);
  rect(x, y, sliderWidth, sliderHeight);
}

function playSlider() {
  if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && x < width - sliderWidth) {
    x += speed;
  }
  if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && x > 0) {
    x -= speed;
  }
}


//ball
function displayBall() {
  ballX += dx;
  ballY += dy;

  fill(SliderColor);
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
  // Left wall
  if (ballX <= radius) {
    ballX = radius;
    dx = abs(dx);
  }

  // Right wall
  if (ballX >= width - radius) {
    ballX = width - radius;
    dx = -abs(dx);
  }

  // Top wall
  if (ballY <= radius) {
    ballY = radius;
    dy = abs(dy);
  }

  // Slider -only when the ball is moving down
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
      if (score > highScore) {
        highScore = score;
        storeItem("highScore", highScore);
      }
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
    startSpeed = 8;   // ball drops faster for the harder level
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
  // Home button (every screen except the menu)
  if (state !== "menu" && isMouseOver(homeX, homeY, homeW, homeH)) {
    state = "menu";
    draggingMouse = false;
    return;
  }

  if (state === "menu") {
    if (isMouseOver(buttonX, easyY, buttonW, buttonH)) {
      startGame("easy");
    }
    else if (isMouseOver(buttonX, buttonY, buttonW, buttonH)) {
      startGame("hard");
    }
    else if (isMouseOver(buttonX, controlsY, buttonW, buttonH)) {
      previousState = "menu";
      state = "info";
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
  }
  if (key === "y") {
    bgColor = "yellow";
  }
  if (key === "r") {
    bgColor = "red";
  }
  if (key === "g") {
    bgColor = "green";
  }
  if (key === "p") {
    bgColor = "pink";
  }
  if (key === "w") {
    bgColor = "white";
  }

  if (keyCode === ESCAPE||keycode=== 27) {
    if (state === "info") {
      state = previousState;     // go back
    }
    else {
      previousState = state;     // remember where we were
      state = "info";
      draggingMouse = false;
    }
  }
}

function drawHomeButton() {
  fill(SliderColor);
  rect(homeX, homeY, homeW, homeH);
  fill(bgColor);
  textSize(18);
  text("Home", homeX + homeW / 2, homeY + homeH / 2);
}