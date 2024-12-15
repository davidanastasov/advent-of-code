const input = await Deno.readTextFile("./input.txt");

const ROBOT = "@";
const EMPTY = ".";
const WALL = "#";
const BOX = "O";
const BOX_LEFT = "[";
const BOX_RIGHT = "]";
const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";

const mapPart = input.split("\r\n\r\n")[0];
const movesPart = input.split("\r\n\r\n")[1].replaceAll("\r\n", "");

const map = mapPart.split("\r\n").map((line) => line.split(""));
const moves = movesPart.split("") as Direction[];

type Position = { i: number; j: number };
type Direction = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    const curr = map[i][j];
    switch (curr) {
      case WALL:
        map[i].splice(j + 1, 0, WALL);
        j++;

        break;

      case BOX:
        map[i].splice(j, 1, BOX_LEFT, BOX_RIGHT);
        j++;

        break;

      case EMPTY:
        map[i].splice(j + 1, 0, EMPTY);
        j++;

        break;

      case ROBOT:
        map[i].splice(j + 1, 0, EMPTY);
        j++;

        break;
    }
  }
}

function findRobot(map: string[][]) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === ROBOT) {
        return { i, j };
      }
    }
  }
  return { i: 0, j: 0 };
}

const robotPos = findRobot(map);

function getTouchedBoxes(
  position: Position,
  direction: typeof UP | typeof DOWN
) {
  const dx = direction === UP ? -1 : 1;
  const currentPos: Position = { i: position.i + dx, j: position.j };

  if (currentPos.i < 0 || currentPos.i >= map.length) return new Set<string>();
  if (currentPos.j < 0 || currentPos.j >= map[currentPos.i].length)
    return new Set<string>();

  const current = map[currentPos.i][currentPos.j];

  if (current === EMPTY || current === WALL) return new Set<string>();

  const touched = new Set<string>();

  touched.add(`${currentPos.i},${currentPos.j}`);
  const l = getTouchedBoxes(currentPos, direction);
  l?.forEach((box) => touched.add(box));

  if (current === BOX_LEFT) {
    touched.add(`${currentPos.i},${currentPos.j + 1}`);

    const res = getTouchedBoxes(
      { i: currentPos.i, j: currentPos.j + 1 },
      direction
    );
    res?.forEach((box) => touched.add(box));
  }

  if (current === BOX_RIGHT) {
    touched.add(`${currentPos.i},${currentPos.j - 1}`);

    const res = getTouchedBoxes(
      { i: currentPos.i, j: currentPos.j - 1 },
      direction
    );
    res?.forEach((box) => touched.add(box));
  }

  return touched;
}

function canMoveVertically(
  map: string[][],
  start: Position,
  direction: typeof UP | typeof DOWN
) {
  const dx = direction === UP ? -1 : 1;

  const isEmpty = map[start.i + dx][start.j] === EMPTY;
  if (isEmpty) {
    return { canMove: true as const, boxPositions: null };
  }

  const hasWall = map[start.i + dx][start.j] === WALL;
  if (hasWall) {
    return { canMove: false as const, boxPositions: null };
  }

  const touchedBoxes = getTouchedBoxes(start, direction);

  const allEmpty = touchedBoxes?.values().every((box) => {
    const currX = Number(box.split(",")[0]);
    const currY = Number(box.split(",")[1]);
    return map[currX + dx][currY] !== WALL;
  });

  return { canMove: allEmpty, boxPositions: touchedBoxes };
}

moves.forEach((direction) => {
  switch (direction) {
    case UP: {
      const { canMove, boxPositions } = canMoveVertically(map, robotPos, UP);

      if (canMove) {
        const sortedBoxes = boxPositions
          ? Array.from(boxPositions!).sort((a, b) => {
              const aX = Number(a.split(",")[0]);
              const bX = Number(b.split(",")[0]);
              return aX - bX;
            })
          : null;

        let shiftedBoxes = false;

        sortedBoxes?.forEach((box) => {
          const currX = Number(box.split(",")[0]);
          const currY = Number(box.split(",")[1]);

          map[currX - 1][currY] = map[currX][currY];
          map[currX][currY] = EMPTY;

          shiftedBoxes = true;
        });

        if (shiftedBoxes) {
          const topNeighbor = map[robotPos.i - 2][robotPos.j];
          if (topNeighbor === BOX_LEFT) {
            map[robotPos.i - 1][robotPos.j + 1] = EMPTY;
          } else if (topNeighbor === BOX_RIGHT) {
            map[robotPos.i - 1][robotPos.j - 1] = EMPTY;
          }
        }

        map[robotPos.i - 1][robotPos.j] = ROBOT;
        map[robotPos.i][robotPos.j] = EMPTY;

        robotPos.i--;
      }

      break;
    }

    case DOWN: {
      const { canMove, boxPositions } = canMoveVertically(map, robotPos, DOWN);

      if (canMove) {
        const sortedBoxes = boxPositions
          ? Array.from(boxPositions!).sort((a, b) => {
              const aX = Number(a.split(",")[0]);
              const bX = Number(b.split(",")[0]);
              return bX - aX;
            })
          : null;

        let shiftedBoxes = false;

        sortedBoxes?.forEach((box) => {
          const currX = Number(box.split(",")[0]);
          const currY = Number(box.split(",")[1]);

          map[currX + 1][currY] = map[currX][currY];
          map[currX][currY] = EMPTY;

          shiftedBoxes = true;
        });

        if (shiftedBoxes) {
          const bottomNeighbor = map[robotPos.i + 2][robotPos.j];
          if (bottomNeighbor === BOX_LEFT) {
            map[robotPos.i + 1][robotPos.j + 1] = EMPTY;
          } else if (bottomNeighbor === BOX_RIGHT) {
            map[robotPos.i + 1][robotPos.j - 1] = EMPTY;
          }
        }

        map[robotPos.i + 1][robotPos.j] = ROBOT;
        map[robotPos.i][robotPos.j] = EMPTY;

        robotPos.i++;
      }

      break;
    }

    case LEFT: {
      let canMove = false;
      let emptySpotIndex = -1;

      for (let j = robotPos.j; j >= 1; j--) {
        if (map[robotPos.i][j] === WALL) {
          break;
        }

        if (map[robotPos.i][j] === EMPTY) {
          canMove = true;
          emptySpotIndex = j;
          break;
        }
      }

      if (canMove) {
        for (let j = emptySpotIndex; j < robotPos.j; j++) {
          map[robotPos.i][j] = map[robotPos.i][j + 1];
        }
        map[robotPos.i][robotPos.j] = EMPTY;
        robotPos.j--;
      }

      break;
    }

    case RIGHT: {
      let canMove = false;
      let emptySpotIndex = -1;

      for (let j = robotPos.j; j < map[robotPos.i].length; j++) {
        if (map[robotPos.i][j] === WALL) {
          break;
        }

        if (map[robotPos.i][j] === EMPTY) {
          canMove = true;
          emptySpotIndex = j;
          break;
        }
      }

      if (canMove) {
        for (let j = emptySpotIndex; j > robotPos.j; j--) {
          map[robotPos.i][j] = map[robotPos.i][j - 1];
        }
        map[robotPos.i][robotPos.j] = EMPTY;
        robotPos.j++;
      }

      break;
    }
  }
});

let sum = 0;

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] === BOX_LEFT) {
      sum += 100 * i + j;
    }
  }
}

console.log(sum);
