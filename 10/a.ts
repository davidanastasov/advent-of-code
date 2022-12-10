const input = await Deno.readTextFile("./input.txt");
const instructions = input.split("\r\n");

let x = 1;
let cycleCounter = 0;
const pending: { amount: number; health: number }[] = [];

let sum = 0;

while (instructions.length > 0 || pending.length > 0) {
  if ([20, 60, 100, 140, 180, 220].includes(cycleCounter)) {
    sum += cycleCounter * x;
  }

  cycleCounter += 1;

  const pendingInstruction = pending[0];

  if (pendingInstruction) {
    pendingInstruction.health--;

    if (pendingInstruction.health === 0) {
      x += pendingInstruction.amount;
      pending.splice(pending.indexOf(pendingInstruction), 1);
      continue;
    }
  }

  const instruction = instructions.shift();
  if (instruction && instruction !== "noop") {
    const amount = Number(instruction.split(" ")[1]);
    pending.push({ amount, health: 2 });
  }
}

console.log(sum);
