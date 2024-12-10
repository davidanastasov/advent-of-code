const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\r\n");
const grid = lines.map((line) => line.split("").map((c) => Number(c)));

type Location = { i: number; j: number };

const trailHeads: Location[] = [];
const destinations: Location[] = [];

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (grid[i][j] === 0) {
      trailHeads.push({ i, j });
    } else if (grid[i][j] === 9) {
      destinations.push({ i, j });
    }
  }
}

function calculateRank(i: number, j: number, height: number) {
  const paths: Location[][] = [];

  if (grid[i][j] - height === 1) {
    const path = [{ i: i, j }];

    if (grid[i][j] === 9) {
      paths.push(path);
    } else {
      const subPaths = checkNeighbors(i, j);

      subPaths.forEach((subPath) => {
        paths.push([...path, ...subPath]);
      });
    }
  }

  return paths;
}

function checkNeighbors(i: number, j: number) {
  const height = grid[i][j];

  const paths: Location[][] = [];

  // Top
  try {
    const pathsRank = calculateRank(i - 1, j, height);
    paths.push(...pathsRank);
  } catch {}

  // Right
  try {
    const pathsRank = calculateRank(i, j + 1, height);
    paths.push(...pathsRank);
  } catch {}

  // Bottom
  try {
    const pathsRank = calculateRank(i + 1, j, height);
    paths.push(...pathsRank);
  } catch {}

  // Left
  try {
    const pathsRank = calculateRank(i, j - 1, height);
    paths.push(...pathsRank);
  } catch {}

  return paths;
}

let sum = 0;

trailHeads.forEach((trailHead) => {
  const paths = checkNeighbors(trailHead.i, trailHead.j);

  const unique = new Set();

  paths
    .map((path) =>
      path.map((location) => `${location.i},${location.j}`).join(" ")
    )
    .forEach((l) => {
      unique.add(l);
    });

  sum += unique.size;
});

console.log(sum);
