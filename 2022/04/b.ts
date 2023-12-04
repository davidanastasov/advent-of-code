const input = await Deno.readTextFile("./input.txt");

const pairs = input.split("\r\n");

const parseElfRange = (range: string) => {
  const [start, end] = range.split("-").map((n) => parseInt(n));
  return { start, end };
};

let overlapCounter = 0;
pairs.forEach((pair) => {
  const elves = pair.split(",");
  const firstElf = parseElfRange(elves[0]);
  const secondElf = parseElfRange(elves[1]);

  if (firstElf.start <= secondElf.end && firstElf.end >= secondElf.start) {
    overlapCounter++;
  } else if (secondElf.start <= firstElf.end && secondElf.end >= firstElf.start) {
    overlapCounter++;
  }
});

console.log(overlapCounter);
