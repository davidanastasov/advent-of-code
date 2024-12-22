const input = await Deno.readTextFile("./input.txt");

const START = "S";
const END = "E";
const WALL = "#";
const MIN_CHEATS = 100;

const grid = input.split("\r\n").map((row) => row.split(""));

type Position = { i: number; j: number };

function findPosition(type: string): Position {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === type) {
        return { i, j };
      }
    }
  }
  return { i: -1, j: -1 };
}

const startPos = findPosition(START);
const endPos = findPosition(END);

const originalPath = new Set<string>();
const path: Position[] = [];

const directions: Position[] = [
  { i: -1, j: 0 }, // Top
  { i: 0, j: 1 }, // Right
  { i: 1, j: 0 }, // Bottom
  { i: 0, j: -1 }, // Left
];

function discoverPath(start: Position) {
  let current = start;

  while (grid[current.i][current.j] !== END) {
    originalPath.add(`${current.i},${current.j}`);
    path.push(current);

    for (const dir of directions) {
      const di = current.i + dir.i;
      const dj = current.j + dir.j;

      if (di < 0 || di >= grid.length || dj < 0 || dj >= grid[0].length) {
        continue;
      }

      if (grid[di][dj] !== WALL && !originalPath.has(`${di},${dj}`)) {
        current = { i: di, j: dj };
        break;
      }
    }
  }

  originalPath.add(`${endPos.i},${endPos.j}`);
  path.push(endPos);
}

discoverPath(startPos);

const possibleMoves: Position[] = [
  { i: -2, j: 0 }, // Top
  { i: 2, j: 0 }, // Bottom
  { i: 0, j: -2 }, // Left
  { i: 0, j: 2 }, // Right
];

function getPossibleNeighbors(pos: Position) {
  const validPositions: Position[] = [];

  possibleMoves.forEach((move) => {
    const newPos: Position = {
      i: pos.i + move.i,
      j: pos.j + move.j,
    };

    if (originalPath.has(`${newPos.i},${newPos.j}`)) {
      validPositions.push(newPos);
    }
  });

  return validPositions;
}

const solutions: Record<number, number> = {};

path.forEach((position, i) => {
  const possible = getPossibleNeighbors(position);

  possible.forEach((pos) => {
    const index = path.findIndex((p) => p.i === pos.i && p.j === pos.j);
    const saves = index - i - 2;

    if (saves <= 0) return;

    if (!(saves in solutions)) {
      solutions[saves] = 0;
    }
    solutions[saves]++;
  });
});

let totalCount = 0;

for (const [saves, count] of Object.entries(solutions)) {
  if (Number(saves) >= MIN_CHEATS) {
    totalCount += count;
  }
}

console.log(totalCount);
