export default class Tile {
  #x
  #y


  constructor(boardElement, value=Math.random() < 0.5 ? '4' : '2') {
    //create new div
    this.tileElement = document.createElement('div');
    //assign tile css class to tileElement property
    this.tileElement.classList.add('tile');
    //add 'tile' div as a child of boardElement div
    boardElement.append(this.tileElement);

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

  set value(tileValue) {
    this.tileElement.textContent = tileValue;
  }

}