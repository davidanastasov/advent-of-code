const input = await Deno.readTextFile("input.txt");

const elves = input.split("\r\n\r\n");

let maxSum = 0;
elves.forEach((elf) => {
  const fruits = elf.split("\r\n");
  const sum = fruits.reduce((acc, fruit) => acc + parseInt(fruit), 0);

  if (sum > maxSum) {
    maxSum = sum;
  }
});

console.log(maxSum);
