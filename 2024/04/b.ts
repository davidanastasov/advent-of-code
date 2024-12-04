const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\n");

const letterGrid: string[][] = [];

lines.forEach((line) => {
  letterGrid.push(line.split(""));
});

let count = 0;

const word = "MAS";

for (let i = 0; i < letterGrid.length; i++) {
  for (let j = 0; j < letterGrid[i].length; j++) {
    const ul = checkDiagonalUpLeft(i, j);
    const ur = checkDiagonalUpRight(i, j);
    const dl = checkDiagonalDownLeft(i, j);
    const dr = checkDiagonalDownRight(i, j);

    if (ul) {
      if (checkDiagonalDownLeft(i - 2, j) || checkDiagonalUpRight(i, j - 2)) {
        count += 1;
      }
    }

    if (ur) {
      if (checkDiagonalDownRight(i - 2, j) || checkDiagonalUpLeft(i, j + 2)) {
        count += 1;
      }
    }

    if (dl) {
      if (checkDiagonalUpLeft(i + 2, j) || checkDiagonalDownRight(i, j - 2)) {
        count += 1;
      }
    }

    if (dr) {
      if (checkDiagonalUpRight(i + 2, j) || checkDiagonalDownLeft(i, j + 2)) {
        count += 1;
      }
    }
  }
}

function checkDiagonalUpLeft(i: number, j: number) {
  if (i - 2 < 0 || j - 2 < 0) {
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
  if (i - 2 < 0 || j + 2 >= letterGrid[i].length) {
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
  if (i + 2 >= letterGrid.length || j - 2 < 0) {
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
  if (i + 2 >= letterGrid.length || j + 2 >= letterGrid[i].length) {
    return false;
  }

  for (let k = 0; k < word.length; k++) {
    if (letterGrid[i + k][j + k] != word[k]) {
      return false;
    }
  }

  return true;
}

console.log(count / 2);
