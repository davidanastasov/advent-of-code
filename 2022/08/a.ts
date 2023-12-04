const input = await Deno.readTextFile("./input.txt");

const treeGrid = input.split("\r\n").map((row) => row.split(""));
const columns = treeGrid[0].length;
const rows = treeGrid.length;

let innerVisibleTreesCount = 0;

for (let i = 1; i < rows - 1; i++) {
  for (let j = 1; j < columns - 1; j++) {
    const currentTree = treeGrid[i][j];

    let isVisibleTop = true;
    let isVisibleBottom = true;
    let isVisibleLeft = true;
    let isVisibleRight = true;

    // Top
    for (let k = i - 1; k >= 0; k--) {
      if (currentTree <= treeGrid[k][j]) isVisibleTop = false;
    }

    // Bottom
    for (let k = i + 1; k < rows; k++) {
      if (currentTree <= treeGrid[k][j]) isVisibleBottom = false;
    }

    // Left
    for (let k = j - 1; k >= 0; k--) {
      if (currentTree <= treeGrid[i][k]) isVisibleLeft = false;
    }

    // Right
    for (let k = j + 1; k < rows; k++) {
      if (currentTree <= treeGrid[i][k]) isVisibleRight = false;
    }

    if (isVisibleTop || isVisibleBottom || isVisibleLeft || isVisibleRight) {
      innerVisibleTreesCount++;
    }
  }
}

const edgeTreeCount = columns * 2 + (rows - 2) * 2;
console.log(edgeTreeCount + innerVisibleTreesCount);
