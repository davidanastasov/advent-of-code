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

const originalGrid: string[][] = lines.map((line) => line.split(""));

function doesGuardEscape(
  grid: string[][],
  startX: number,
  startY: number,
  startDirection: string
) {
  let inBounds = true;
  let isInLoop = false;

  const last10Moves: string[] = [];
  const allMoves: string[] = [];

  let x = startX;
  let y = startY;
  let direction = startDirection;

  while (inBounds && !isInLoop) {
    const prevDir = direction;

    // Do movement
    switch (direction) {
      case directions.UP:
        if (x - 1 < 0) {
          x--;
          break;
        }

        if (grid[x - 1][y] === characters.CRATE) {
          direction = directions.RIGHT;
        } else {
          x--;
        }
        break;

      case directions.DOWN:
        if (x + 1 >= grid.length) {
          x++;
          break;
        }

        if (grid[x + 1][y] === characters.CRATE) {
          direction = directions.LEFT;
        } else {
          x++;
        }
        break;

      case directions.LEFT:
        if (y - 1 < 0) {
          y--;
          break;
        }

        if (grid[x][y - 1] === characters.CRATE) {
          direction = directions.UP;
        } else {
          y--;
        }
        break;

      case directions.RIGHT:
        if (y + 1 >= grid[0].length) {
          y++;
          break;
        }

        if (grid[x][y + 1] === characters.CRATE) {
          direction = directions.DOWN;
        } else {
          y++;
        }
        break;
    }

    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
      inBounds = false;
      break;
    }

    if (last10Moves.length === 10) {
      last10Moves.shift();
    }
    last10Moves.push(`${x},${y}`);

    if (prevDir !== direction) {
      isInLoop = checkForLoop(allMoves, last10Moves);
    }

    allMoves.push(`${x},${y}`);
  }

  return !inBounds;
}

function checkForLoop(all: string[], search: string[]) {
  for (let i = 0; i < all.length - search.length; i++) {
    let fullMatch = true;

    for (let j = 0; j < search.length; j++) {
      if (all[i + j] !== search[j]) {
        fullMatch = false;
        break;
      }
    }

    if (fullMatch) {
      return true;
    }
  }

  return false;
}

function findGuardPosition(grid: string[][]) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (Object.values(directions).includes(grid[i][j])) {
        return { x: i, y: j, direction: grid[i][j] };
      }
    }
  }
  return { x: -1, y: -1, direction: "" };
}

const guard = findGuardPosition(originalGrid);

let valid = 0;
for (let i = 0; i < originalGrid.length; i++) {
  for (let j = 0; j < originalGrid[i].length; j++) {
    if (originalGrid[i][j] !== characters.EMPTY) {
      continue;
    }

    originalGrid[i][j] = characters.CRATE;

    const escapes = doesGuardEscape(
      originalGrid,
      guard.x,
      guard.y,
      guard.direction
    );
    console.log(i, j, escapes);

    originalGrid[i][j] = characters.EMPTY;

    if (!escapes) {
      valid++;
    }
  }
}

console.log(valid);
