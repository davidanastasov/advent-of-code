const input = await Deno.readTextFile("./input.txt");

const equations = input.split("\r\n");

const operators = ["+", "*", "||"];

function generatePermutations(operators: string[], level: number) {
  if (level == 0) {
    return [];
  }

  const all: string[][] = [];

  operators.forEach((operator) => {
    const operatorPermutations: string[][] = [];
    const permutations = generatePermutations(operators, level - 1);

    if (permutations?.length == 0) {
      operatorPermutations.push([operator]);
    }

    permutations?.forEach((permutation) => {
      operatorPermutations.push([operator, ...permutation]);
    });

    all.push(...operatorPermutations);
  });

  return all;
}

const possible: Record<number, number> = {};
const cache: Record<number, string[][]> = {};

equations.forEach((equation, i) => {
  const result = Number(equation.split(": ")[0]);
  const numbers = equation.split(": ")[1].split(" ").map(Number);

  let possible_permutations = cache[numbers.length];

  if (!possible_permutations) {
    possible_permutations = generatePermutations(operators, numbers.length - 1);
    cache[numbers.length] = possible_permutations;
  }

  possible_permutations.forEach((permutation) => {
    const calculated = numbers.reduce((acc, num, index) => {
      const operation = permutation[index - 1];

      if (operation === "+") {
        acc += num;
      } else if (operation === "*") {
        acc *= num;
      } else {
        acc = Number(acc.toString() + num.toString());
      }

      return acc;
    });

    if (calculated == result) {
      possible[i] = result;
    }
  });
});

console.log(Object.values(possible).reduce((acc, num) => acc + num, 0));
