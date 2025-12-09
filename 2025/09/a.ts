const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\n");

type Point = { X: number; Y: number };
const tiles: Point[] = lines.map((line) => {
  const [x, y] = line.split(",");
  return { X: Number(x), Y: Number(y) };
});

function calculateArea(point1: Point, point2: Point) {
  const dx = Math.abs(point1.X - point2.X) + 1;
  const dy = Math.abs(point1.Y - point2.Y) + 1;
  return dx * dy;
}

type Pair = { point1: Point; point2: Point; area: number };
const pairs: Pair[] = [];

for (let i = 0; i < tiles.length; i++) {
  for (let j = i + 1; j < tiles.length; j++) {
    if (i == j) continue;

    const point1 = tiles[i];
    const point2 = tiles[j];
    const area = calculateArea(point1, point2);

    pairs.push({ point1, point2, area });
  }
}

pairs.sort((a, b) => b.area - a.area);

console.log(pairs[0].area);
