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

  let x = startX;
  let y = startY;
  let direction = startDirection;

  const path = new Set<string>();

  while (inBounds && !isInLoop) {
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

    if (path.has(`${x};${y};${direction}`)) {
      isInLoop = true;
      break;
    }

    path.add(`${x};${y};${direction}`);
  }

  return { escaped: !inBounds, path };
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
const { path } = doesGuardEscape(
  originalGrid,
  guard.x,
  guard.y,
  guard.direction
);

const obstaclePositions = new Set<string>();
path.forEach((position) => {
  const x = Number(position.split(";")[0]);
  const y = Number(position.split(";")[1]);

  // Remove player position
  if (originalGrid[x][y] !== characters.EMPTY) {
    return;
  }

  originalGrid[x][y] = characters.CRATE;

  const { escaped } = doesGuardEscape(
    originalGrid,
    guard.x,
    guard.y,
    guard.direction
  );

  originalGrid[x][y] = characters.EMPTY;

  if (!escaped) {
    obstaclePositions.add(`${x};${y}`);
  }
});

console.log(obstaclePositions.size);
