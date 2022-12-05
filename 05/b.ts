const input = await Deno.readTextFile("./input.txt");
const note = input.split("\r\n\r\n");

const stackRows = note[0].split("\r\n");
const stackIndexes = stackRows
  .pop()!
  .split(" ")
  .filter((item) => item !== "");

const stacks: { [key: string]: string[] } = {};
stackIndexes.forEach((index) => (stacks[index] = []));

stackRows.reverse().forEach((row) => {
  const stack = row.split(/(.{3}) /).filter((item) => item !== "");

  stack.forEach((item, index) => {
    if (item === "   ") return;
    stacks[stackIndexes[index]].push(item);
  });
});

const instructions = note[1].split("\r\n");
instructions.forEach((instruction) => {
  const inputs = instruction.match(/move (\d+) from (\d+) to (\d+)/);

  const count = parseInt(inputs![1]);
  const from = inputs![2];
  const to = inputs![3];

  const removed = stacks[from].splice(stacks[from].length - count, count);
  stacks[to].push(...removed);
});

const topItems = Object.values(stacks).map((stack) => stack.pop()!);
console.log(topItems.map((item) => item[1]).join(""));
