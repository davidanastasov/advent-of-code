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

const cache = new Map<string, number>();

function countPathsDFS(start: Position) {
  if (cache.has(`${start.row}-${start.col}`)) {
    return cache.get(`${start.row}-${start.col}`)!;
  }

  if (start.row + 1 >= grid.length) {
    return 0;
  }

  let pathsCount = 0;
  const directions: Position[] = [];

  if (grid[start.row + 1][start.col] === Characters.Empty) {
    directions.push({ row: 1, col: 0 });
  } else if (grid[start.row + 1][start.col] === Characters.Splitter) {
    directions.push({ row: 1, col: -1 });
    directions.push({ row: 1, col: 1 });
  }

  directions.forEach((dir) => {
    const newPos: Position = {
      row: start.row + dir.row,
      col: start.col + dir.col,
    };

    const newPathsCount = countPathsDFS(newPos);
    pathsCount += Math.max(1, newPathsCount);
  });

  cache.set(`${start.row}-${start.col}`, pathsCount);

  return pathsCount;
}

const pathsCount = countPathsDFS(startPosition);
console.log(pathsCount);
