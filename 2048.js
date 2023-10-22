import Grid from "./grid.js";
import Tile from "./tile.js";
import { score } from "./grid.js";
// let score = 0;

// INISIALISASI
const gameBoard = document.getElementById("game-board");
const gameContainer = document.querySelector(".game-container");
const coverScreen = document.querySelector(".cover-screen");
const gameOverScreen = document.querySelector(".gameOver-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const homeButton = document.getElementById("home-button");
const result = document.getElementById("result");
// const gameOver = document.querySelector(".game-over");
// const ready = document.querySelector(".ready");

// BUAT GAME BOARD
const grid = new Grid(gameBoard);
// Isi game board dengan 2 tiles (posisi random)
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

// console.log();

// Setelah button di click akan menampilkan layar yang berisi board game
startButton.addEventListener("click", () => {
  // Hide the cover screen
  coverScreen.classList.add("hide");
  // Show the game container
  gameContainer.classList.remove("hide");
});

// Reset game ketika click restart button
restartButton.addEventListener("click", () => {
  resetGame();
});

homeButton.addEventListener("click", () => {
  gameOverScreen.classList.add("hide");
  gameContainer.classList.add("hide");
  coverScreen.classList.remove("hide");
});

// reset game
function resetGame() {
  gameContainer.classList.remove("hide");
  gameOverScreen.classList.add("hide");
  // Hapus semua tile yang ada di dalam grid
  grid.cells.forEach((cell) => {
    if (cell.tile) {
      cell.tile.remove();
      cell.tile = null;
    }
  });

  // Isi game board dengan 2 tile (posisi acak) seperti awal permainan
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
}

// Input berupa tombol arrow-up, arrow-left, arrow-right, dan arrow-left pada keyboard untuk memainkan game
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
  window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
  });
}

// Sinkronisasi input
async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  // Memanggil fungsi mergeTiles() setiap kali ada input
  grid.cells.forEach((cell) => cell.mergeTiles());

  // Setiap kali tiles bergerak, maka akan mucul tiles baru dengan posisi random
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  // Ketika tiles sudah penuh dan tidak bisa bergerak maka akan menampilkan layar game over beserta finale scorenya
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    gameContainer.classList.add("hide");
    coverScreen.classList.add("hide");
    gameOverScreen.classList.remove("hide");

    // const finalScore = grid.cell.score;
    result.innerText = `Final score: ${score}`;
    // startButton.innerText = "Try Again";
  }
  setupInput();
}

// Fungsi untuk memindahkan tiles sesuai dengan input geraknya
function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

// Fungsi untuk mengecek apakah tiles masih bisa digerakan sesuai input geraknya
function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

// API
// fetch("https://ets-pemrograman-web-f.cyclic.app/scores/score");
