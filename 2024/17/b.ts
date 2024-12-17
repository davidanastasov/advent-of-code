const instructions = [
  "adv",
  "bxl",
  "bst",
  "jnz",
  "bxc",
  "out",
  "bdv",
  "cdv",
] as const;

const operands = [0, 1, 2, 3, "A", "B", "C"] as const;

const input = await Deno.readTextFile("./input.txt");
const lines = input.replace("\r\n\r\n", "\r\n").split("\r\n");

let registerA: bigint = BigInt(0);
let registerB: bigint = BigInt(0);
let registerC: bigint = BigInt(0);

type Instruction = { opcode: number; operand: number };
const program: Instruction[] = [];
const programNumbers: number[] = [];

lines.forEach((line, i) => {
  if (i === 0) {
    registerA = BigInt(line.split(": ")[1]);
  } else if (i === 1) {
    registerB = BigInt(line.split(": ")[1]);
  } else if (i === 2) {
    registerC = BigInt(line.split(": ")[1]);
  } else {
    const numbers = line.split("Program: ")[1].split(",").map(Number);
    for (let i = 0; i < numbers.length; i += 2) {
      program.push({ opcode: numbers[i], operand: numbers[i + 1] });
    }
    programNumbers.push(...numbers);
  }
});

function getComboOperand(operand: number) {
  const comboOperand = operands[operand];
  return comboOperand === "A"
    ? registerA
    : comboOperand === "B"
    ? registerB
    : comboOperand === "C"
    ? registerC
    : operand;
}

function calculateOutput(initialValue: bigint) {
  registerA = initialValue;

  let out = "";
  let instructionPointer = 0;

  while (instructionPointer < program.length) {
    const instruction = program[instructionPointer];

    switch (instructions[instruction.opcode]) {
      case "adv": {
        const value = getComboOperand(instruction.operand);
        registerA = BigInt(registerA / BigInt(Math.pow(2, Number(value))));
        break;
      }

      case "bxl": {
        registerB = BigInt(registerB) ^ BigInt(instruction.operand);
        break;
      }

      case "bst": {
        const value = getComboOperand(instruction.operand);
        registerB = BigInt(value) % BigInt(8);
        break;
      }

      case "jnz": {
        if (registerA !== BigInt(0)) {
          instructionPointer = instruction.operand;
          continue;
        }

        break;
      }

      case "bxc": {
        registerB = BigInt(registerB) ^ BigInt(registerC);
        break;
      }

      case "out": {
        const value = getComboOperand(instruction.operand);
        // out.push(value % 8);
        out += BigInt(value) % BigInt(8);
        break;
      }

      case "bdv": {
        const value = getComboOperand(instruction.operand);
        registerB = BigInt(registerA / BigInt(Math.pow(2, Number(value))));
        break;
      }

      case "cdv": {
        const value = getComboOperand(instruction.operand);
        registerC = BigInt(registerA / BigInt(Math.pow(2, Number(value))));
        break;
      }

      default: {
        throw new Error("Invalid instruction");
      }
    }

    instructionPointer++;
  }

  return out;
}

const reversePartials: Record<number, string> = {};
for (let i = 1; i <= programNumbers.length; i++) {
  reversePartials[i] = programNumbers
    .slice(programNumbers.length - i, programNumbers.length)
    .join("");
}

const results: number[] = [];

const queue: bigint[] = [];
queue.push(BigInt(0));

while (queue.length > 0) {
  const value = queue.shift()!;

  for (let i = 0; i < 8; i++) {
    const next = (value << BigInt(3)) + BigInt(i);
    const result = calculateOutput(next);

    if (result === reversePartials[result.length]) {
      if (result.length === programNumbers.length) {
        results.push(Number(next));
      } else {
        queue.push(next);
      }
    }
  }
}

const smallest = results.sort((a, b) => a - b)[0];
console.log(smallest);
