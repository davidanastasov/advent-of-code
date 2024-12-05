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

// console.log(rules);

const fixedPages: number[][] = [];

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

  if (!isValid) {
    // If not valid fix them

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];

      //   console.log(numbers, "Working on number", num);
      const validNumbers = numbers.filter((n) => rules[num]?.has(n));
      //   console.log(validNumbers);

      let newPos = i;
      for (let j = 0; j < numbers.length; j++) {
        if (validNumbers.includes(numbers[j]) && j > i) {
          newPos = j;
        }
      }

      if (i != newPos) {
        // console.log("Flipping", numbers[i], numbers[newPos]);

        const temp = numbers[i];
        numbers[i] = numbers[newPos];
        numbers[newPos] = temp;

        // console.log("After fix", numbers);

        i = -1;
      }
    }

    fixedPages.push(numbers);
  }
});

const offending = fixedPages.filter((page) => {
  // A dependency is not before the number
  return page.some((num, idx) => {
    const r = rules[num] || [];
    const includedNums = page.filter((n) => r.has(n));
    const indexes = includedNums.map((n) => page.indexOf(n));
    return indexes.some((i) => i > idx);
  });
});

console.log("Offending", offending.length);

const middles = fixedPages.map((page) => {
  return page[Math.floor(page.length / 2)];
});

const sum = middles.reduce((acc, curr) => acc + curr, 0);
console.log(sum);
