import Grid from './Grid.js';
import Tile from './Tile.js';
import Player from './Player.js';

const gameBoard = document.getElementById('game-board');


const grid = new Grid(gameBoard);

// console.log(grid.tiles)
grid.getRandomCell().tile = new Tile(gameBoard);
grid.getRandomCell().tile = new Tile(gameBoard);  
setupInput();


function setupInput() {
  document.addEventListener('keyup', handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInput();
        return;  
      }
      await moveUp();
      setupInput();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInput();
        return;  
      }
      await moveDown();
      setupInput();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInput();
        return;  
      }
      await moveLeft();
      setupInput();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInput();
        return;  
      }
      await moveRight();
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

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await addedTile.cssAnimation('animationend');
    grid.tiles.forEach(cell => cell.mergeTiles())
    alert('You lost! Please try again.')
    return
  }

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

  return Promise.all(
    formattedCells.flatMap(groupedCells => {
      const promises = [];
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
            promises.push(cell.tile.cssAnimation());
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
      return promises;
    })
  )
}

function canMoveUp() {
  return canMove(grid.getCellsByColumn())
}

function canMoveDown() {
  return canMove(grid.getCellsByColumn().map(col => [...col].reverse()))
}

function canMoveLeft() {
  return canMove(grid.getCellsByRow())
}

function canMoveRight() {
  return canMove(grid.getCellsByRow().map(row => [...row].reverse()))
}

function canMove(formattedCells) {
  return formattedCells.some(groupedCells => {
    return groupedCells.some((cell, index) => {
      //If either of the 2 conditions below is true, then the tile can't move
      if (index === 0 || cell.tile == null) return false;
      const adjacentCell = groupedCells[index - 1];
      //If either of the 2 conditions below are true then at least 1 cell can move 
      if (adjacentCell.tile == null || cell.tile.value === adjacentCell.tile.value) return true;
    })
  })
}
