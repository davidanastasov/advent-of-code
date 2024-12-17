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

let registerA = 0;
let registerB = 0;
let registerC = 0;

type Instruction = { opcode: number; operand: number };
const program: Instruction[] = [];

lines.forEach((line, i) => {
  const value = Number(line.split(": ")[1]);
  if (i === 0) {
    registerA = value;
  } else if (i === 1) {
    registerB = value;
  } else if (i === 2) {
    registerC = value;
  } else {
    const numbers = line.split("Program: ")[1].split(",").map(Number);
    for (let i = 0; i < numbers.length; i += 2) {
      program.push({ opcode: numbers[i], operand: numbers[i + 1] });
    }
  }
});

const out: number[] = [];

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

let instructionPointer = 0;

while (instructionPointer < program.length) {
  const instruction = program[instructionPointer];

  switch (instructions[instruction.opcode]) {
    case "adv": {
      const value = getComboOperand(instruction.operand);
      registerA = Math.floor(registerA / Math.pow(2, value));
      break;
    }

    case "bxl": {
      registerB = registerB ^ instruction.operand;
      break;
    }

    case "bst": {
      const value = getComboOperand(instruction.operand);
      registerB = value % 8;
      break;
    }

    case "jnz": {
      if (registerA !== 0) {
        instructionPointer = instruction.operand;
        continue;
      }

      break;
    }

    case "bxc": {
      registerB = registerB ^ registerC;
      break;
    }

    case "out": {
      const value = getComboOperand(instruction.operand);
      out.push(value % 8);
      break;
    }

    case "bdv": {
      const value = getComboOperand(instruction.operand);
      registerB = Math.floor(registerA / Math.pow(2, value));
      break;
    }

    case "cdv": {
      const value = getComboOperand(instruction.operand);
      registerC = Math.floor(registerA / Math.pow(2, value));
      break;
    }

    default: {
      throw new Error("Invalid instruction");
    }
  }

  instructionPointer++;
}

console.log(out.join(","));
