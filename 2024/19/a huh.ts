const input = await Deno.readTextFile("./input.txt");
const parts = input.split("\r\n\r\n");

const towels = parts[0]
  .trim()
  .split(", ")
  .sort((a, b) => b.length - a.length);

const designs = parts[1].trim().split("\r\n");

let valid = 0;

for (let design of designs) {
  for (const towel of towels) {
    design = design.replaceAll(towel, "");

    if (design.length === 0) {
      valid++;
      break;
    }
  }
}

console.log(valid);
