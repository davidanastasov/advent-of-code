const input = await Deno.readTextFile("./input.txt");

const regex = /mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g;
const matches = input.match(regex);

let sum = 0;
let enabled = true;

matches?.forEach((match) => {
  if (match.startsWith("m") && enabled) {
    const firstNum = Number(match.split("mul(")[1].split(",")[0]);
    const secondNum = Number(match.split(",")[1].split(")")[0]);

    sum += firstNum * secondNum;
  } else if (match == "do()") {
    enabled = true;
  } else if (match == "don't()") {
    enabled = false;
  }
});

console.log(sum);
