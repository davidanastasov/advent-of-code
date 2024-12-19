const input = await Deno.readTextFile("./input.txt");
const parts = input.split("\r\n\r\n");

const towels = parts[0].trim().split(", ");
const towelsSet = new Set(towels);
const maxTowelLength = Math.max(...towels.map((towel) => towel.length));

const designs = parts[1].trim().split("\r\n");

const partialCounts = new Map<string, number>();

function countTowelCombinations(design: string): number {
  if (design.length === 0) return 1;

  if (partialCounts.has(design)) {
    return partialCounts.get(design)!;
  }

  let count = 0;

  const checked = new Set<string>();

  for (let j = 1; j <= maxTowelLength; j++) {
    const partial = design.substring(0, j);

    if (checked.has(partial)) {
      continue;
    }

    checked.add(partial);

    if (towelsSet.has(partial)) {
      count += countTowelCombinations(design.substring(j));
    }
  }

  partialCounts.set(design, count);

  return count;
}

const counts = designs.map((d) => countTowelCombinations(d));
const sum = counts.reduce((acc, count) => acc + count, 0);

console.log(sum);
