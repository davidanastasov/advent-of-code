const START = "S";
const END = "E";
const WALL = "#";

type Direction = "up" | "down" | "left" | "right";
type Position = { i: number; j: number };

const input = await Deno.readTextFile("./input.txt");
const grid = input.split("\r\n").map((row) => row.split(""));

function find(grid: string[][], type: typeof START | typeof END): Position {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === type) {
        return { i, j };
      }
    }
  }
  return { i: -1, j: -1 };
}

const startPosition = find(grid, START);

const delta: Record<Direction, Position> = {
  up: { i: -1, j: 0 },
  down: { i: 1, j: 0 },
  left: { i: 0, j: -1 },
  right: { i: 0, j: 1 },
};

type Cursor = { position: Position; direction: Direction; score: number };
const cursors: Cursor[] = [
  { position: startPosition, direction: "right", score: 0 },
];

const finishedCursors: Cursor[] = [];
const visited = new Map<string, number>();

while (cursors.length > 0) {
  const cursor = cursors.shift()!;

  const cacheKey = `${cursor.position.i},${cursor.position.j},${cursor.direction}`;
  if (visited.has(cacheKey) && visited.get(cacheKey)! < cursor.score) {
    continue;
  }

  visited.set(
    `${cursor.position.i},${cursor.position.j},${cursor.direction}`,
    cursor.score
  );

  if (grid[cursor.position.i][cursor.position.j] === END) {
    finishedCursors.push(cursor);
    continue;
  }

  const possibleDirections: Direction[] =
    cursor.direction === "up"
      ? ["up", "left", "right"]
      : cursor.direction === "down"
      ? ["down", "left", "right"]
      : cursor.direction === "left"
      ? ["up", "down", "left"]
      : ["up", "down", "right"];

  possibleDirections.forEach((dir) => {
    const score = cursor.direction === dir ? 1 : 1000 + 1;

    const newPos = {
      i: cursor.position.i + delta[dir].i,
      j: cursor.position.j + delta[dir].j,
    };

    if (grid[newPos.i][newPos.j] !== WALL) {
      cursors.push({
        position: newPos,
        direction: dir,
        score: cursor.score + score,
      });
    }
  });
}

const minPath =
  finishedCursors.length > 0
    ? finishedCursors.reduce((acc, cursor) => {
        if (cursor.score < acc.score) {
          return cursor;
        }
        return acc;
      })
    : null;

if (minPath) {
  console.log(minPath.score);
} else {
  console.log("No path found");
}
