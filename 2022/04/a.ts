const input = await Deno.readTextFile("./input.txt");

const pairs = input.split("\r\n");

const parseElfRange = (range: string) => {
  const [start, end] = range.split("-").map((n) => parseInt(n));
  return { start, end };
};

let fullyOverlappingCounter = 0;
pairs.forEach((pair) => {
  const elves = pair.split(",");
  const firstElf = parseElfRange(elves[0]);
  const secondElf = parseElfRange(elves[1]);

  if (firstElf.start <= secondElf.start && firstElf.end >= secondElf.end) {
    fullyOverlappingCounter++;
  } else if (
    secondElf.start <= firstElf.start &&
    secondElf.end >= firstElf.end
  ) {
    fullyOverlappingCounter++;
  }
});

console.log(fullyOverlappingCounter);
