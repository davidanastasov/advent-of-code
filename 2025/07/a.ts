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

function countSplitsBFS(start: Position) {
  let counterSplit = 0;
  const queue = [start];

  while (queue.length !== 0) {
    const position = queue.shift()!;

    if (position.row + 1 >= grid.length) continue;

    const nextPositions = getNextPositions(position);
    nextPositions.forEach((next) => {
      queue.push(next);
      grid[next.row][next.col] = Characters.Beam;
    });

    if (nextPositions.length === 2) counterSplit++;
  }

  return counterSplit;
}

const splitCount = countSplitsBFS(startPosition);
console.log(splitCount);
