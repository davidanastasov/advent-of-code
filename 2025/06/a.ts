const input = await Deno.readTextFile("./input.txt");

const equations: { operator: string; numbers: number[]; result?: number }[] =
  [];

const lines = input.trim().split("\n");

for (const line of lines) {
  line
    .trim()
    .split(/\s+/)
    .forEach((number, index) => {
      equations[index] ??= { operator: "", numbers: [] };

      const parsed = Number(number);

      if (isNaN(parsed)) {
        equations[index].operator = number;
      } else equations[index].numbers.push(Number(parsed));
    });
}

for (const equation of equations) {
  switch (equation.operator) {
    case "+":
      equation.result = equation.numbers.reduce((acc, cur) => (acc += cur), 0);
      break;

    case "*":
      equation.result = equation.numbers.reduce((acc, cur) => (acc *= cur), 1);
      break;
  }
}

const sum = equations.reduce((acc, cur) => (acc += cur.result!), 0);
console.log(sum);
