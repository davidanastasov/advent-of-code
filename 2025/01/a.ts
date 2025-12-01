const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\n").map((l) => l.trim());

const moves = lines.map((line) => {
  const direction = line[0] as "L" | "R";
  const distance = Number(line.slice(1));

  return { direction, distance };
});

let current = 50;
let counter_zero = 0;

for (const { direction, distance } of moves) {
  if (direction === "L") {
    current = (current - distance) % 100;
    if (current < 0) current = 100 - Math.abs(current);
  } else {
    current = (current + distance) % 100;
  }

  if (current === 0) counter_zero++;
}

console.log(counter_zero);
