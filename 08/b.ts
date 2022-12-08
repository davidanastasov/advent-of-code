const input = await Deno.readTextFile("./input.txt");

const treeGrid = input.split("\r\n").map((row) => row.split(""));
const columns = treeGrid[0].length;
const rows = treeGrid.length;

let maxTotalViewDistance = 0;

for (let i = 1; i < rows - 1; i++) {
  for (let j = 1; j < columns - 1; j++) {
    const currentTree = treeGrid[i][j];

    let viewDistanceTop = 0;
    let viewDistanceBottom = 0;
    let viewDistanceLeft = 0;
    let viewDistanceRight = 0;

    // Top
    for (let k = i - 1; k >= 0; k--) {
      viewDistanceTop += 1;
      if (currentTree <= treeGrid[k][j]) break;
    }

    // Bottom
    for (let k = i + 1; k < rows; k++) {
      viewDistanceBottom += 1;
      if (currentTree <= treeGrid[k][j]) break;
    }

    // Left
    for (let k = j - 1; k >= 0; k--) {
      viewDistanceLeft += 1;
      if (currentTree <= treeGrid[i][k]) break;
    }

    // Right
    for (let k = j + 1; k < rows; k++) {
      viewDistanceRight += 1;
      if (currentTree <= treeGrid[i][k]) break;
    }

    const totalViewDistance =
      viewDistanceTop *
      viewDistanceBottom *
      viewDistanceLeft *
      viewDistanceRight;

    if (totalViewDistance > maxTotalViewDistance) {
      maxTotalViewDistance = totalViewDistance;
    }
  }
}

console.log(maxTotalViewDistance);
