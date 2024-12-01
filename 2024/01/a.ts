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

let sum = 0;
for (let i = 0; i < left.length; i++) {
  sum += Math.abs(left[i] - right[i]);
}

console.log(sum);
