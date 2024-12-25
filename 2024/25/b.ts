const input = await Deno.readTextFile("./input.txt");

const MAX_HEIGHT = 5;

type Type = "key" | "lock";

const locks: number[][] = [];
const keys: number[][] = [];

input.split("\r\n\r\n").map((part) => {
  const grid: string[][] = [];

  part.split("\r\n").map((line) => {
    grid.push(line.split(""));
  });

  let isLock = true;
  let isKey = true;
  for (let j = 0; j < grid[0].length; j++) {
    if (grid[0][j] !== "#") {
      isLock = false;
    }

    if (grid[0][j] !== ".") {
      isKey = false;
    }
  }

  const type: Type | null = isLock ? "lock" : isKey ? "key" : null;

  if (type === null) {
    throw new Error("Invalid schematic");
  }

  const heights: number[] = [];

  for (let j = 0; j < grid[0].length; j++) {
    let height = 0;

    if (type === "lock") {
      for (let i = 1; i < grid.length; i++) {
        if (grid[i][j] === "#") {
          height++;
        }
      }
    } else {
      for (let i = grid.length - 2; i > 0; i--) {
        if (grid[i][j] === "#") {
          height++;
        }
      }
    }

    heights.push(height);
  }

  if (type === "lock") {
    locks.push(heights);
  } else {
    keys.push(heights);
  }
});

const result = new Set<string>();

for (let i = 0; i < locks.length; i++) {
  for (let j = 0; j < keys.length; j++) {
    const lock = locks[i];
    const key = keys[j];

    let matches = true;
    for (let k = 0; k < lock.length; k++) {
      if (lock[k] + key[k] > MAX_HEIGHT) {
        matches = false;
        break;
      }
    }

    if (matches) {
      result.add(`${lock.join("")}-${key.join("")}`);
    }
  }
}

console.log(result.size);
