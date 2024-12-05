const input = await Deno.readTextFile("./input.txt");

const parts = input.split("\r\n\r\n");
const rulesPart = parts[0].split("\r\n");
const pagesPart = parts[1].split("\r\n");

const rules: Record<number, Set<number>> = {};

rulesPart.forEach((rule) => {
  const dep = Number(rule.split("|")[0]);
  const num = Number(rule.split("|")[1]);

  if (!(num in rules)) {
    rules[num] = new Set();
  }

  rules[num].add(dep);
});

const correctPages: number[][] = [];

pagesPart.forEach((page) => {
  const numbers = page.split(",").map(Number);
  let isValid = true;

  const printed = new Set();
  numbers.forEach((num) => {
    if (rules[num]) {
      rules[num].forEach((dep) => {
        if (numbers.includes(dep)) {
          isValid = isValid && printed.has(dep);
        }
      });
    }

    if (isValid) printed.add(num);
  });

  if (isValid) {
    correctPages.push(numbers);
  }
});

const middles = correctPages.map((page) => {
  return page[Math.floor(page.length / 2)];
});

const sum = middles.reduce((acc, curr) => acc + curr, 0);
console.log(sum);
