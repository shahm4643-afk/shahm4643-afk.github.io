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

// Character in Grid

const OPEN_TILE = 0;
const IMPASSABLE = 1;
const PLAYER = 9;

const CELL_SIZE = 10;
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

let buttonW = 250;
let buttonH = 60;
let buttonX, buttonY;

let homeW = 100;
let homeH = 40;
let homeX, homeY;

async function setup() {
  createCanvas(windowWidth, windowHeight);

  rows = Math.floor(height / CELL_SIZE);
  cols = Math.floor(width / CELL_SIZE);

  grid = generateEmptyGrid(cols, rows);
  grid[the_player.y][the_player.x] = PLAYER;

  demoCircuit = await loadJSON("raceTrackDemo.json");

  textAlign(CENTER, CENTER);

  buttonX = width / 2 - buttonW / 2;
  buttonY = height / 2;
  homeX = width - homeW - 20;
  homeY = 20;
}

function draw() {
  background(220);

  if (gameState === "home") {
    menuScreen();
  }
  else {
    handleMovement();
    displayGrid();

    if (gameState === "finished") {
      fill("red");
      textSize(60);
      text("Finish", width / 2, height / 2);
    }

    drawHomeButton();
  }
}

function draw() {
  background(220);

  if (gameState === "home") {
    menuScreen();
  }
  else {
    handleMovement();
    displayGrid();

    if (gameState === "finished") {
      fill("red");
      textSize(60);
      text("Finish", width / 2, height / 2);
    }

    drawHomeButton();
  }
}

function menuScreen() {
  fill("black");
  textSize(48);
  text("Select Your Circuit", width / 2, height / 2 - 100);

  drawButton("Demo Circuit", buttonX, buttonY);
}

function keyPressed() {
  if (key === 'e') {
    grid = generateEmptyGrid(cols, rows);
    grid[the_player.y][the_player.x] = PLAYER;
    gameState = "home";
  }
  else if (key === 'm') {
    startCircuit();
}
  else if (key === "ArrowRight" || key === "ArrowLeft" || 
           key === "ArrowUp" || key === "ArrowDown") {
  return false;
  
}

  else if (key === 'm') {
    gameState = "playing";
    grid = structuredClone(demoCircuit);

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
  }
}

function mousePressed() {
  if (gameState !== "home" &&
      isMouseOver(homeX, homeY, homeW, homeH)) {
    gameState = "home";
    return;
  }

  if (gameState === "home") {
    if (isMouseOver(buttonX, buttonY, buttonW, buttonH)) {
      startCircuit();
    }
  }
  else if (gameState === "playing") {
    let x = Math.floor(mouseX / CELL_SIZE);
    let y = Math.floor(mouseY / CELL_SIZE);

    toggleCell(x, y);
  }
}
function movePlayer(x, y) {
  if (gameState === "finished") {
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
  }
}

function toggleCell(x, y) {
  //make sure you're in the grid
  if (x >= OPEN_TILE && x < cols && y >= OPEN_TILE && y < rows) {
    if (grid[y][x] === OPEN_TILE) {
      grid[y][x] = IMPASSABLE;
    }
    else if (grid[y][x] === IMPASSABLE) {
      grid[y][x] = OPEN_TILE;
    }
  }
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === OPEN_TILE) {
        fill('white');
      }
      else if (grid[y][x] === IMPASSABLE) {
        fill('black');
      }
      else if (grid[y][x] === PLAYER) {
        fill('red');
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
    
  }
}


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

function mouseDragged() {
  if (gameState === "playing") {
    paintCell();
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
      else {
        grid[y][x] = IMPASSABLE;
      }
    }
  }
}

function handleMovement() {
    if (gameState !== "playing") {
        return;
    }
  if (gameState === "finished") {
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

function drawButton(label, bx, by) {
  fill("black");
  rect(bx, by, buttonW, buttonH);

  fill("white");
  textSize(24);
  text(label, bx + buttonW / 2, by + buttonH / 2);
}

function isMouseOver(bx, by, w, h) {
  return mouseX >= bx && mouseX <= bx + w && mouseY >= by && mouseY <= by + h;
}

function startCircuit() {
  grid = structuredClone(demoCircuit);

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
  gameState = "playing";
}

function drawHomeButton() {
  fill("black");
  rect(homeX, homeY, homeW, homeH);

  fill("white");
  textSize(20);
  text("Home", homeX + homeW / 2, homeY + homeH / 2);
}