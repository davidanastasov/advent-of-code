const input = await Deno.readTextFile("./input.txt");

const START = "S";
const END = "E";
const WALL = "#";
const MIN_CHEATS = 100;
const MAX_CHEATS = 20;

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

const path: Position[] = [];
const pathPositions = new Map<string, number>();

const directions: Position[] = [
  { i: -1, j: 0 }, // Top
  { i: 0, j: 1 }, // Right
  { i: 1, j: 0 }, // Bottom
  { i: 0, j: -1 }, // Left
];

function discoverPath(start: Position) {
  let current = start;

  while (grid[current.i][current.j] !== END) {
    path.push(current);
    pathPositions.set(`${current.i},${current.j}`, pathPositions.size);

    for (const dir of directions) {
      const di = current.i + dir.i;
      const dj = current.j + dir.j;

      if (di < 0 || di >= grid.length || dj < 0 || dj >= grid[0].length) {
        continue;
      }

      if (grid[di][dj] !== WALL && !pathPositions.has(`${di},${dj}`)) {
        current = { i: di, j: dj };
        break;
      }
    }
  }

  path.push(endPos);
  pathPositions.set(`${endPos.i},${endPos.j}`, pathPositions.size);
}

discoverPath(startPos);

let totalCount = 0;

function getPossibleNeighbors(pos: Position) {
  const firstDistance = Math.max(pathPositions.get(`${pos.i},${pos.j}`)!);

  for (let i = -MAX_CHEATS; i <= MAX_CHEATS; i++) {
    const x = MAX_CHEATS - Math.abs(i);

    for (let j = -x; j <= x; j++) {
      const newPos: Position = {
        i: pos.i + i,
        j: pos.j + j,
      };

      if (pathPositions.has(`${newPos.i},${newPos.j}`)) {
        const distance = pathPositions.get(`${newPos.i},${newPos.j}`)!;
        const saves = distance - firstDistance - Math.abs(i) - Math.abs(j);

        if (saves >= MIN_CHEATS) {
          totalCount++;
        }
      }
    }
  }
}

for (let i = 0; i < path.length - MIN_CHEATS; i++) {
  const position = path[i];
  getPossibleNeighbors(position);
}

console.log(totalCount);
