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

function countSplitsBFS(start: Position) {
  let counterSplit = 0;
  const queue = [start];

  while (queue.length !== 0) {
    const position = queue.shift()!;

    if (position.row + 1 >= grid.length) continue;

    const nextSpot = grid[position.row + 1][position.col];
    if (nextSpot === Characters.Empty) {
      queue.push({ row: position.row + 1, col: position.col });
      grid[position.row + 1][position.col] = Characters.Beam;
    } else if (nextSpot === Characters.Splitter) {
      queue.push({ row: position.row + 1, col: position.col - 1 });
      queue.push({ row: position.row + 1, col: position.col + 1 });

      grid[position.row + 1][position.col - 1] = Characters.Beam;
      grid[position.row + 1][position.col + 1] = Characters.Beam;

      counterSplit++;
    }
  }

  return counterSplit;
}

const splitCount = countSplitsBFS(startPosition);
console.log(splitCount);
