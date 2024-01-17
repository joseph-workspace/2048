const GRID_SIZE = 4;
const CELL_WIDTH = 20;
const CELL_GAP = 2;

export default class Grid {
  constructor(gameBoard) {
    this.tiles = createTiles(gameBoard).map(cellIndex => new Cell(cellIndex % GRID_SIZE, Math.floor(cellIndex / GRID_SIZE)));
    gameBoard.style.setProperty('--grid-size', GRID_SIZE);
    gameBoard.style.setProperty('--cell-width', `${CELL_WIDTH}vmin`);
    gameBoard.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);
  }

  getRandomCell() {
    const availableCells = this.tiles.filter(cell => cell.tile == null)
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  getCellsByColumn() {
    return this.tiles.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, [])
  }

  getCellsByRow() {
    return this.tiles.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, [])
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

  set tile(tileValue) {
    this.#tile = tileValue;
    if (this.#tile == null) return;
    tileValue.x = this.#x;
    tileValue.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(tile) {
    this.#mergeTile = tile;
    //Reason for the guard clause to check if mergeTile is null:
    //without this check 
    if (this.#mergeTile == null) return;
    //set tile of the cell that's moving so that it
    //moves in the GUI
    tile = this.#tile;
    //remove cell that just moved from the DOM?

  }

  mergeTiles() {
    if (this.#tile == null || this.#mergeTile == null) return;
    // do arithmitic for new tile value
    const sum = parseInt(this.#tile.value) + parseInt(this.#mergeTile.value);
    //updates tile value and changes background color of tile
    //as well as tile's font color
    this.#tile.value = sum;
    // remove old tile from the dom?
    this.#mergeTile.remove();
    // set mergeTiles back to null to reset cells for next turn
    this.#mergeTile = null;
  }


  canAccept(movingCell) {
    //Explanation of encountered bug with this.#tile.value === movingCell.#tile.value:
    //because I use a string in the Tile constructor for the values of 'value'
    // I end up having to use parseInt() when performing addition within mergeTiles()
    //this created a discrepency between randomly generated tiles (only 2s and 4s) and
    //tiles that were created as the result of a merge. In order to fix this I ended up
    //using the == operator instead of === however, another possible fix would just be
    //to change the number back to a string in mergeTiles() with this.#tile.value = sum.toString()
    //either fix works!
    return (this.#tile == null || (this.#tile.value == movingCell.#tile.value) && this.#mergeTile == null);
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