const input = await Deno.readTextFile("./input.txt");
const sections = input.trim().split("\n\n");

const ranges = sections[0].split("\n").map((range) => {
  const [start, end] = range.split("-");
  return { start: Number(start), end: Number(end) };
});

ranges.sort((a, b) => Number(a.start - b.start));

for (let i = 0; i < ranges.length; i++) {
  let current = i + 1;

  while (current < ranges.length) {
    if (ranges[current].start <= ranges[i].end) {
      ranges[i].end = Math.max(ranges[i].end, ranges[current].end);
      ranges.splice(current, 1);
    } else {
      current++;
    }
  }
}

const counts = ranges.map(({ start, end }) => end - start + 1);
const sum = counts.reduce((acc, curr) => (acc += curr), 0);

console.log(sum.toString());
