const input = await Deno.readTextFile("./input.txt");

const characters = {
  CRATE: "#",
  EMPTY: ".",
};

const directions = {
  UP: "^",
  DOWN: "v",
  LEFT: "<",
  RIGHT: ">",
};

const lines = input.split("\r\n");

const grid: string[][] = lines.map((line) => line.split(""));

function findGuardPosition(grid: string[][]) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (Object.values(directions).includes(grid[i][j])) {
        return { i, j, direction: grid[i][j] };
      }
    }
  }
}

const guardPosition = findGuardPosition(grid);
let { i: posI, j: posJ, direction } = guardPosition!;

let inBounds = true;
const visited = new Set();

while (inBounds) {
  grid[posI][posJ] = characters.EMPTY;

  // Do movement
  switch (direction) {
    case directions.UP:
      if (posI - 1 < 0) {
        posI--;
        break;
      }

      if (grid[posI - 1][posJ] === characters.CRATE) {
        direction = directions.RIGHT;
      } else {
        posI--;
      }
      break;

    case directions.DOWN:
      if (posI + 1 >= grid.length) {
        posI++;
        break;
      }

      if (grid[posI + 1][posJ] === characters.CRATE) {
        direction = directions.LEFT;
      } else {
        posI++;
      }
      break;

    case directions.LEFT:
      if (posJ - 1 < 0) {
        posJ--;
        break;
      }

      if (grid[posI][posJ - 1] === characters.CRATE) {
        direction = directions.UP;
      } else {
        posJ--;
      }
      break;

    case directions.RIGHT:
      if (posJ + 1 >= grid[0].length) {
        posJ++;
        break;
      }

      if (grid[posI][posJ + 1] === characters.CRATE) {
        direction = directions.DOWN;
      } else {
        posJ++;
      }
      break;
  }

  if (posI < 0 || posI >= grid.length || posJ < 0 || posJ >= grid[0].length) {
    inBounds = false;
    break;
  }

  visited.add(`${posI},${posJ}`);
  grid[posI][posJ] = direction;
}

console.log(visited.size);
