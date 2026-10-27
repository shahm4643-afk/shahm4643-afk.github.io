// Project Title
// 2D arrays demo

// // for hardcoding
// let grid = [[1, 0, 1,0],
//             [0, 1, 1,1],
//             [1, 0, 0,1]
//             [1, 1, 0,1]];

// let cellSize;
// const SQUARE_DIMENSION =grid.length;

const SQUARE_DIMENSION = 10;
let grid;
let cellSize;


async function setup() {
  createCanvas(windowWidth, windowHeight);

  if (width < height) {
    cellSize = width/SQUARE_DIMENSION;
  }

  else {
    cellSize = height/SQUARE_DIMENSION;
  }

  grid = randomizedGrid(SQUARE_DIMENSION, SQUARE_DIMENSION);

}

function draw() {
  background(220);
  showGrid();
}

function showGrid() {
  for (let y = 0; y < SQUARE_DIMENSION; y++) {
    for (let x = 0; x < SQUARE_DIMENSION; x ++) {
      if (grid[y][x] === 1) {
        fill("black");
      }
      if (grid[y][x] === 0) {
        fill("white");
      }
      square(x*cellSize, y*cellSize, cellSize);
    }
  }
}

function randomizedGrid(cell, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cell; x++) {
      if (random(100) , 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
      }
    }
  }
  return newGrid;

}