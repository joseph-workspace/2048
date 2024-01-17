export default class Tile {
  #x
  #y
  #value


  constructor(boardElement, value=Math.random() < 0.5 ? '4' : '2') {
    //create new div
    this.tileElement = document.createElement('div');
    //assign tile css class to tileElement property
    this.tileElement.classList.add('tile');
    //add 'tile' div as a child of boardElement div
    boardElement.append(this.tileElement);
    //this will call 
    this.value = value;
  }

  set x(xPos) {
    this.#x = xPos;
    this.tileElement.style.setProperty('--x', xPos);
  }
  set y(yPos) {
    this.#y = yPos;
    this.tileElement.style.setProperty('--y', yPos);
  }

  get value() {
    return this.#value;
  }

  set value(tileValue) {
    this.#value = tileValue;
    this.tileElement.textContent = tileValue;
    //set color of tile dynamically based on Powers of 2
    const powerOf2 = Math.log2(this.#value);
    const tileBrightness = 100 - (9 * powerOf2);
    const textBrightness = 9 * powerOf2;
    //set tile css variables
    //eventually add color variable so that user can change tile color at the beginning of a new game
    this.tileElement.style.setProperty('--tile-brightness', `${tileBrightness}%`);
    this.tileElement.style.setProperty('--text-brightness', `${textBrightness}%`);
  }

  //function that removes the tile after it's moved to merge 
  //(when a mergeTile is encountered) from the DOM
  remove() {
    this.tileElement.remove();
  }

}