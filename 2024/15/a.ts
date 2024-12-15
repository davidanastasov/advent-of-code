const input = await Deno.readTextFile("./input.txt");

const ROBOT = "@";
const EMPTY = ".";
const WALL = "#";
const BOX = "O";
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

moves.forEach((direction) => {
  switch (direction as Direction) {
    case UP: {
      let canMove = false;
      let emptySpotIndex = -1;

      for (let i = robotPos.i; i >= 1; i--) {
        if (map[i][robotPos.j] === WALL) {
          break;
        }

        if (map[i][robotPos.j] === EMPTY) {
          canMove = true;
          emptySpotIndex = i;
          break;
        }
      }

      if (canMove) {
        for (let i = emptySpotIndex; i < robotPos.i; i++) {
          map[i][robotPos.j] = map[i + 1][robotPos.j];
        }
        map[robotPos.i][robotPos.j] = EMPTY;
        robotPos.i--;
      }

      break;
    }

    case DOWN: {
      let canMove = false;
      let emptySpotIndex = -1;

      for (let i = robotPos.i; i < map.length; i++) {
        if (map[i][robotPos.j] === WALL) {
          break;
        }

        if (map[i][robotPos.j] === EMPTY) {
          canMove = true;
          emptySpotIndex = i;
          break;
        }
      }

      if (canMove) {
        for (let i = emptySpotIndex; i > robotPos.i; i--) {
          map[i][robotPos.j] = map[i - 1][robotPos.j];
        }
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
    if (map[i][j] === BOX) {
      sum += 100 * i + j;
    }
  }
}

console.log(sum);
