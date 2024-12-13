const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\r\n");

const farm = lines.map((line) => line.split(""));

type Position = { i: number; j: number };
type Direction = "up" | "down" | "left" | "right";

const visited = new Set<string>();

function checkNeighbors(pos: Position) {
  const symbol = farm[pos.i][pos.j];

  const positions: Position[] = [];
  let perimeter = 0;

  if (visited.has(`${pos.i},${pos.j}`)) {
    return { positions, perimeter };
  }

  positions.push(pos);
  visited.add(`${pos.i},${pos.j}`);

  const directions: Position[] = [
    { i: pos.i - 1, j: pos.j }, // Up
    { i: pos.i + 1, j: pos.j }, // Down
    { i: pos.i, j: pos.j - 1 }, // Left
    { i: pos.i, j: pos.j + 1 }, // Right
  ];

  directions.forEach((dir) => {
    try {
      if (farm[dir.i][dir.j] === symbol) {
        const result = checkNeighbors(dir);
        positions.push(...result.positions);
        perimeter += result.perimeter;
      } else {
        perimeter++;
      }
    } catch {
      // out of bounds
      perimeter++;
    }
  });

  return { positions, perimeter };
}

const walls = new Set<string>();

function isWall(pos: Position, symbol: string, dir: Direction) {
  if (walls.has(`${pos.i},${pos.j},${dir}`)) {
    return false;
  }

  walls.add(`${pos.i},${pos.j},${dir}`);

  const point: Position =
    dir === "up"
      ? { i: pos.i - 1, j: pos.j }
      : dir === "down"
      ? { i: pos.i + 1, j: pos.j }
      : dir === "left"
      ? { i: pos.i, j: pos.j - 1 }
      : { i: pos.i, j: pos.j + 1 };

  let isBorder = false;

  const isOutOfBounds =
    point.i < 0 ||
    point.i >= farm.length ||
    point.j < 0 ||
    point.j >= farm[0].length;

  if (isOutOfBounds || farm[point.i][point.j] !== symbol) {
    isBorder = true;
  }

  if (!isBorder) {
    return false;
  }

  const sides: Position[] = [];

  if (dir == "up" || dir == "down") {
    sides.push({ i: pos.i, j: pos.j + 1 });
    sides.push({ i: pos.i, j: pos.j - 1 });
  } else if (dir == "left" || dir == "right") {
    sides.push({ i: pos.i - 1, j: pos.j });
    sides.push({ i: pos.i + 1, j: pos.j });
  }

  sides.forEach((side) => {
    try {
      if (farm[side.i][side.j] === symbol) {
        isWall(side, symbol, dir);
      }
    } catch {}
  });

  return true;
}

function countWalls(position: Position, symbol: string) {
  let walls = 0;

  if (isWall(position, symbol, "up")) {
    walls++;
  }

  if (isWall(position, symbol, "down")) {
    walls++;
  }

  if (isWall(position, symbol, "left")) {
    walls++;
  }

  if (isWall(position, symbol, "right")) {
    walls++;
  }

  return walls;
}

interface Region {
  positions: Position[];
  type: string;
  walls: number;
  area: number;
  perimeter: number;
  price: number;
}
const regions: Region[] = [];

for (let i = 0; i < farm.length; i++) {
  for (let j = 0; j < farm[i].length; j++) {
    const symbol = farm[i][j];
    const position: Position = { i, j };

    if (visited.has(`${i},${j}`)) {
      continue;
    }

    const { positions, perimeter } = checkNeighbors(position);

    const area = positions.length;
    const walls = positions.reduce(
      (acc, position) => (acc += countWalls(position, symbol)),
      0
    );

    regions.push({
      type: symbol,
      positions,
      walls,
      area,
      perimeter,
      price: area * walls,
    });
  }
}

const total = regions.reduce((acc, region) => (acc += region.price), 0);
console.log(total);
