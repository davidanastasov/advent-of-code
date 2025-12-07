const input = await Deno.readTextFile("./input.txt");
const grid = input.split("\n").map((line) => line.split(""));

const Characters = {
  StartPoint: "S",
  Empty: ".",
  Splitter: "^",
  Beam: "|",
};

type Position = { row: number; col: number };
const startPosition: Position = {
  row: 0,
  col: grid[0].findIndex((e) => e === Characters.StartPoint),
};

function getNextPositions(position: Position): Position[] {
  const nextPositions: Position[] = [];
  const current = grid[position.row + 1][position.col];

  if (current === Characters.Empty) {
    nextPositions.push({ row: position.row + 1, col: position.col });
  } else if (current === Characters.Splitter) {
    nextPositions.push({ row: position.row + 1, col: position.col - 1 });
    nextPositions.push({ row: position.row + 1, col: position.col + 1 });
  }

  return nextPositions;
}

const cache = new Map<string, number>();

function countPathsDFS(start: Position) {
  if (cache.has(`${start.row}-${start.col}`)) {
    return cache.get(`${start.row}-${start.col}`)!;
  }

  if (start.row + 1 >= grid.length) {
    return 0;
  }

  let pathsCount = 0;

  const nextPositions = getNextPositions(start);
  nextPositions.forEach((next) => {
    const newPathsCount = countPathsDFS(next);
    pathsCount += Math.max(1, newPathsCount);
  });

  cache.set(`${start.row}-${start.col}`, pathsCount);

  return pathsCount;
}

const pathsCount = countPathsDFS(startPosition);
console.log(pathsCount);
