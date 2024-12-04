const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\n");

const letterGrid: string[][] = [];

lines.forEach((line) => {
  letterGrid.push(line.split(""));
});

let count = 0;

const word = "XMAS";

for (let i = 0; i < letterGrid.length; i++) {
  for (let j = 0; j < letterGrid[i].length; j++) {
    const forward = checkForward(i, j);
    const backward = checkBackward(i, j);
    const down = checkDownward(i, j);
    const up = checkUpward(i, j);
    const ul = checkDiagonalUpLeft(i, j);
    const ur = checkDiagonalUpRight(i, j);
    const dl = checkDiagonalDownLeft(i, j);
    const dr = checkDiagonalDownRight(i, j);

    if (forward) count += 1;
    if (backward) count += 1;
    if (down) count += 1;
    if (up) count += 1;
    if (ul) count += 1;
    if (ur) count += 1;
    if (dl) count += 1;
    if (dr) count += 1;
  }
}

function checkForward(i: number, j: number) {
  if (j + 3 >= letterGrid[i].length) {
    return false;
  }

  return (
    letterGrid[i][j] == "X" &&
    letterGrid[i][j + 1] == "M" &&
    letterGrid[i][j + 2] == "A" &&
    letterGrid[i][j + 3] == "S"
  );
}

function checkBackward(i: number, j: number) {
  if (j - 3 < 0) {
    return false;
  }

  return (
    letterGrid[i][j] == "X" &&
    letterGrid[i][j - 1] == "M" &&
    letterGrid[i][j - 2] == "A" &&
    letterGrid[i][j - 3] == "S"
  );
}

function checkUpward(i: number, j: number) {
  if (i - 3 < 0) {
    return false;
  }

  return (
    letterGrid[i][j] == "X" &&
    letterGrid[i - 1][j] == "M" &&
    letterGrid[i - 2][j] == "A" &&
    letterGrid[i - 3][j] == "S"
  );
}

function checkDownward(i: number, j: number) {
  if (i + 3 >= letterGrid.length) {
    return false;
  }

  return (
    letterGrid[i][j] == "X" &&
    letterGrid[i + 1][j] == "M" &&
    letterGrid[i + 2][j] == "A" &&
    letterGrid[i + 3][j] == "S"
  );
}

function checkDiagonalUpLeft(i: number, j: number) {
  if (i - 3 < 0 || j - 3 < 0) {
    return false;
  }

  for (let k = 0; k < word.length; k++) {
    if (letterGrid[i - k][j - k] != word[k]) {
      return false;
    }
  }

  return true;
}

function checkDiagonalUpRight(i: number, j: number) {
  if (i - 3 < 0 || j + 3 >= letterGrid[i].length) {
    return false;
  }

  for (let k = 0; k < word.length; k++) {
    if (letterGrid[i - k][j + k] != word[k]) {
      return false;
    }
  }

  return true;
}

function checkDiagonalDownLeft(i: number, j: number) {
  if (i + 3 >= letterGrid.length || j - 3 < 0) {
    return false;
  }

  for (let k = 0; k < word.length; k++) {
    if (letterGrid[i + k][j - k] != word[k]) {
      return false;
    }
  }

  return true;
}

function checkDiagonalDownRight(i: number, j: number) {
  if (i + 3 >= letterGrid.length || j + 3 >= letterGrid[i].length) {
    return false;
  }

  for (let k = 0; k < word.length; k++) {
    if (letterGrid[i + k][j + k] != word[k]) {
      return false;
    }
  }

  return true;
}

console.log(count);
