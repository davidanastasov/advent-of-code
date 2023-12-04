const input = await Deno.readTextFile("input.txt");

const elves = input.split("\r\n\r\n");

const sums: number[] = [];
elves.forEach((elf) => {
  const fruits = elf.split("\r\n");
  const sum = fruits.reduce((acc, fruit) => acc + parseInt(fruit), 0);

  sums.push(sum);
});

const sortedSums = sums.sort((a, b) => b - a);
const topThreeSums = sortedSums.slice(0, 3);
const sum = topThreeSums.reduce((acc, sum) => acc + sum, 0);
console.log(sum);
