function Gameboard() {
  const row = 3;
  const column = 3;
  const board = [];

  const reset = () => {
    for (let i = 0; i < row; i++) {
      board[i] = [];
      for (let j = 0; j < column; j++) {
        board[i].push(Tile());
      }
    }
  }
  reset();

  //tileNumber is zero based
  const getRow = (tileNumber) => Math.floor(tileNumber / column);
  const getColumn = (tileNumber) => tileNumber % column;
  const getBoard = () => board;

  const updateBoard = (tileNumber, player) => {
    board[getRow(tileNumber)][getColumn(tileNumber)].setValue(player);
  };

  //return boolean
  const patternChecker = (length = 3, player = 'X') => {
    let temp = player;
    let isTherePattern = false;

    const check = () => isTherePattern;

    //diagonal checks
    if (length <= Math.min(row, column)) {
      for (let i = 0; i <= row-length; i++) {
        if (isTherePattern) break;
        for (let j = 0; j <= column-length; j++) {
          if (isTherePattern) break;
          let tempRowForward = i + (length-1);
          let tempRowBack = i;
          let tempCol = j;
          let backDiagonal = 0;
          let forwardDiagonal = 0;

          for (let k = 0; k < length; k++) {
            if (isTherePattern) break;

            if (board[tempRowBack][tempCol].getValue() === temp) backDiagonal++;
            if (board[tempRowForward][tempCol].getValue() === temp) forwardDiagonal++;
            if (backDiagonal === length ||
                forwardDiagonal === length) isTherePattern = true;

            tempRowBack++;
            tempRowForward--;
            tempCol++;
          }
        }
      }
    }

    //horizontal
    if (length <= column) {
      for (let i = 0; i < row; i++) {
        if (isTherePattern) break;
        for (let j = 0; j <= column-length; j++) {
          if (isTherePattern) break;
          let tempCol = j;
          let horizontal = 0;

          for (let k = 0; k < length; k++) {
            if (isTherePattern) break;

            if (board[i][tempCol].getValue() === temp) horizontal++;
            if (horizontal === length) isTherePattern = true;

            tempCol++;
          }
        }
      }
    }

    //vertical
    if (length <= row) {
      for (let i = 0; i <= row-length; i++) {
        if (isTherePattern) break;
        for (let j = 0; j < column; j++) {
          if (isTherePattern) break;
          let tempRow = i;
          let vertical = 0;

          for (let k = 0; k < length; k++) {
            if (isTherePattern) break;

            if (board[tempRow][j].getValue() === temp) vertical++;
            if (vertical === length) isTherePattern = true;

            tempRow++;
          }
        }
      }
    }

    return isTherePattern;
  };

  const printBoard = () => {
    let consoleBoard = '';
    board.forEach((row) => {
      row.forEach((tile) => consoleBoard += tile.getValue());
      consoleBoard += '\n';
    })
    console.log(consoleBoard);
  };

  const print = () => {
    const consoleBoard = board.map((row) => 
      row.map((tile) => tile.getValue()));
    console.log(consoleBoard);
  };

  return {
    getBoard,
    updateBoard,
    printBoard,
    print,
    patternChecker,
    reset
  };
}

//put inside gameboard ?
function Tile() {
  let value = '-';
  const getValue = () => value;
  const setValue = (newVal) => value = newVal;

  return {
    getValue,
    setValue
  };
}

function Player() {
  let name = 'Player1';
  let tileType = 'X';
  const getName = () => name;
  const setName = (newName) => name = newName;
  const getTileType = () => tileType;
  const setTileType = (newTileType) => tileType = newTileType;

  return {
    getName,
    setName,
    getTileType,
    setTileType
  };
}

function Gamecontroller() {
  const gboard = Gameboard();
  const players = [];
  let hasWin = false;
  players[0] = Player();
  players[1] = Player();
  players[1].setName('Player2');
  players[1].setTileType('O');

  let currentPlayer = players[0];
  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ?
      players[1] : players[0];
  }
  const getCurrentPlayer = () => currentPlayer;

  const checkWin = () => {
    if (gboard.patternChecker(3, currentPlayer.getTileType())) {
      //alert(currentPlayer.getName() + ' wins!');
      console.log(currentPlayer.getName());
      hasWin = true;
    }
    return hasWin;
  }

  const play = (pos) => {
    if (checkWin()) {
      gboard.reset();
      hasWin = false;
    }
    let position = parseInt(pos);
    gboard.updateBoard(position, currentPlayer.getTileType());
    gboard.printBoard();
    if (!checkWin()) switchPlayer();
  }

  return {
    play,
    getCurrentPlayer,
    checkWin
  };
}

function screenController() {
  const gc = Gamecontroller();
  const arrayLength = 9;
  const elements = [];
  const h1 = document.querySelector('.heading h1');

  const elementRemover = () => {
    elements.splice(0, -1);
    const boxDiv = document.querySelector('.box');
    while (boxDiv.firstChild) {
      boxDiv.removeChild(boxDiv.firstChild);
    }
  };

  h1.textContent = gc.getCurrentPlayer().getName() + ' turn';
  const display = (event) => {
    if (gc.getCurrentPlayer().getName() === 'Player1') {
      event.target.classList.add('cross');
      event.target.removeEventListener('click', display);
    }
    else {
      event.target.classList.add('circle');
      event.target.removeEventListener('click', display);
    }
    
    gc.play(event.target.dataset.tile);
    if (gc.checkWin()) {
      h1.textContent = gc.getCurrentPlayer().getName() + ' wins!';
      //elementRemover();
      //elementGenerator();
    }
    else 
      h1.textContent = gc.getCurrentPlayer().getName() + ' turn';
  }

  const elementGenerator = () => {
    for (let i = 0; i < arrayLength; i++) {
      elements.push(document.createElement('button'));
      elements[i].classList.add('flex-box', 'tile');
      elements[i].setAttribute('data-tile', i);
      elements[i].addEventListener('click', display);
      document.querySelector('.box').appendChild(elements[i]);
    }
  };
  
  elementGenerator();

  return {
    display
  };
}

//const g = Gamecontroller();
screenController();
//g.start();
//const g = Gameboard();
//console.log(Player('test').getName());