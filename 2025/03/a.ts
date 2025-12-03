const input = await Deno.readTextFile("./input.txt");
const banks = input.split("\n").map((l) => l.trim().split("").map(Number));

function findMaxJoltage(batteries: number[]) {
  let max = 0;

  for (let i = 0; i < batteries.length; i++) {
    for (let j = i + 1; j < batteries.length; j++) {
      const first = batteries[i].toString();
      const second = batteries[j].toString();
      const combination = Number(first + second);

      if (combination > max) {
        max = combination;
      }
    }
  }

  return max;
}

let sum = 0;

for (const bank of banks) {
  sum += findMaxJoltage(bank);
}

console.log(sum);
