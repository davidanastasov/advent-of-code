const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\r\n");

const farm = lines.map((line) => line.split(""));

type Position = { i: number; j: number };

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

interface Region {
  positions: Position[];
  type: string;
  area: number;
  perimeter: number;
  price: number;
}
const regions: Region[] = [];

for (let i = 0; i < farm.length; i++) {
  for (let j = 0; j < farm[i].length; j++) {
    const position: Position = { i, j };

    if (visited.has(`${i},${j}`)) {
      continue;
    }

    const { positions, perimeter } = checkNeighbors(position);

    const area = positions.length;

    regions.push({
      type: farm[i][j],
      positions,
      area,
      perimeter,
      price: area * perimeter,
    });
  }
}

const total = regions.reduce((acc, region) => (acc += region.price), 0);
console.log(total);
