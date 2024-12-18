const input = await Deno.readTextFile("./input.txt");
const GRID_SIZE = 71;
const BYTES_COUNT = 1024;

// const input = await Deno.readTextFile("./test.txt");
// const GRID_SIZE = 7;
// const BYTES_COUNT = 12;

const END = "E";
const WALL = "#";

type Position = { x: number; y: number };

const start: Position = { x: 0, y: 0 };
const end: Position = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

const grid = new Array(GRID_SIZE)
  .fill(0)
  .map(() => new Array(GRID_SIZE).fill("."));

const bytes = input.split("\r\n").map((line): Position => {
  const coords = line.split(",");
  return { x: Number(coords[0]), y: Number(coords[1]) };
});

grid[start.y][start.x] = "S";

for (let i = 0; i < BYTES_COUNT; i++) {
  const byte = bytes[i];
  grid[byte.y][byte.x] = WALL;
}

grid[end.y][end.x] = END;

type Direction = "up" | "down" | "left" | "right";

const delta: Record<Direction, Position> = {
  up: { y: -1, x: 0 },
  down: { y: 1, x: 0 },
  left: { y: 0, x: -1 },
  right: { y: 0, x: 1 },
};

type Cursor = {
  position: Position;
  score: number;
};
const cursors: Cursor[] = [
  {
    position: start,
    score: 0,
  },
];

const finishedCursors: Cursor[] = [];
const visited = new Map<string, number>();

while (cursors.length > 0) {
  const cursor = cursors.shift()!;

  const cacheKey = `${cursor.position.y},${cursor.position.x}`;
  if (visited.has(cacheKey)) {
    continue;
  }

  visited.set(cacheKey, cursor.score);

  if (grid[cursor.position.y][cursor.position.x] === END) {
    finishedCursors.push(cursor);
    continue;
  }

  const possibleDirections: Direction[] = ["up", "down", "left", "right"];

  possibleDirections.forEach((dir) => {
    const newPos = {
      x: cursor.position.x + delta[dir].x,
      y: cursor.position.y + delta[dir].y,
    };

    if (
      newPos.x < 0 ||
      newPos.x > GRID_SIZE - 1 ||
      newPos.y < 0 ||
      newPos.y > GRID_SIZE - 1
    ) {
      return;
    }

    if (grid[newPos.y][newPos.x] !== WALL) {
      cursors.push({
        position: newPos,
        score: cursor.score + 1,
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

console.log(minPath!.score);
