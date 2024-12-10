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

function checkNeighbors(i: number, j: number) {
  const height = grid[i][j];

  const reachedPeaks: Location[] = [];

  // Top
  try {
    if (grid[i - 1][j] - height === 1) {
      if (grid[i - 1][j] === 9) {
        reachedPeaks.push({ i: i - 1, j });
      } else {
        const reached = checkNeighbors(i - 1, j);
        reachedPeaks.push(...reached);
      }
    }
  } catch {}

  // Right
  try {
    if (grid[i][j + 1] - height === 1) {
      if (grid[i][j + 1] === 9) {
        reachedPeaks.push({ i, j: j + 1 });
      } else {
        const reached = checkNeighbors(i, j + 1);
        reachedPeaks.push(...reached);
      }
    }
  } catch {}

  // Bottom
  try {
    if (grid[i + 1][j] - height === 1) {
      if (grid[i + 1][j] === 9) {
        reachedPeaks.push({ i: i + 1, j });
      } else {
        const reached = checkNeighbors(i + 1, j);
        reachedPeaks.push(...reached);
      }
    }
  } catch {}

  // Left
  try {
    if (grid[i][j - 1] - height === 1) {
      if (grid[i][j - 1] === 9) {
        reachedPeaks.push({ i, j: j - 1 });
      } else {
        const reached = checkNeighbors(i, j - 1);
        reachedPeaks.push(...reached);
      }
    }
  } catch {}

  return reachedPeaks;
}

let sum = 0;

trailHeads.forEach((trailHead) => {
  const reached = checkNeighbors(trailHead.i, trailHead.j);

  const unique = new Set();

  reached.forEach((location) => {
    unique.add(`${location.i},${location.j}`);
  });

  sum += unique.size;
});

console.log(sum);
