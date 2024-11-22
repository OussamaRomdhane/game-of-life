function GameOfLife(...args) {
  const DEAD_CELL = 0;
  const LIVE_CELL = 1;

  const MIN_N = 2 ** 3; // 8
  const MAX_N = 2 ** 16; // 65536

  const MIN_M = 2 ** 3; // 8
  const MAX_M = 2 ** 16; // 65536

  let initialState;
  let state;

  if (args.length !== 1 && args.length !== 2) {
    throw "invalid constructor call";
  }

  if (args.length === 1) {
    if (!_validateState(args[0])) {
      throw "invalid initial state";
    }
    this.initialState = structuredClone(args[0]);
    this.state = structuredClone(this.initialState);
  }

  if (args.length === 2) {
    const [n, m] = args;

    if (typeof n !== "number" || typeof m !== "number") {
      throw "dimensions should be numbers";
    }

    if (n < MIN_N || m < MIN_M) {
      throw "dimensions are too small";
    }

    if (n > MAX_N || m > MAX_M) {
      throw "dimensions are too big";
    }

    this.initialState = Array.from({ length: n }, () =>
      Array.from({ length: m }, () =>
        Math.random() > 0.5 ? LIVE_CELL : DEAD_CELL
      )
    );

    this.state = structuredClone(this.initialState);
  }

  function _validateState(stateToValidate) {
    if (!Array.isArray(stateToValidate)) {
      return false;
    }

    if (!stateToValidate.every((item) => Array.isArray(item))) {
      return false;
    }

    if (stateToValidate.length < MIN_N || stateToValidate.length > MAX_N) {
      return false;
    }

    if (
      stateToValidate[0].length < MIN_M ||
      stateToValidate[0].length > MAX_M ||
      stateToValidate.some((item) => item.length !== stateToValidate[0].length)
    ) {
      return false;
    }

    if (
      !stateToValidate.every((line) =>
        line.every((cell) => cell === DEAD_CELL || cell === LIVE_CELL)
      )
    ) {
      return false;
    }

    return true;
  }

  this.getInitialState = function getInitialState() {
    return this.initialState;
  };

  this.getCurrentState = function getCurrentState() {
    return this.state;
  };

  this.reset = function reset() {
    this.state = structuredClone(this.initialState);
    return this;
  };

  this.setCurrentState = function setCurrentState(newState) {
    this.state = structuredClone(newState);
    return this;
  };

  this.getNewCellValue = function getNewCellValue(
    oldCellValue,
    cellNeighborsCount
  ) {
    if (
      oldCellValue === LIVE_CELL &&
      (cellNeighborsCount === 2 || cellNeighborsCount === 3)
    ) {
      return LIVE_CELL;
    }

    if (oldCellValue === DEAD_CELL && cellNeighborsCount === 3) {
      return LIVE_CELL;
    }

    return DEAD_CELL;
  };

  this.countCellLiveNeighbors = function countCellLiveNeighbors(
    rowIndex,
    columnIndex
  ) {
    let count = 0;

    for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
      for (let j = columnIndex - 1; j <= columnIndex + 1; j++) {
        if (i === rowIndex && j === columnIndex) {
          continue;
        }

        wi = (i + this.state.length) % this.state.length;
        wj = (j + this.state[0].length) % this.state[0].length;

        count += this.state[wi][wj] === LIVE_CELL ? 1 : 0;
      }
    }

    return count;
  };

  this.getNextStep = function getNextStep() {
    const newState = [];

    for (let i = 0; i < this.state.length; i++) {
      newState[i] = [];
      for (let j = 0; j < this.state[i].length; j++) {
        const cellNeighborsCount = this.countCellLiveNeighbors(i, j);

        newState[i][j] = this.getNewCellValue(
          this.state[i][j],
          cellNeighborsCount
        );
      }
    }

    return newState;
  };

  this.performNextStep = function performNextStep() {
    this.state = this.getNextStep();
    return this;
  };

  this.isCellAlive = function isCellAlive(cellValue) {
    return cellValue === LIVE_CELL;
  };

  this.isCellDead = function isCellDead(cellValue) {
    return cellValue === DEAD_CELL;
  };

  return this;
}
