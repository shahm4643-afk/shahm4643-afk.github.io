// Character in Grid

const OPEN_TILE = 0;
const IMPASSABLE = 1;
const PLAYER = 9;

const CELL_SIZE = 20;
let rows;
let cols;
let grid;
let the_player = {
  x: 0,
  y: 0,
};


async function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height/CELL_SIZE);
  cols = Math.floor(width/CELL_SIZE);
  grid = generateRandomGrid(cols, rows);

  // put player in grid
  grid[the_player.y][the_player.x] = PLAYER;
}

function draw() {
  background(220);
  displayGrid();
}

function keyPressed() {
  if (key === 'r') {
    grid = generateRandomGrid(cols, rows);

    grid[the_player.y][the_player.x] = PLAYER;
  }
  else if (key === 'e') {
    grid = generateEmptyGrid(cols, rows);
    grid[the_player.y][the_player.x] = PLAYER;
  }
  else if (key === 'd') {
    movePlayer(the_player.x + 1, the_player.y);
  }
  else if (key === 'a') {
    movePlayer(the_player.x - 1, the_player.y);
  }
  else if (key === 'w') {
    movePlayer(the_player.x, the_player.y - 1);
  }
  else if (key === 's') {
    movePlayer(the_player.x, the_player.y + 1);
  }      
}

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);

  //self
  toggleCell(x, y);

  // //neighbours
  // toggleCell(x + 1, y);
  // toggleCell(x - 1, y);
  // toggleCell(x, y + 1);
  // toggleCell(x, y - 1);
}
function movePlayer(x, y) {
  // dont walk off the grid
  if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] === OPEN_TILE) {
    // keep track of where the player was
    let oldX = the_player.x;
    let oldY = the_player.y;

    // moving the player
    the_player.x = x;
    the_player.y = y;

    // putting the player in grid
    grid[the_player.y][the_player.x] = PLAYER;
    grid[oldY][oldX] = OPEN_TILE;

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

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 50) {
        newGrid[y].push(OPEN_TILE);
      }
      else {
        newGrid[y].push(IMPASSABLE);
      }
    }
  }
  return newGrid;
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

