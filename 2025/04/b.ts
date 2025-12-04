const input = await Deno.readTextFile("./input.txt");
const grid = input
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const Characters = {
  Empty: ".",
  Roll: "@",
};

function removeAccessibleRolls(): number {
  const neighborPositions = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== Characters.Roll) continue;

      let neighbors = 0;

      for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
          const neighborCol = col + deltaCol;
          const neighborRow = row + deltaRow;

          if (deltaCol === 0 && deltaRow === 0) continue;
          if (
            neighborCol < 0 ||
            neighborCol >= grid[row].length ||
            neighborRow < 0 ||
            neighborRow >= grid.length
          )
            continue;

          if (grid[neighborRow][neighborCol] === Characters.Roll) neighbors++;
        }
      }

      if (neighbors < 4) {
        neighborPositions.push({ row, col });
      }
    }
  }

  neighborPositions.forEach((pos) => {
    grid[pos.row][pos.col] = Characters.Empty;
  });

  return neighborPositions.length;
}

let totalAccessibleCount = 0;

while (true) {
  const removedCount = removeAccessibleRolls();
  if (removedCount === 0) break;

  totalAccessibleCount += removedCount;
}

console.log(totalAccessibleCount);
