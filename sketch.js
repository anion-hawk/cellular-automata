const width = 1600;
const height = 800;
let resolution = 10;
let cols = width / resolution;
let rows = height / resolution;
let grids;
let buffer;

let underPopLimit = 2;
let overPopLimit = 3;
let reprodLimit = 3;

function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent(document.body);

  grids = [make2DArray(cols, rows), make2DArray(cols, rows)];
  buffer = 0;
}

function draw() {
  background(0);
  drawGrid(grids[buffer]);

  // compute next generation
  nextState();
}


function nextState() {
  let nextBuffer = 1 - buffer;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let neighbours = countLiveNeighbours(buffer, i, j);
      if (neighbours < underPopLimit || neighbours > overPopLimit)
        grids[nextBuffer][i][j] = 0;
      else if (neighbours === reprodLimit & grids[buffer][i][j] === 0)
        grids[nextBuffer][i][j] = 1;
      else
        grids[nextBuffer][i][j] = grids[buffer][i][j];
    }
  }
  buffer = nextBuffer;
}

function countLiveNeighbours(buffer, x, y) {
  let neighbours = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      c = (x + i + cols) % cols;
      r = (y + j + rows) % rows;
      neighbours += grids[buffer][c][r];
    }
  }
  neighbours -= grids[buffer][x][y];
  return neighbours;
}



function make2DArray(cols, rows) {
  return Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => round(random()))
  );
}

function drawGrid(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let x = i * resolution;
      let y = j * resolution;
      fill(255 * grid[i][j]);
      stroke(0);
      rect(x, y, resolution - 1, resolution - 1);
    }
  }
}