import Grid from './Grid.js';
import Tile from './Tile.js';

const gameBoard = document.getElementById('game-board');

const grid = new Grid(gameBoard);

// console.log(grid.tiles)
grid.getRandomCell().tile = new Tile(gameBoard);
grid.getRandomCell().tile = new Tile(gameBoard);  
setupInput();


function setupInput() {
  document.addEventListener('keyup', handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      setupInput();
      break;
    case 'ArrowDown':
      moveDown();
      setupInput();
      break;
      case 'ArrowLeft':
        moveLeft();
        setupInput();
        break;  
      case 'ArrowRight':
        moveRight();
        setupInput();
        break;
    default:
      // console.log('Please push one of the arrow keys!')
      setupInput();
      return;
  }
  //after
  //add new tile at the end of turn; merge tiles etc.
  const addedTile = new Tile(gameBoard);
  grid.getRandomCell().tile = addedTile;

  //mergeTiles() fcn call here
  grid.tiles.forEach(cell => cell.mergeTiles())
  // console.log(`After mergeTiles is complete, the state of tiles is: ${JSON.stringify(grid.tiles)}`)
  console.log(grid.tiles);
}

function moveUp() {
  return moveTiles(grid.getCellsByColumn());
}
function moveDown() {
  return moveTiles(grid.getCellsByColumn().map(col => [...col].reverse()));
}
function moveLeft() {
  return moveTiles(grid.getCellsByRow());
}
function moveRight() {
  return moveTiles(grid.getCellsByRow().map(row => [...row].reverse()));
}

function moveTiles(formattedCells) {
  formattedCells.forEach(groupedCells => {
    for (let i = 1; i < groupedCells.length; i++) {
      const cell = groupedCells[i];
      if (cell.tile == null) continue;
      let lastValidCell;
      for (let j = i - 1; j >= 0; j--){
        //Reason for the break check before lastValidCell gets updated:
        //This occurs so that if there's another tile on the row/column 
        //of the tile you're trying to move then the tile will nestle up
        //to the next available space.

        //Failed Attempt explanation:
        //At first I tried this for loop without the cellToCheck variable altogether
        //and that caused problems with the tile not moving up when there
        //were other tiles already above it (assuming the player pressed up).
        //The same behavior occured with all other directions as well.
        const cellToCheck = groupedCells[j];
        if (!cellToCheck.canAccept(cell)) break;
        lastValidCell = cellToCheck;
      }
      //if lastValidCell passed the double nested for loop check then
      //it will be moved!
      if (lastValidCell != null) {
        if (lastValidCell.tile != null) {
          //if we're here, then lastValidCell's a mergeTile so we need to set it!
          // lastValidCell.tile = cell.tile;
          lastValidCell.mergeTile = cell.tile;
          cell.tile = null;
          // console.log(grid.tiles);
        } else {
          lastValidCell.tile = cell.tile;
          cell.tile = null;
          // console.log(grid.tiles)
        }
      }
    }
  })
}
