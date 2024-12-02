const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\r\n");

const levels: number[][] = [];

lines.forEach((line) => {
  const level = line.split(" ").map((x) => Number(x));
  levels.push(level);
});

const valid = [];

levels.forEach((level) => {
  let isValid = true;
  const increasing = level[0] < level[1];

  for (let i = 0; i < level.length - 1; i++) {
    const diff = Math.abs(level[i] - level[i + 1]);
    isValid = diff >= 1 && diff <= 3;

    if (increasing && level[i] > level[i + 1]) {
      isValid = false;
    } else if (!increasing && level[i] < level[i + 1]) {
      isValid = false;
    }

    if (!isValid) break;
  }

  if (isValid) {
    valid.push(level);
  }
});

console.log(valid.length);
