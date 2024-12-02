const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\r\n");

const levels: number[][] = [];

lines.forEach((line) => {
  const level = line.split(" ").map((x) => Number(x));
  levels.push(level);
});

const valid = [];

levels.forEach((level) => {
  let isValid = checkLevel(level);

  if (!isValid) {
    for (let i = 0; i < level.length; i++) {
      isValid = checkLevel(level.filter((_, index) => index !== i));
      if (isValid) break;
    }
  }

  if (isValid) {
    valid.push(level);
  }
});

console.log(valid.length);

function checkLevel(level: number[]) {
  let isValid = true;
  const increasing = level[0] < level[1];

  for (let j = 0; j < level.length - 1; j++) {
    const diff = Math.abs(level[j] - level[j + 1]);
    isValid = diff >= 1 && diff <= 3;

    if (increasing && level[j] > level[j + 1]) {
      isValid = false;
    } else if (!increasing && level[j] < level[j + 1]) {
      isValid = false;
    }

    if (!isValid) break;
  }

  return isValid;
}
