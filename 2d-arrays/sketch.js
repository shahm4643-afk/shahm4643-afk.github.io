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

// Variables
let rows;
let cols;
let grid;
let demoCircuit;

let gameState = "home";

let lastMoveTime = 0;
let moveDelay = 100;

let the_player = {
  x: 0,
  y: 0,
};

// Menu button
let buttonW = 250;
let buttonH = 60;
let buttonX, buttonY;

// Home button
let homeW = 100;
let homeH = 40;
let homeX, homeY;

// Finish lines
let yasFinishLine = {
  x: 95,
  y: 60,
};

// car images
let redbullImage;

// Setup
async function setup() {
  createCanvas(windowWidth, windowHeight);

  rows = Math.floor(height / CELL_SIZE);
  cols = Math.floor(width / CELL_SIZE);

  grid = generateEmptyGrid(cols, rows);
  grid[the_player.y][the_player.x] = PLAYER;

  demoCircuit = await loadJSON("raceTrackDemo.json");
  yasMarina = await loadJSON("yas_marina.json");

  redbullImage = await loadImage("redbull.png");

  textAlign(CENTER, CENTER);

  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2;

  homeX = width - homeW - 20;
  homeY = 20;
}


// Main draw function

function draw() {
  background(220);

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
  }
  else if (gameState === "finished") {
    displayGrid();

    fill("red");
    textSize(60);
    text("Finish", width / 2, height / 2);

    drawHomeButton();
  }
}


// Menu functions

function menuScreen() {
  fill("black");
  textSize(48);
  text("Select Your Circuit", width / 2, height / 2 - 100);

  drawButton("Yas Marina", buttonX , buttonY);
  drawButton("Demo Circuit", buttonX, buttonY + 200);
  drawButton("Circuit Template", buttonX, buttonY + 100);
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

function isMouseOver(bx, by, w, h) {
  return mouseX >= bx &&
    mouseX <= bx + w &&
    mouseY >= by &&
    mouseY <= by + h;
}


// Circuit functions
function startCircuit(circuit, finishLine) {
  grid = structuredClone(circuit);
  shiftCircuit(-37, 10);

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

  // New starting position accorinding to circuit chosen
  if (finishLine) {
    the_player.x = finishLine.x;
    the_player.y = finishLine.y;
  }

  grid[the_player.y][the_player.x] = PLAYER;

  gameState = "playing";
}

function startTemplate() {
  grid = generateEmptyGrid(cols, rows);

  the_player.x = 0;
  the_player.y = 0;

  grid[the_player.y][the_player.x] = PLAYER;

  gameState = "editing";
}


// Grid functions
function generateEmptyGrid(cols, rows) {
  let newGrid = [];

  for (let y = 0; y < rows; y++) {
    newGrid.push([]);

    for (let x = 0; x < cols; x++) {
      newGrid[y].push(OPEN_TILE);
    }
  }

  return newGrid;
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {

      if (grid[y][x] === PLAYER) {
        continue;
      }
      else if (grid[y][x] === OPEN_TILE) {
        fill("white");
      }
      else if (grid[y][x] === IMPASSABLE) {
        fill("black");
      }
      else if (grid[y][x] === FINISH_LINE) {
        fill("yellow");
      }

      square(
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  // Draw the car AFTER the entire grid
  translate(the_player.x*CELL_SIZE - 10, the_player.y*CELL_SIZE - 10);
  image(redbullImage, 0, 0, CELL_SIZE*5, CELL_SIZE*5);
}

function toggleCell(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y < rows) {

    if (grid[y][x] === OPEN_TILE) {
      grid[y][x] = IMPASSABLE;
    }
    else if (grid[y][x] === IMPASSABLE) {
      grid[y][x] = OPEN_TILE;
    }
    else if (grid[y][x] === OPEN_TILE || IMPASSABLE) {
      grid[y][x] = FINISH_LINE;
    }
  }
}

function paintCell() {
  let x = Math.floor(mouseX / CELL_SIZE);
  let y = Math.floor(mouseY / CELL_SIZE);

  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (grid[y][x] !== PLAYER) {

      if (keyIsDown(SHIFT)) {
        grid[y][x] = OPEN_TILE;
      }
      else if (keyIsDown(70)) { 
        grid[y][x] = FINISH_LINE;
      }
      else {
        grid[y][x] = IMPASSABLE;
      }

    }
  }
}



// Player movement functions
function movePlayer(x, y) {
  if (gameState !== "playing") {
    return;
  }

  if (x >= 0 && x < cols && y >= 0 && y < rows) {

    if (grid[y][x] === IMPASSABLE) {
      gameState = "finished";
    }
    else if (grid[y][x] === OPEN_TILE) {

      let oldX = the_player.x;
      let oldY = the_player.y;

      the_player.x = x;
      the_player.y = y;

      grid[y][x] = PLAYER;
      grid[oldY][oldX] = OPEN_TILE;
    }
    else if (grid[y][x] === FINISH_LINE) {
      gameState = "racing";
    }
  }
}

function handleMovement() {
  if (gameState !== "playing") {
    return;
  }

  if (millis() - lastMoveTime >= moveDelay) {

    if (keyIsDown("ArrowRight")) {
      movePlayer(the_player.x + 1, the_player.y);
      lastMoveTime = millis();
    }
    else if (keyIsDown("ArrowLeft")) {
      movePlayer(the_player.x - 1, the_player.y);
      lastMoveTime = millis();
    }
    else if (keyIsDown("ArrowUp")) {
      movePlayer(the_player.x, the_player.y - 1);
      lastMoveTime = millis();
    }
    else if (keyIsDown("ArrowDown")) {
      movePlayer(the_player.x, the_player.y + 1);
      lastMoveTime = millis();
    }
  }
}


// Mouse controls
function mousePressed() {

  // Home button
  if (gameState !== "home" &&
      isMouseOver(homeX, homeY, homeW, homeH)) {

    gameState = "home";
    return;
  }

  // Main menu buttons
  if (gameState === "home") {

    if (isMouseOver(buttonX, buttonY, buttonW, buttonH)) {
      startCircuit(yasMarina, yasFinishLine);
    }
    else if (isMouseOver(buttonX, buttonY + 100, buttonW, buttonH)) {
      startTemplate();
    }
    else if (isMouseOver(buttonX, buttonY + 200, buttonW, buttonH)) {
      startCircuit(demoCircuit);
    }
  }

  // Circuit editing
  else if (gameState === "editing") {
    let x = Math.floor(mouseX / CELL_SIZE);
    let y = Math.floor(mouseY / CELL_SIZE);

    toggleCell(x, y);
  }
}

function mouseDragged() {
  if (gameState === "editing") {
    paintCell();
  }
}


// Keyboard controls
function keyPressed() {

  // Return to home
  if (key === "e") {
    gameState = "home";
  }

  // Prevent arrow keys from scrolling the page
  else if (
    key === "ArrowRight" ||
    key === "ArrowLeft" ||
    key === "ArrowUp" ||
    key === "ArrowDown"
  ) {
    return false;
  }
}


// I made this function for myself so i dont have to make a circuit all 
// over again just because its not positioned correctly.
function shiftCircuit(horizontal, vertical) {

  let newGrid = generateEmptyGrid(cols, rows);

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {

      let newX = x + horizontal;
      let newY = y + vertical;

      if (
        newX >= 0 && newX < cols &&
        newY >= 0 && newY < rows
      ) {
        newGrid[newY][newX] = grid[y][x];
      }
    }
  }

  grid = newGrid;

  the_player.x += horizontal;
  the_player.y += vertical;
}