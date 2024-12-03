const input = await Deno.readTextFile("./input.txt");

const regex = /mul\(\d{1,3},\d{1,3}\)/g;
const matches = input.match(regex);

let sum = 0;

matches?.forEach((match) => {
  const firstNum = Number(match.split("mul(")[1].split(",")[0]);
  const secondNum = Number(match.split(",")[1].split(")")[0]);

  sum += firstNum * secondNum;
});

console.log(sum);
