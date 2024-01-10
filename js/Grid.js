const GRID_SIZE = 4;
const CELL_WIDTH = 20;
const CELL_GAP = 2;

export default class Grid {
  constructor(gameBoard) {
    this.tiles = createTiles(gameBoard).map(cellIndex => new Cell(cellIndex % GRID_SIZE, Math.floor(cellIndex / GRID_SIZE)));
    console.log(this.tiles);
    gameBoard.style.setProperty('--grid-size', GRID_SIZE);
    gameBoard.style.setProperty('--cell-width', `${CELL_WIDTH}vmin`);
    gameBoard.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);
  }

  getRandomCell() {
    const availableCells = this.tiles.filter(cell => cell.tile == null)
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }
}

class Cell {
  #tile
  #mergeTile
  #x
  #y

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
    this.#tile = null;
    this.#mergeTile = null;
  }

  get tile() {
    return this.#tile;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  set tile(newTile) {
    this.#tile = newTile;
    newTile.x = this.#x;
    newTile.y = this.#y;
  }
}

function createTiles(gameBoard) {
  let tiles = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    //add 
    const newCell = document.createElement('div');
    newCell.classList.add('cell');
    gameBoard.append(newCell);
    const cellIndex = i;
    tiles.push(cellIndex);
  }
  return tiles;
}