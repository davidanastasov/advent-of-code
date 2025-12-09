const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\n");

type Point = { X: number; Y: number };
const tiles: Point[] = lines.map((line) => {
  const [x, y] = line.split(",");
  return { X: Number(x), Y: Number(y) };
});

const tilesByX: Record<number, number[]> = {};
const tilesByY: Record<number, number[]> = {};

tiles.sort((a, b) => a.X - b.X || a.Y - b.Y);
for (const tile of tiles) {
  tilesByX[tile.X] ??= [];
  tilesByX[tile.X].push(tile.Y);
}

tiles.sort((a, b) => a.Y - b.Y || a.X - b.X);
for (const tile of tiles) {
  tilesByY[tile.Y] ??= [];
  tilesByY[tile.Y].push(tile.X);
}

const fenceTiles = tiles.slice();

for (const [X, bounds] of Object.entries(tilesByX)) {
  for (let y = bounds[0]; y <= bounds[1]; y++) {
    fenceTiles.push({ X: Number(X), Y: y });
  }
}

for (const [Y, bounds] of Object.entries(tilesByY)) {
  for (let x = bounds[0]; x <= bounds[1]; x++) {
    fenceTiles.push({ X: x, Y: Number(Y) });
  }
}

function calculateArea(point1: Point, point2: Point) {
  const dx = Math.abs(point1.X - point2.X) + 1;
  const dy = Math.abs(point1.Y - point2.Y) + 1;
  return dx * dy;
}

type Rectangle = {
  topLeft: Point;
  bottomRight: Point;
  area: number;
};
const rectangles: Rectangle[] = [];

for (let i = 0; i < tiles.length; i++) {
  for (let j = i + 1; j < tiles.length; j++) {
    if (i == j) continue;

    const p1 = tiles[i];
    const p2 = tiles[j];

    const topLeft = { X: Math.min(p1.X, p2.X), Y: Math.min(p1.Y, p2.Y) };
    const bottomRight = { X: Math.max(p1.X, p2.X), Y: Math.max(p1.Y, p2.Y) };
    const area = calculateArea(p1, p2);

    rectangles.push({ topLeft, bottomRight, area });
  }
}

function intersects(rectangle: Rectangle, point: Point) {
  return (
    point.X > rectangle.topLeft.X &&
    point.X < rectangle.bottomRight.X &&
    point.Y > rectangle.topLeft.Y &&
    point.Y < rectangle.bottomRight.Y
  );
}

rectangles.sort((a, b) => b.area - a.area);

let maxArea = 0;

for (const rectangle of rectangles) {
  let isIntersecting = false;

  for (const tile of fenceTiles) {
    if (intersects(rectangle, tile)) {
      isIntersecting = true;
      break;
    }
  }

  if (!isIntersecting) {
    maxArea = rectangle.area;
    break;
  }
}

console.log(maxArea);
