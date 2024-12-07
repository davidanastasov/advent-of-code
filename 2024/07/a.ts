const input = await Deno.readTextFile("./input.txt");

const equations = input.split("\r\n");

function generatePermutations(level: number) {
  if (level == 0) {
    return [];
  }

  const plus: string[][] = [];
  const plusPermutations = generatePermutations(level - 1);

  if (plusPermutations?.length == 0) {
    plus.push(["+"]);
  }

  plusPermutations?.forEach((permutation) => {
    plus.push(["+", ...permutation]);
  });

  const multiply: string[][] = [];
  const multiplyPermutations = generatePermutations(level - 1);

  if (multiplyPermutations?.length == 0) {
    multiply.push(["*"]);
  }

  multiplyPermutations?.forEach((permutation) => {
    multiply.push(["*", ...permutation]);
  });

  return [...plus, ...multiply];
}

const possible: Record<number, number> = {};
const cache: Record<number, string[][]> = {};

equations.forEach((equation, i) => {
  const result = Number(equation.split(": ")[0]);
  const numbers = equation.split(": ")[1].split(" ").map(Number);

  let possible_permutations = cache[numbers.length];

  if (!possible_permutations) {
    possible_permutations = generatePermutations(numbers.length - 1);
    cache[numbers.length] = possible_permutations;
  }

  possible_permutations.forEach((permutation) => {
    const calculated = numbers.reduce((acc, num, index) => {
      const operation = permutation[index - 1];

      if (operation === "+") {
        acc += num;
      } else {
        acc *= num;
      }

      return acc;
    });

    if (calculated == result) {
      possible[i] = result;
    }
  });
});

console.log(Object.values(possible).reduce((acc, num) => acc + num, 0));
