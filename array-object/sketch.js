// Arrays and Pnject notation project
// Muhammad Abidi
// October , 2026


// Reference:
           

// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let level = "easy";
let state = "menu";
 

let sliderWidth = 120;
let sliderHeight = 20;
let sliderX, sliderY, sliderSpeed;
let draggingMouse = false;

let ballX, ballY, ballSpeedX, ballSpeedY;
let previousBallY;
let ballRadius = 20;
let ballStartSpeed = 5;

let backgroundColor = 220;
let sliderColor = "black";


let lives = 3;
let score = 0;
let highScore = 0;
let previousState = "menu";


let buttonW = 200;
let buttonH = 60;
let buttonX, buttonY, easyY, controlsY;
let homeW = 100;
let homeH = 40;
let homeX, homeY;

let blocks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);


  // Slider
  sliderX = windowWidth/2 - sliderWidth/2;
  sliderY = windowHeight/1.1 - sliderHeight/2;
  sliderSpeed = 10;

  // Button positions
  buttonX = width/ 2 - buttonW/2;
  easyY = height/2 - 80;
  buttonY = height /2 ;
  controlsY = height / 2 + 120;
  homeX = width - homeW - 20;
  homeY = 20;  

  resetBall();
  generateBlocks()

  let saved = getItem("highScore");
  if (saved !== null) {
    highScore = saved;
  }

  generateBlocks();

}



function draw() {

  background(backgroundColor);

  if (state === "menu") {
    menuScreen();
  }
  else if (state === "playing") {
    
    displayScore();
    displayLives();
    playSlider(); 
    movingSlider();
    displayBall();
    bounceIfNeeded();

    fill("red");
    stroke("black");

    for (let theBlock of blocks) {
      rect(theBlock.x, theBlock.y, theBlock.w, theBlock.h);
    }
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
  fill(sliderColor);
  textSize(48);
  text("GameOver", width / 2, height / 2 - 130);
  textSize(24);
  text("Score: " + score, width / 2, height / 2 - 80);
  text("Best: " + highScore, width / 2, height / 2 + 45);

  drawButton("Restart", buttonX, buttonY);
}

function infoScreen() {
  fill(sliderColor);
  textSize(48);
  text("Controls", width / 2, height / 2 - 200);

  textSize(24);
  text("Move the slider: Left / Right arrows", width / 2, height / 2 - 120);
  text("Or click the slider and drag it with the mouse", width / 2, height / 2 - 80);
  text("Press any letter to get a background color starting with it", width / 2, height / 2 + 20);
  text("Press ESC again to go back", width / 2, height / 2 + 100);
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

function drawButton(label, bx, by) {
  fill(sliderColor);
  rect(bx, by, buttonW, buttonH);
  fill(backgroundColor);


  textSize(24);
  text(label, bx + buttonW / 2, by + buttonH / 2);
}

//ball and slider
function movingSlider() {
  fill(sliderColor);
  rect(sliderX, sliderY, sliderWidth, sliderHeight);
}

function playSlider() {
  if (keyIsDown(RIGHT_ARROW)) {
    sliderX += sliderSpeed;
  }

  if (keyIsDown(LEFT_ARROW)) {
    sliderX -= sliderSpeed;
  }

  sliderX = constrain(sliderX, 0, width - sliderWidth);
}


//ball
function displayBall() {
  previousBallY = ballY;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  fill(sliderColor);
  circle(ballX, ballY, ballRadius * 2);
}

function resetBall() {
  ballX = width / 2;
  ballY = height / 4;
  ballSpeedX = 0;
  ballSpeedY = ballStartSpeed;
  sliderSpeed = 10;   // slider speed goes back to normal too
}

function bounceIfNeeded() {
  // Left wall
  if (ballX <= ballRadius) {
    ballX = ballRadius;
    ballSpeedX = abs(ballSpeedX);
  }

  // Right wall
  if (ballX >= width - ballRadius) {
    ballX = width - ballRadius;
    ballSpeedX = -abs(ballSpeedX);
  }

  // Top wall
  if (ballY <= ballRadius) {
    ballY = ballRadius;
    ballSpeedY = abs(ballSpeedY);
  }

  // Check whether the ball crossed the slider's top from above
  let wasAboveSlider = previousBallY + ballRadius <= sliderY;
  let reachedSlider = ballY + ballRadius >= sliderY;
  let isOverSlider = ballX >= sliderX && ballX <= sliderX + sliderWidth;

  if (ballSpeedY > 0 && wasAboveSlider && reachedSlider && isOverSlider) {
    ballY = sliderY - ballRadius;
    ballSpeedY = -ballSpeedY - 2;
    sliderSpeed += 0.3;
    score += 1;

    if (ballSpeedX === 0) {
      ballSpeedX = random([-2, 2]);
    }
    else if (ballSpeedX > 0) {
      ballSpeedX += 2;
    }
    else {
      ballSpeedX -= 2;
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
    ballStartSpeed = 5;
  }
  else {
    ballStartSpeed = 8;
  }

  lives = 3;
  score = 0;
  sliderX = width / 2 - sliderWidth / 2;
  draggingMouse = false;
  resetBall();
  state = "playing";
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
    if (isMouseOver(sliderX, sliderY, sliderWidth, sliderHeight)) {
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
  if (draggingMouse && state === "playing") {
    sliderX = mouseX - sliderWidth / 2;
    sliderX = constrain(sliderX, 0, width - sliderWidth);
  }
}

function isMouseOver(bx, by, w, h) {
  return mouseX >= bx && mouseX <= bx + w && mouseY >= by && mouseY <= by + h;
}

function mouseReleased() {
  draggingMouse = false;
}

//using keyboard

function keyPressed() {
  let k = key.toLowerCase();

  if (k === "a") { backgroundColor = "aqua"; }
  if (k === "b") { backgroundColor = "blue"; }
  if (k === "c") { backgroundColor = "crimson"; }
  if (k === "d") { backgroundColor = "deepskyblue"; }
  if (k === "e") { backgroundColor = "lightgreen"; }      
  if (k === "f") { backgroundColor = "fuchsia"; }
  if (k === "g") { backgroundColor = "green"; }
  if (k === "h") { backgroundColor = "hotpink"; }
  if (k === "i") { backgroundColor = "indigo"; }
  if (k === "j") { backgroundColor = "#00A86B"; }      
  if (k === "k") { backgroundColor = "khaki"; }
  if (k === "l") { backgroundColor = "lavender"; }
  if (k === "m") { backgroundColor = "magenta"; }
  if (k === "n") { backgroundColor = "navy"; }
  if (k === "o") { backgroundColor = "orange"; }
  if (k === "p") { backgroundColor = "pink"; }
  if (k === "q") { backgroundColor = "#F7CAC9"; }      
  if (k === "r") { backgroundColor = "red"; }
  if (k === "s") { backgroundColor = "salmon"; }
  if (k === "t") { backgroundColor = "teal"; }
  if (k === "u") { backgroundColor = "#3F00FF"; }     
  if (k === "v") { backgroundColor = "violet"; }
  if (k === "w") { backgroundColor = "white"; }
  if (k === "x") { backgroundColor = "#738678"; }     
  if (k === "y") { backgroundColor = "yellow"; }
  if (k === "z") { backgroundColor = "#39A78E"; } 

  if (keyCode === 27) {
    if (state === "info") {
      state = previousState;     
    }
    else {
      previousState = state;     
      state = "info";
      draggingMouse = false;
    }
  }
}

function drawHomeButton() {
  noFill();
  rect(homeX, homeY, homeW, homeH);
  fill('black');
  textSize(18);
  text("Home", homeX + homeW / 2, homeY + homeH / 2);
}


function spawnBlock(leftSide, blockWidth, blockHeight) {
  let theBlock = {
    x: leftSide,
    y: 60,
    w: blockWidth,
    h: blockHeight,
  };

  return theBlock;
}

function generateBlocks() {
  blocks = [];

  let numberOfBlocks = 10;
  let numberOfRows = 5;
  let blockWidth = width / numberOfBlocks;
  let blockHeight = 30;

  for (let i = 0; i < numberOfBlocks; i++) {
    let theBlock = spawnBlock(blockWidth * i, blockWidth, blockHeight);
    blocks.push(theBlock);
  }
}