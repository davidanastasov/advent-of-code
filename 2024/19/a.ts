const input = await Deno.readTextFile("./input.txt");
const parts = input.split("\r\n\r\n");

const towels = parts[0].trim().split(", ");
const towelsSet = new Set(towels);
const maxTowelLength = Math.max(...towels.map((towel) => towel.length));

const designs = parts[1].trim().split("\r\n");

function isDesignPossible(design: string) {
  if (design.length === 0) return true;

  for (let j = 1; j <= maxTowelLength; j++) {
    const partial = design.substring(0, j);

    if (towelsSet.has(partial) && isDesignPossible(design.substring(j))) {
      return true;
    }
  }

  return false;
}

const matching = designs.filter(isDesignPossible);

console.log(matching.length);
