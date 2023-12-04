const input = await Deno.readTextFile("./test.txt");
const lines = input.split("\r\n");

const heatMap: number[][] = [];

let startPosition = { row: -1, col: -1 };
let bestElevationPosition = { row: -1, col: -1 };

for (let row = 0; row < lines.length; row++) {
  for (let col = 0; col < lines[row].length; col++) {
    if (!heatMap[row]) {
      heatMap[row] = [];
    }

    if (lines[row][col] === "S") {
      startPosition = { row, col };
      heatMap[row][col] = 0;
      continue;
    }

    if (lines[row][col] === "E") {
      bestElevationPosition = { row, col };
      heatMap[row][col] = 26;
      continue;
    }

    heatMap[row][col] = lines[row][col].charCodeAt(0) - 96;
  }
}

console.log(heatMap.map((x) => x.join(" ")).join("\n"));

const directionMap = Array(heatMap.length)
  .fill(1)
  .map(() => Array(heatMap[0].length).fill("."));

let counter = 0;
let min = Infinity;
function calculateLowestPath(
  row: number,
  col: number,
  sum: number,
  visited: string[] = []
) {
  if (row === bestElevationPosition.row && col === bestElevationPosition.col) {
    return sum;
  }

  if (
    (directionMap?.[row]?.[col] && directionMap[row][col] !== ".") ||
    visited.includes(`${row},${col}`)
  ) {
    return Infinity;
  }

  const current = heatMap[row][col];

  // Check if the next position is higher than the current position and if so, return infinity
  if (current > heatMap[startPosition.row][startPosition.col]) {
    return Infinity;
  }

  // if (current === undefined) {
  //   return Infinity;
  // }

  sum += 1;
  visited.push(`${row},${col}`);

  console.log(visited);

  console.log(directionMap.map((x) => x.join("")).join("\n"));
  console.log();

  const validPositions = [];

  if (current <= heatMap[row]?.[col - 1] + 1) {
    validPositions.push(calculateLowestPath(row, col - 1, sum, visited));
  }

  if (current <= heatMap[row]?.[col + 1] + 1) {
    validPositions.push(calculateLowestPath(row, col + 1, sum, visited));
  }

  if (current <= heatMap[row - 1]?.[col] + 1) {
    validPositions.push(calculateLowestPath(row - 1, col, sum, visited));
  }

  if (current <= heatMap[row + 1]?.[col] + 1) {
    validPositions.push(calculateLowestPath(row + 1, col, sum, visited));
  }

  const smallest = Math.min(...validPositions);

  if (upSum === smallest) {
    directionMap[row][col] = "^";
    row -= 1;
  } else if (downSum === smallest) {
    directionMap[row][col] = "v";
    row += 1;
  } else if (leftSum === smallest) {
    directionMap[row][col] = "<";
    col -= 1;
  } else if (rightSum === smallest) {
    directionMap[row][col] = ">";
    col += 1;
  }

  console.log(directionMap.map((x) => x.join("")).join("\n"));
  console.log();

  return sum;
}

min = calculateLowestPath(startPosition.row, startPosition.col, 0);

console.log(directionMap.map((x) => x.join("")).join("\n"));
console.log();

console.log("Finished:", counter);
