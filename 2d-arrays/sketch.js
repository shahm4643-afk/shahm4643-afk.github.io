// 2D Arrays
// Muhammad Abidi
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// - i wil make 2-3 race circuits using 2d arrays
// - make race circuits using the 2d arrays and then download that JSON file.
// - load the JSON file for the circuit they selected 
// - make a general race car out of blocks
// (EXTRA FOR EXPERTS) if they touch the outline-they 
// crash and particles all over the circuit,


// Constants
const OPEN_TILE = 0;
const IMPASSABLE = 1;
const FINISH_LINE = 2;
const PLAYER = 9;
const CELL_SIZE = 10;
const DARK_FINISH = 3;

// Variables
let rows, cols, grid, demoCircuit, yasMarina;
let gameState = "home";
let finishPaintMode = false;
let the_player = { x: 0, y: 0 };

let currentCircuit;
let currentFinishLine;

// Menu buttons
let buttonW = 250;
let buttonH = 60;
let buttonX, buttonY;

// Home button
let homeW = 100;
let homeH = 40;
let homeX, homeY;

// Restart button
let restartW = 120;
let restartH = 40;
let restartX, restartY;

// Finish lines
let yasFinishLine = { 
  x: 125,
  y: 50, 
  };

// Car
let redbullImage;
let carX, carY;
let carAngle = 0;
let carSpeed = 0;

let acceleration = 0.15;
let maxSpeed = 10;
let friction = 0.98;
let turnSpeed = 0.05;

// Zoom and positioning
let circuitScale = 1;
let circuitOffsetX = 0;
let circuitOffsetY = 0;


// Setup
async function setup() {
  createCanvas(windowWidth, windowHeight);

  rows = Math.floor(height / CELL_SIZE);
  cols = Math.floor(width / CELL_SIZE);

  grid = generateEmptyGrid(cols, rows);

  demoCircuit = await loadJSON("raceTrackDemo.json");
  yasMarina = await loadJSON("yas_marina.json");

  redbullImage = await loadImage("redbull.png");

  textAlign(CENTER, CENTER);

  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2;

  homeX = width - homeW - 20;
  homeY = 20;

  restartX = 20;
  restartY = 20;
}


// Main draw function
function draw() {
  background("lightblue");

  if (gameState === "home") {
    menuScreen();
  }

  else if (gameState === "editing") {
    displayGrid();
    drawHomeButton();
  }

  else if (gameState === "playing") {
    handleMovement();
    displayGrid();
    drawHomeButton();
    drawRestartButton();
  }

  else if (gameState === "finished") {
    displayGrid();

    fill("red");
    textSize(50);
    text("CRASHED", width / 2, 100);

    drawHomeButton();
    drawRestartButton();
  }

  else if (gameState === "won") {
    displayGrid();

    fill("green");
    textSize(50);
    text("FINISHED!", width / 2, 100);

    drawHomeButton();
    drawRestartButton();
  }
}


// Menu
function menuScreen() {
  fill("black");
  textSize(48);
  text("Select Your Circuit", width / 2, height / 2 - 100);

  drawButton("Yas Marina", buttonX, buttonY);
  drawButton("Circuit Template", buttonX, buttonY + 100);
  drawButton("Demo Circuit", buttonX, buttonY + 200);
}


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


function isMouseOver(bx, by, w, h) {
  return mouseX >= bx &&
    mouseX <= bx + w &&
    mouseY >= by &&
    mouseY <= by + h;
}


// Start circuit
function startCircuit(circuit, finishLine) {
  currentCircuit = circuit;
  currentFinishLine = finishLine;

  grid = structuredClone(circuit);

  rows = grid.length;
  cols = grid[0].length;

  // Find the starting position
  let playerFound = false;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === PLAYER) {
        the_player.x = x;
        the_player.y = y;
        playerFound = true;
      }
    }
  }

  // Use the finish line as the starting position
  if (finishLine) {
    the_player.x = finishLine.x;
    the_player.y = finishLine.y;
  }

  // Remove PLAYER from the grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === PLAYER) {
        grid[y][x] = OPEN_TILE;
      }
    }
  }

  // Put the car at the starting position
  carX = the_player.x * CELL_SIZE;
  carY = the_player.y * CELL_SIZE;

  carAngle = 0;
  carSpeed = 0;

  circuitScale = 1.3;

  centerCircuit();
  gameState = "playing";
}


// Restart race
function restartCircuit() {
  if (currentCircuit) {
    startCircuit(currentCircuit, currentFinishLine);
  }
}


// Circuit template
function startTemplate() {
  grid = generateEmptyGrid(cols, rows);

  the_player.x = 0;
  the_player.y = 0;

  grid[0][0] = PLAYER;

  circuitScale = 1;

  centerCircuit();
  gameState = "editing";
}


// Generate empty grid
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


  // Draw car
  if (gameState === "playing" ||
      gameState === "finished" ||
      gameState === "won") {

    push();

    // Apply the same positioning and zoom as the circuit
    translate(circuitOffsetX, circuitOffsetY);
    scale(circuitScale);

    translate(carX + CELL_SIZE / 2, carY + CELL_SIZE / 2);
    rotate(carAngle);

    // Draw the car
    if (redbullImage) {
      imageMode(CENTER);
      image(redbullImage, 0, 0, CELL_SIZE * 4, CELL_SIZE * 4);
    }

    rectMode(CORNER);
    imageMode(CORNER);

    pop();
  }
}
// Paint circuit
function paintCell() {
  let x = Math.floor(
    (mouseX - circuitOffsetX) / circuitScale / CELL_SIZE
  );

  let y = Math.floor(
    (mouseY - circuitOffsetY) / circuitScale / CELL_SIZE
  );

  if (x >= 0 && x < cols && y >= 0 && y < rows) {

    if (grid[y][x] === PLAYER) {
      return;
    }

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


// Car movement
function handleMovement() {
  if (keyIsDown(UP_ARROW)) {
    carSpeed += acceleration;
  }

  else if (keyIsDown(DOWN_ARROW)) {
    carSpeed -= acceleration;
  }

  carSpeed *= friction;

  if (carSpeed > maxSpeed) {
    carSpeed = maxSpeed;
  }

  if (carSpeed < -maxSpeed / 2) {
    carSpeed = -maxSpeed / 2;
  }

  if (keyIsDown(LEFT_ARROW)) {
    carAngle -= turnSpeed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    carAngle += turnSpeed;
  }

  carX += cos(carAngle) * carSpeed;
  carY += sin(carAngle) * carSpeed;

  checkCollision();
}


// Mouse controls
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
      startCircuit(yasMarina, yasFinishLine);
    }

    else if (isMouseOver(buttonX, buttonY + 100, buttonW, buttonH)) {
      editCircuit(yasMarina);
    }

    else if (isMouseOver(buttonX, buttonY + 200, buttonW, buttonH)) {
      startCircuit(demoCircuit);
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


// Keyboard controls
function keyPressed() {

  // Finish line painting
  if (key === "f" || key === "F") {
    finishPaintMode = true;
  }

  // Home
  if (key === "e" || key === "E") {
    gameState = "home";
  }

  // Stop arrow keys from scrolling
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
}


function keyReleased() {
  if (key === "f" || key === "F") {
    finishPaintMode = false;
  }
}


// Edit circuit
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

// Collision detection
function checkCollision() {
  let gridX = Math.floor((carX + CELL_SIZE / 2) / CELL_SIZE);
  let gridY = Math.floor((carY + CELL_SIZE / 2) / CELL_SIZE);

  // Outside grid
  if (
    gridX < 0 || gridX >= cols ||
    gridY < 0 || gridY >= rows
  ) {
    gameState = "finished";
  }

  // Hit wall
  else if (grid[gridY][gridX] === IMPASSABLE) {
    gameState = "finished";
  }

  // Crossed finish line
  else if (grid[gridY][gridX] === FINISH_LINE
        || grid[gridY][gridX] === DARK_FINISH
  ) {
    gameState = "won";
  }
}

// Zoom
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

// Center circuit
function centerCircuit() {
  let minX = cols;
  let maxX = 0;
  let minY = rows;
  let maxY = 0;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === IMPASSABLE) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  let centerX = ((minX + maxX + 1) / 2) * CELL_SIZE;
  let centerY = ((minY + maxY + 1) / 2) * CELL_SIZE;

  circuitOffsetX = width / 2 - centerX * circuitScale;
  circuitOffsetY = height / 2 - centerY * circuitScale;
}

// Resize window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2;

  homeX = width - homeW - 20;
  homeY = 20;

  centerCircuit();
}