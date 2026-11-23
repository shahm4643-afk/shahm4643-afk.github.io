// 2D Arrays
// Muhammad Abidi
// November 23

// Refernces :
// https://www.youtube.com/watch?v=Rs_rAxEsAvI 
// https://kidscancode.org/godot_recipes/3.x/2d/car_steering/
// Both of these for car physics

// https://gist.github.com/AmosAidoo/8c2ff4b75184b4f5aff684af7e612a49 
// For circuit scaling

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// I tried to make my functions as sufficient as possible, as I plan to use this exact assignment as a blueprint for my major project.
// I used cos() and sin() so each car drives in the direction it is facing.
// I used constrain() to limit car speeds and push(), translate(), rotate(), and pop() to rotate the car images without affecting the rest of the drawing.
// I also added separate timers and a winner system that compares both cars' times using the "?" variable, which picks between two values based on a condition.

const OPEN_TILE = 0;
const IMPASSABLE = 1;
const FINISH_LINE = 2;
const CELL_SIZE = 10;
const DARK_FINISH = 3;

let rows, cols, grid, yasMarina;
let gameState = "home";
let finishPaintMode = false;

let currentCircuit;
let winner = "";

let buttonW = 250;
let buttonH = 60;
let buttonX, buttonY;

let homeW = 100;
let homeH = 40;
let homeX, homeY;

let restartW = 120;
let restartH = 40;
let restartX, restartY;

// Finish lines
let rbFinishLine = { 
  x: 124, 
  y: 50,
};

let sfFinishLine = { 
  x: 124, 
  y: 53, 
};

// Cars' images and Physics
let redbullImage;
let rbCarSpeed = 0;
let rbAcceleration = 0.18;
let rbMaxSpeed = 9.5;
let rbFriction = 0.98;
let rbTurnSpeed = 0.067;
let rbCarAngle = 0;
let rbCarX;
let rbCarY;

let ferrariImage;
let sfCarSpeed = 0;
let sfAcceleration = 0.18;
let sfFriction = 0.98;
let sfMaxSpeed = 9.5;
let sfTurnSpeed = 0.065;
let sfCarAngle = 0;
let sfCarX;
let sfCarY;

let rbState = "racing"; 
let sfState = "racing";

// Circuit measurement
let circuitScale = 1;
let circuitOffsetX = 0;
let circuitOffsetY = 0;

// Cars' Lap time
let rbStartTime = 0;
let sfStartTime = 0;
let rbStarted = false;
let sfStarted = false;
let rbTime = 0;
let sfTime = 0;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  rows = Math.floor(height / CELL_SIZE);
  cols = Math.floor(width / CELL_SIZE);
  grid = generateEmptyGrid(cols, rows);

  yasMarina = await loadJSON("yas_marina.json");

  redbullImage = await loadImage("redbull.png");
  ferrariImage = await loadImage("ferrari.png");

  textAlign(CENTER, CENTER);

  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2;

  homeX = width - homeW - 20;
  homeY = 20;

  restartX = 20;
  restartY = 20;
}

function draw() {
  background("lightblue");

  if (gameState === "editing") {
    displayGrid();
    drawHomeButton();
  }

  else if (gameState === "home") {
    menuScreen();
  }

  else if (gameState === "playing") {
    handleMovement();
    displayGrid();
    checkCrash();
    drawTimes();
    drawHomeButton();
    drawRestartButton();
  }

  else if (gameState === "finished") {
    displayGrid();

    fill("red");
    textSize(50);
    text("BOTH CRASHED", width / 2, 100);

    drawTimes();
    drawHomeButton();
    drawRestartButton();
  }

  else if (gameState === "won") {
    displayGrid();

    fill("green");
    textSize(50);
    text(winner + " wins!", width / 2, 100);

    drawTimes();
    drawHomeButton();
    drawRestartButton();
  }
}

// Main circuit logic
function startCircuit(circuit, rbLine, sfLine) {
  currentCircuit = circuit;

  grid = structuredClone(circuit);

  rows = grid.length;
  cols = grid[0].length;

  // Red Bull starting position
  rbCarX = rbLine.x * CELL_SIZE;
  rbCarY = rbLine.y * CELL_SIZE;
  rbCarAngle = 0;
  rbCarSpeed = 0;

  // Ferrari starting position
  sfCarX = sfLine.x * CELL_SIZE;
  sfCarY = sfLine.y * CELL_SIZE;
  sfCarAngle = 0;
  sfCarSpeed = 0;

  winner = "";
  rbState = "racing";
  sfState = "racing";

  rbStarted = false;
  sfStarted = false;
  rbTime = 0;
  sfTime = 0;

  circuitScale = 1.3;

  centerCircuit();
  gameState = "playing";
}

function displayGrid() {

  // Draw circuit
  push();

  translate(circuitOffsetX, circuitOffsetY);
  scale(circuitScale);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      if (grid[y][x] === IMPASSABLE) {
        fill("black");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }

      else if (grid[y][x] === FINISH_LINE) {
        fill("white");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }

      else if (grid[y][x] === DARK_FINISH) {
        fill(51,51,51);
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }   
    }
  }

  pop();


  // Draw both cars separately so each uses its own image and angle.
  if (gameState === "playing" || gameState === "finished" || gameState === "won") {
    push();
    translate(circuitOffsetX, circuitOffsetY);
    scale(circuitScale);

    push();
    translate(rbCarX + CELL_SIZE / 2, rbCarY + CELL_SIZE / 2);
    rotate(rbCarAngle);
    if (redbullImage) {
      imageMode(CENTER);
      image(redbullImage, 0, 0, CELL_SIZE * 4, CELL_SIZE * 4);
    }
    pop();

    push();
    translate(sfCarX + CELL_SIZE / 2, sfCarY + CELL_SIZE / 2);
    rotate(sfCarAngle);
    if (ferrariImage) {
      imageMode(CENTER);
      image(ferrariImage, 0, 0, CELL_SIZE * 4.3, CELL_SIZE * 2.3);
    }
    pop();

    pop();
    imageMode(CORNER);
    rectMode(CORNER);
  }
}

function checkCrash() {
  fill("red");
  textSize(30);
  if (rbState === "crashed") {
    text("Red Bull crashed", width / 2, 40);
  }
  if (sfState === "crashed") {
    text("Ferrari crashed", width / 2, 80);
  }
}

function handleMovement() {

  // RED BULL
  if (rbState === "racing") {
    if (keyIsDown(UP_ARROW) && !rbStarted) {
      rbStarted = true;
      rbStartTime = millis();
    }
    if (keyIsDown(UP_ARROW)) {
      rbCarSpeed += rbAcceleration;
    }
    if (keyIsDown(DOWN_ARROW)) {
      rbCarSpeed -= rbAcceleration;
    }
    if (keyIsDown(LEFT_ARROW)) {
      rbCarAngle -= rbTurnSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      rbCarAngle += rbTurnSpeed;
    }

    rbCarSpeed *= rbFriction;
    rbCarSpeed = constrain(rbCarSpeed, -rbMaxSpeed / 2, rbMaxSpeed);

    rbCarX += cos(rbCarAngle) * rbCarSpeed;
    rbCarY += sin(rbCarAngle) * rbCarSpeed;

    rbState = checkCollision(rbCarX, rbCarY);
    if (rbState === "won") {
      rbTime = millis() - rbStartTime;
    }
  }

  // FERRARI
  if (sfState === "racing") {
    if (keyIsDown("KeyW")) {
      sfCarSpeed += sfAcceleration;
    }
    if (keyIsDown("KeyS")) {
      sfCarSpeed -= sfAcceleration;
    }
    if (keyIsDown("KeyA")) {
      sfCarAngle -= sfTurnSpeed;
    }
    if (keyIsDown("KeyD")) {
      sfCarAngle += sfTurnSpeed;
    }

    sfCarSpeed *= sfFriction;
    sfCarSpeed = constrain(sfCarSpeed, -sfMaxSpeed / 2, sfMaxSpeed);

    sfCarX += cos(sfCarAngle) * sfCarSpeed;
    sfCarY += sin(sfCarAngle) * sfCarSpeed;

    sfState = checkCollision(sfCarX, sfCarY);
    if (sfState === "won") {
      sfTime = millis() - sfStartTime;
    }
  }

  // Game is over once neither car is still racing
  if (rbState !== "racing" && sfState !== "racing") {
    if (rbState === "won" && sfState === "won") {
      winner = rbTime < sfTime ? "Red Bull" : "Ferrari";
      gameState = "won";
    }
    else if (rbState === "won") {
      winner = "Red Bull";
      gameState = "won";
    }
    else if (sfState === "won") {
      winner = "Ferrari";
      gameState = "won";
    }
    else {
      gameState = "finished";
    }
  }
}

function checkCollision(carX, carY) {
  let gridX = Math.floor((carX + CELL_SIZE / 2) / CELL_SIZE);
  let gridY = Math.floor((carY + CELL_SIZE / 2) / CELL_SIZE);

  if (gridX < 0 || gridX >= cols || gridY < 0 || gridY >= rows) {
    return "crashed";
  }

  if (grid[gridY][gridX] === IMPASSABLE) {
    return "crashed";
  }

  if (grid[gridY][gridX] === FINISH_LINE || grid[gridY][gridX] === DARK_FINISH) {
    return "won";
  }

  return "racing";
}


// Generating the grid and templates
function generateEmptyGrid(gridCols, gridRows) {
  let newGrid = [];

  for (let y = 0; y < gridRows; y++) {
    newGrid.push([]);

    for (let x = 0; x < gridCols; x++) {
      newGrid[y].push(OPEN_TILE);
    }
  }

  return newGrid;
}

function restartCircuit() {
  if (currentCircuit) {
    startCircuit(currentCircuit, rbFinishLine, sfFinishLine);
  }
}

function startTemplate() {
  grid = generateEmptyGrid(cols, rows);
  circuitScale = 1;
  centerCircuit();
  gameState = "editing";
}

function menuScreen() {
  fill("black");
  textSize(48);
  text("Select Your Circuit", width / 2, height / 2 - 100);

  drawButton("Yas Marina", buttonX, buttonY);
  drawButton("Circuit Template", buttonX, buttonY + 100);
}


// Drawing circuit
function drawButton(label, bx, by) {
  fill("black");
  rect(bx, by, buttonW, buttonH);

  fill("white");
  textSize(24);
  text(label, bx + buttonW / 2, by + buttonH / 2);
}

function drawHomeButton() {
  fill("black");
  rect(homeX, homeY, homeW, homeH);
  fill("white");
  textSize(20);
  text("Home", homeX + homeW / 2, homeY + homeH / 2);
}

function drawRestartButton() {
  fill("black");
  rect(restartX, restartY, restartW, restartH);

  fill("white");
  textSize(20);
  text("Restart", restartX + restartW / 2, restartY + restartH / 2);
}

function editCircuit(circuit) {
  grid = structuredClone(circuit);

  rows = grid.length;
  cols = grid[0].length;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === PLAYER) {
        the_player.x = x;
        the_player.y = y;
      }
    }
  }

  circuitScale = 1;

  centerCircuit();
  gameState = "editing";
}

function paintCell() {
  let x = Math.floor((mouseX - circuitOffsetX) / circuitScale / CELL_SIZE);

  let y = Math.floor((mouseY - circuitOffsetY) / circuitScale / CELL_SIZE
  );

  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    // Erase
    if (keyIsDown(SHIFT)) {
      grid[y][x] = OPEN_TILE;
    }

    // White finish line
    else if (finishPaintMode) {
      grid[y][x] = FINISH_LINE;
    }

    // Dark finish line
    else if (key === "d" || key === "D") {
      grid[y][x] = DARK_FINISH;
    }

    // Wall
    else {
      grid[y][x] = IMPASSABLE;
    }
  }
}

function drawTimes() {
  fill("black");
  textSize(30);
  text(timeText("Red Bull", rbState, rbStarted, rbStartTime, rbTime), width / 2, height - 70);
  text(timeText("Ferrari", sfState, sfStarted, sfStartTime, sfTime), width / 2, height - 35);
}

function timeText(name, state, started, startTime, finalTime) {
  if (state === "crashed") {
    return name + ": crashed";
  }
  if (state === "won") {
    return name + ": " + (finalTime / 1000).toFixed(3) + " s";
  }
  if (!started) {
    return name + ": 0.00 s";
  }
  // still racing, so show the running time
  return name + ": " + ((millis() - startTime) / 1000).toFixed(3) + " s";
}


// Mouse and keyboard inputs
function mousePressed() {
  
  // Home button
  if (gameState !== "home" &&
    isMouseOver(homeX, homeY, homeW, homeH)) {
      
      gameState = "home";
      return;
    }
    
    // Restart button
  if ((gameState === "playing" || gameState === "finished" || gameState === "won") && isMouseOver(restartX, restartY, restartW, restartH)) {
      restartCircuit();
      return;
    }
    
    // Menu
    if (gameState === "home") { 
      if (isMouseOver(buttonX, buttonY, buttonW, buttonH)) {
        startCircuit(yasMarina, rbFinishLine, sfFinishLine);
      }
      
      else if (isMouseOver(buttonX, buttonY + 100, buttonW, buttonH)) {
        startTemplate(); // editCircuit(startCircuit);
      }
    }
    
    // Editing
    else if (gameState === "editing") {
      paintCell();
    }
}
  
function mouseDragged() {
  if (gameState === "editing") {
    paintCell();
  }
}
  
function keyPressed() {
  // Finish line painting
  if (key === "f" || key === "F") {
    finishPaintMode = true;
  }
  
  // Home
  if (key === "e" || key === "E") {
    gameState = "home";
  }

  if (
    key === "ArrowRight" ||
    key === "ArrowLeft" ||
    key === "ArrowUp" ||
    key === "ArrowDown"
  ) {
    return false;
  }

  // Zoom in
  if (key === "+" || key === "=") {
    enlargeCircuit(0.1);
  }

  // Zoom out
  if (key === "-") {
    enlargeCircuit(-0.1);
  }

  // Start Ferrari timer
  if ((key === "w" || key === "W") && !sfStarted && gameState === "playing") {
    sfStarted = true;
    sfStartTime = millis();
  }
}

function keyReleased() {
  if (key === "f" || key === "F") {
    finishPaintMode = false;
  }
}


// Circuit adjustment
function enlargeCircuit(amount) {
  circuitScale += amount;

  if (circuitScale < 0.5) {
    circuitScale = 0.5;
  }

  if (circuitScale > 3) {
    circuitScale = 3;
  }

  centerCircuit();
}

function centerCircuit() {
  let minX = cols;
  let maxX = 0;
  let minY = rows;
  let maxY = 0;
  let foundWall = false;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === IMPASSABLE) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        foundWall = true;
      }
    }
  }

  if (!foundWall) {
    circuitOffsetX = 0;
    circuitOffsetY = 0;
    return;
  }

  let centerX = ((minX + maxX + 1) / 2) * CELL_SIZE;
  let centerY = ((minY + maxY + 1) / 2) * CELL_SIZE;

  circuitOffsetX = width / 2 - centerX * circuitScale;
  circuitOffsetY = height / 2 - centerY * circuitScale;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2;

  homeX = width - homeW - 20;
  homeY = 20;

  centerCircuit();
}

function isMouseOver(bx, by, w, h) {
  return mouseX >= bx && mouseX <= bx + w && mouseY >= by && mouseY <= by + h;
}