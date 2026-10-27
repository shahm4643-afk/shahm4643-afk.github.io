// Arrays and Object Notation Project
// Muhammad Abidi
// October, 2026

// References:

// Extra for Experts:
// I used drawingContext to add a shadow around the ball and to improve the visiuals of my game

let level = "easy";
let state = "menu";
let previousState = "menu";

let sliderWidth = 120;
let sliderHeight = 25;
let sliderX, sliderY;
let sliderSpeed = 10;
let draggingMouse = false;

let ballX, ballY;
let ballSpeedX, ballSpeedY;
let previousBallY;
let ballRadius = 20;
let ballStartSpeed = 5;

let backgroundColor = 220;
let sliderColor = "black";

let lives = 3;
let score = 0;
let highScore = 0;

let buttonWidth = 200;
let buttonHeight = 60;
let buttonX, buttonY, easyY, controlsY;

let homeWidth = 100;
let homeHeight = 40;
let homeX, homeY;

let blocks = [];

let tickSound;
let winningSound;

// Setup

async function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  textAlign(CENTER, CENTER);
  
  sliderX = width / 2 - sliderWidth / 2;
  sliderY = height / 1.1 - sliderHeight / 2;
  
  buttonX =   width / 2 - buttonWidth / 2;
  easyY =     height / 2 - 80;
  buttonY =   height / 2;
  controlsY = height / 2 + 120;
  
  homeX = width - homeWidth - 20;
  homeY = 20;

  removeItem("highScore");
  highScore = 0;
  let savedScore = getItem("highScore");
  
  if (savedScore !== null) {
    highScore = savedScore;
  }
  
  resetBall();
 
  tickSound = await loadSound("tick.wav");
  winningSound = await loadSound("won.wav");
}

function draw() {

  background(220);

  if (state === "menu") {
    menuScreen();
  }
  else if (state === "playing") {
    playSlider();
    moveBall();
    bounceIfNeeded();

    if (state === "playing") {
      checkBlockCollisions();
    }

    displayScore();
    displayLives();
    displaySlider();
    displayBall();
    displayBlocks();
  }
  else if (state === "gameOver") {
    gameOverScreen();
  }
  else if (state === "info") {
    infoScreen();
  }
  else if (state === "youWin") {
    winningScreen();
  }
  if (state !== "menu") {
    drawHomeButton();
  }
}

// Screens
function menuScreen() {

  fill("black");
  textSize(48);
  text("Choose Your Difficulty", width / 2, height / 2 - 150);

  textSize(24);
  text("Your best is " + highScore, width / 2, height / 2 - 105);

  drawButton("Easy", buttonX, easyY);
  drawButton("Hard", buttonX, buttonY);
  drawButton("Controls", buttonX, controlsY);
}

function gameOverScreen() {
  fill(sliderColor);
  textSize(48);
  text("Game Over", width / 2, height / 2 - 130);

  textSize(24);
  text("Score: "+ score, width / 2, height / 2 - 60);
  text("HighScore: "+ highScore, width / 2, height / 2 + 90);

  drawButton("Restart", buttonX, buttonY);
}

function infoScreen() {
  fill(sliderColor);
  textSize(48);
  text("Controls", width / 2, height / 2 - 200);

  textSize(24);
  text("Move the slider: Left / Right arrows",   width / 2, height / 2 - 120);
  text("Or click the slider and drag it",        width / 2, height / 2 - 80);

}

function displayScore() {
  fill("grey");
  textSize(100);
  text(score, width / 2, height / 2);
}

function displayLives() {
  fill(sliderColor);
  textSize(24);

  text("Lives " + lives, 70, 30);
}

function drawButton(label, buttonLeft, buttonTop) {
  fill(sliderColor);
  rect(buttonLeft, buttonTop, buttonWidth, buttonHeight);

  fill(backgroundColor);

  textSize(24);
  text(label, buttonLeft + buttonWidth / 2, buttonTop + buttonHeight / 2);
}

function drawHomeButton() {
  noFill();
  rect(homeX, homeY, homeWidth, homeHeight);

  fill("black");
  textSize(18);
  text("Home", homeX + homeWidth / 2, homeY + homeHeight / 2);
}

// Slider

function playSlider() {
  if (keyIsDown("d") || keyIsDown(RIGHT_ARROW)) {
    sliderX += sliderSpeed;
  }

  if (keyIsDown("a") || keyIsDown(LEFT_ARROW)) {
    sliderX -= sliderSpeed;
  }

  sliderX = constrain(sliderX, 0, width - sliderWidth);
}

function displaySlider() {
  stroke("white");
  strokeWeight(2);
  fill("black");

  rect(sliderX, sliderY, sliderWidth, sliderHeight, 9);

  strokeWeight(1);
  stroke("black");
}

// Ball
function moveBall() {
  previousBallY = ballY;

  ballX += ballSpeedX;
  ballY += ballSpeedY;
}

function displayBall() {
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = "black";

  fill("white");
  
  circle(ballX, ballY, ballRadius * 2);

  drawingContext.shadowBlur = 0;
}

function resetBall() {
  ballX = width / 2;
  ballY = height / 2;

  previousBallY = ballY;
  ballSpeedX = 0;
  ballSpeedY = ballStartSpeed;

}

function bounceIfNeeded() {

  if (ballX <= ballRadius) {
    ballX = ballRadius;
    ballSpeedX = abs(ballSpeedX);
  }


  if (ballX >= width - ballRadius) {
    ballX = width - ballRadius;
    ballSpeedX = -abs(ballSpeedX);
  }


  if (ballY <= ballRadius) {
    ballY = ballRadius;
    ballSpeedY = abs(ballSpeedY);
  }


  let wasAboveSlider = previousBallY + ballRadius <= sliderY;
  let reachedSlider = ballY + ballRadius >= sliderY;
  let isOverSlider = ballX + ballRadius >= sliderX && ballX - ballRadius <= sliderX + sliderWidth;

  if (ballSpeedY > 0 && wasAboveSlider && reachedSlider && isOverSlider) {
    ballY = sliderY - ballRadius;

    ballSpeedY += 0.5;
    ballSpeedY = -ballSpeedY;
    sliderSpeed += 0.5;

    if (ballSpeedX === 0) {
      ballSpeedX = random([-3, 3]);
    }
    else if (ballSpeedX > 0) {
      ballSpeedX += 1;
    }
    else {
      ballSpeedX -= 1;
    }
  }

  if (ballY - ballRadius > height) {
    lives--;

    if (lives === 0) {
      state = "gameOver";
      draggingMouse = false;
    }
    else {
      resetBall();
    }
  }
}

// Starting a game
function startGame(chosenLevel) {
  level = chosenLevel;

  if (level === "easy") {
    ballStartSpeed = 5;
  }
  else {
    ballStartSpeed = 8;
  }

  lives = 3;
  score = 0;
  sliderSpeed = 10;
  sliderX = width / 2 - sliderWidth / 2;
  draggingMouse = false;

  generateBlocks();
  resetBall();

  state = "playing";
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    storeItem("highScore", highScore);
  }
}

// Mouse controls
function mousePressed() {
  if (state !== "menu" && isMouseOver(homeX, homeY, homeWidth, homeHeight)) {
    state = "menu";
    draggingMouse = false;
    return;
  }

  if (state === "menu") {
    if (isMouseOver(buttonX, easyY, buttonWidth, buttonHeight)) {
      startGame("easy");
    }
    else if (isMouseOver(buttonX, buttonY, buttonWidth, buttonHeight)) {
      startGame("hard");
    }
    else if (isMouseOver(buttonX, controlsY, buttonWidth, buttonHeight)) {
      previousState = "menu";
      state = "info";
    }
  }
  else if (state === "playing") {
    if (isMouseOver(sliderX, sliderY, sliderWidth, sliderHeight)) {
      draggingMouse = true;
    }
  }
  else if (state === "gameOver" || state === "youWin") {
    if (isMouseOver(buttonX, buttonY, buttonWidth, buttonHeight)) {
      startGame(level);
    }
  }
}

function mouseDragged() {
  if (draggingMouse && state === "playing") {
    sliderX = mouseX - sliderWidth / 2;
    sliderX = constrain(sliderX, 0, width - sliderWidth);
  }
}

function mouseReleased() {
  draggingMouse = false;
}

function isMouseOver(leftSide, topSide, itemWidth, itemHeight) {
  return mouseX >= leftSide && mouseX <= leftSide + itemWidth && mouseY >= topSide && mouseY <= topSide + itemHeight;
}


// Blocks
function spawnBlock(leftSide, topSide, blockWidth, blockHeight) {
  let theBlock = {
    x: leftSide,
    y: topSide,
    w: blockWidth,
    h: blockHeight,
  };

  return theBlock;
}

function generateBlocks() {
  blocks = [];

  let numberOfColumns = 10;
  let numberOfRows = 5;
  let blockWidth = width / numberOfColumns;
  let blockHeight = height / 25;

  let rowColors = ["red", "green", "yellow", "dodgerblue", "lightblue"];

  for (let row = 0; row < numberOfRows; row++) {
    for (let column = 0; column < numberOfColumns; column++) {
      let blockX = column * blockWidth;
      let blockY = height / 10 + row * blockHeight;

      let theBlock = spawnBlock(
        blockX, blockY, blockWidth, blockHeight
      );

      theBlock.color = rowColors[row];
      blocks.push(theBlock);
    }
  }
}

function displayBlocks() {
  
  for (let theBlock of blocks) {
    fill(theBlock.color);
    rect(theBlock.x, theBlock.y, theBlock.w, theBlock.h);
  }
}

function checkBlockCollisions() {
  for (let i = blocks.length - 1; i >= 0; i--) {   // Checking the array backwards to make sure the index dosnt get messed up - Just like the class whiteboard demo
    let theBlock = blocks[i];

    let hitBlock = collideRectCircle(
      theBlock.x, theBlock.y, theBlock.w, theBlock.h,
      ballX, ballY, ballRadius * 2
    );

    if (hitBlock) {
      blocks.splice(i, 1);
      ballSpeedY = -ballSpeedY;
      
      score++;
      updateHighScore();
      
      tickSound.play();

      if (blocks.length === 0) {
        state = "youWin";
        draggingMouse = false;
        winningSound.play();
      }
      break;
    }
  }
}

function winningScreen() {
  fill("black");
  textSize(48);
  text("You Win!", width / 2, height / 2 - 90);

  textSize(24);
  text("Score: " + score, width / 2, height / 2 - 40);

  drawButton("Restart", buttonX, buttonY);
}