const input = await Deno.readTextFile("./input.txt");
const instructions = input.split("\r\n");

let spritePosition = 1;
const pending: { amount: number; health: number }[] = [];

const CRTSize = {
  width: 40,
  height: 6,
};

const CRT: string[][] = new Array(CRTSize.height)
  .fill(".")
  .map(() => new Array(CRTSize.width).fill("."));

let row = 0;
let column = 0;

while (instructions.length > 0 || pending.length > 0) {
  const pendingInstruction = pending[0];

  let modified = false;

  if (pendingInstruction) {
    pendingInstruction.health--;

    if (pendingInstruction.health === 0) {
      spritePosition += pendingInstruction.amount;
      pending.splice(pending.indexOf(pendingInstruction), 1);
      modified = true;
    }
  }

  if (spritePosition - 1 <= column && column <= spritePosition + 1) {
    CRT[row][column] = "#";
  }

  column++;
  if (column >= CRTSize.width) {
    column = 0;
    row++;
  }

  if (modified) continue;

  const instruction = instructions.shift();
  if (instruction && instruction !== "noop") {
    const amount = Number(instruction.split(" ")[1]);
    pending.push({ amount, health: 2 });
  }
}

function drawCRT() {
  let output = "";

  for (let i = 0; i < CRTSize.height; i++) {
    for (let j = 0; j < CRTSize.width; j++) {
      output += CRT[i][j];
    }

    if (i < CRTSize.height - 1) output += "\r\n";
  }

  console.log(output);
}

drawCRT();
