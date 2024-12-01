const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\r\n");

const left: number[] = [];
const right: number[] = [];

lines.forEach((line) => {
  const f = line.split("   ")[0];
  const s = line.split("   ")[1];

  left.push(Number(f));
  right.push(Number(s));
});

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

const similarities: Record<number, number> = {};

left.forEach((n) => {
  const times = right.filter((r) => r === n).length;
  if (n in similarities) {
    similarities[n] += times;
  } else {
    similarities[n] = times;
  }
});

const sum = Object.entries(similarities).reduce((acc, [key, value]) => {
  return acc + key * value;
}, 0);

console.log(sum);
