const input = await Deno.readTextFile("./input.txt");
const banks = input.split("\n").map((l) => l.trim().split("").map(Number));

function findMaxJoltage(batteries: number[]) {
  let combination: string = "";
  let startIndex = 0;

  for (let i = 0; i < 12; i++) {
    const endIndex = batteries.length - (12 - i - 1);
    const maxDigit = batteries
      .slice(startIndex, endIndex)
      .reduce((acc, voltage) => Math.max(acc, voltage), -1);

    const maxIndex = batteries.indexOf(maxDigit, startIndex);

    combination += maxDigit;

    startIndex = maxIndex + 1;
  }

  return Number(combination);
}

let sum = 0;

for (const bank of banks) {
  sum += findMaxJoltage(bank);
}

console.log(sum);
