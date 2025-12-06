const input = await Deno.readTextFile("./input.txt");

const equations: {
  operator: string;
  numbers: number[];
  result?: number;
}[] = [];

function transposeInput(inputString: string) {
  const lines = inputString.split("\n").map((line) => line.split(""));

  const maxLength = Math.max(...lines.map((r) => r.length));
  const transposed = [];

  for (let col = 0; col < maxLength; col++) {
    transposed.push(lines.map((row) => row[col]).join(""));
  }

  return transposed.join("\n");
}

const inputEquations = transposeInput(input).split(/\n\s+\n/);

for (let i = 0; i < inputEquations.length; i++) {
  const lines = inputEquations[i].split("\n");

  equations[i] ??= {
    operator: lines[0].at(-1)!,
    numbers: [],
  };

  lines[0] = lines[0].slice(0, -1);

  for (const line of lines) {
    const parsed = Number(line.trim());
    if (!isNaN(parsed) && parsed !== 0) {
      equations[i].numbers.push(parsed);
    }
  }

  const equation = equations[i];
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
