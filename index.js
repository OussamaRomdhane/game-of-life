const SECOND_IN_MS = 1000;
const FPS = 15;

const gridDimensions = [2 ** 7, 2 ** 7];

const gameOfLife = new GameOfLife(...gridDimensions);

const canvas = document.getElementById("canvas");

const [n, m] = gridDimensions;

const { width, height } = canvas.getClientRects()[0];

const horizontalLinesCount = n - 1;
const verticalLinesCount = m - 1;

const cellWidth = width / n;
const cellHeight = height / m;

const ctx = canvas.getContext("2d");

const renderingState = {
  isPaused: false,
  hasStarted: false,
  hasGeneratedInitialState: false,
};

ctx.canvas.width = width;
ctx.canvas.height = height;

function drawBoard() {
  for (let i = 0; i < horizontalLinesCount; i++) {
    ctx.beginPath();

    ctx.moveTo(0, cellHeight * (i + 1));
    ctx.lineTo(width, cellHeight * (i + 1));

    ctx.stroke();
  }

  for (let j = 0; j < verticalLinesCount; j++) {
    ctx.beginPath();

    ctx.moveTo(cellWidth * (j + 1), 0);
    ctx.lineTo(cellWidth * (j + 1), height);

    ctx.stroke();
  }
}

function loop() {
  if (renderingState.isPaused) {
    return;
  }
  gameOfLife.performNextStep();
  drawState();
  setTimeout(function loopTimeout() {
    requestAnimationFrame(loop), SECOND_IN_MS / FPS;
  });
}

function drawState() {
  const state = gameOfLife.getCurrentState();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      if (!canvas.getContext) {
        throw "oh no";
      }
      ctx.beginPath();

      ctx.strokeStyle = "black";

      if (gameOfLife.isCellAlive(state[i][j])) {
        ctx.fillStyle = "black";
      }

      if (gameOfLife.isCellDead(state[i][j])) {
        ctx.fillStyle = "white";
      }

      ctx.rect(cellWidth * i, cellHeight * j, cellWidth, cellHeight);

      ctx.stroke();
      ctx.fill();
    }
  }
}

function start() {
  drawState();
  requestAnimationFrame(loop);
}

drawBoard();

document.addEventListener("click", function canvasClicked() {
  if (!renderingState.hasGeneratedInitialState) {
    renderingState.hasGeneratedInitialState = true;
    drawState();

    document.getElementById("subtitle").innerText = "Click anywhere to start";

    return;
  }

  if (!renderingState.hasStarted) {
    renderingState.hasStarted = true;
    start();

    document.getElementById("header").style.display = "none";

    return;
  }

  if (renderingState.isPaused) {
    start();
  }

  renderingState.isPaused = !renderingState.isPaused;
});
