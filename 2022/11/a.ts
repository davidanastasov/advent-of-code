const input = await Deno.readTextFile("./input.txt");
const monkeyData = input.split("\r\n\r\n");

interface Monkey {
  index: number;
  itemWorryLevels: number[];
  operation: string;
  throwIfDivisibleBy: number;
  monkeyIndexIfTrue: number;
  monkeyIndexIfFalse: number;
  itemsInspectedCounter: number;
}

const monkeys: Monkey[] = [];
monkeyData.forEach((monkey) => {
  const lines = monkey.split("\r\n");

  const itemWorryLevels = lines[1]
    .trimStart()
    .split(": ")[1]
    .split(", ")
    .map((item) => Number(item));

  monkeys.push({
    index: Number(lines[0].split(" ")[1].replace(":", "")),
    itemWorryLevels: itemWorryLevels,
    operation: lines[2].split("new = ")[1],
    throwIfDivisibleBy: Number(lines[3].split("divisible by ")[1]),
    monkeyIndexIfTrue: Number(lines[4].split("monkey ")[1]),
    monkeyIndexIfFalse: Number(lines[5].split("monkey ")[1]),
    itemsInspectedCounter: 0,
  });
});

let roundCounter = 0;
while (roundCounter < 20) {
  monkeys.forEach((monkey) => {
    [...monkey.itemWorryLevels].forEach((itemWorryLevel) => {
      let newWorryLevel = eval(
        monkey.operation.replace(/old/g, itemWorryLevel.toString())
      );

      newWorryLevel = Math.floor(newWorryLevel / 3);

      const itemIndex = monkey.itemWorryLevels.indexOf(itemWorryLevel);
      monkey.itemWorryLevels.splice(itemIndex, 1);

      if (newWorryLevel % monkey.throwIfDivisibleBy === 0) {
        monkeys[monkey.monkeyIndexIfTrue].itemWorryLevels.push(newWorryLevel);
      } else {
        monkeys[monkey.monkeyIndexIfFalse].itemWorryLevels.push(newWorryLevel);
      }

      monkey.itemsInspectedCounter++;
    });
  });

  roundCounter++;
}

const sortedMonkeys = monkeys.sort(
  (a, b) => b.itemsInspectedCounter - a.itemsInspectedCounter
);

const firstMonkey = sortedMonkeys[0];
const secondMonkey = sortedMonkeys[1];

const monkeyBusinessScore =
  firstMonkey.itemsInspectedCounter * secondMonkey.itemsInspectedCounter;

console.log(monkeyBusinessScore);
