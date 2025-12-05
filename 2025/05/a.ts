const input = await Deno.readTextFile("./input.txt");
const sections = input.trim().split("\n\n");

const ranges = sections[0].split("\n").map((range) => {
  const [start, end] = range.split("-");
  return { start: Number(start), end: Number(end) };
});
const ids = sections[1].split("\n").map(Number);

let freshCount = 0;

for (const id of ids) {
  for (const range of ranges) {
    if (id >= range.start && id <= range.end) {
      freshCount++;
      break;
    }
  }
}

console.log(freshCount);
