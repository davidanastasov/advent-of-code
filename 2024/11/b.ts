const input = await Deno.readTextFile("./input.txt");

const stones: number[] = input.split(" ").map(Number);

const computed: Record<string, number> = {};

function calculateStoneCount(stone: number, i: number) {
  if (i === 75) {
    return 1;
  }

  if (computed[`${stone}-${i}`]) {
    return computed[`${stone}-${i}`];
  }

  const stoneString = stone.toString();
  let count = 0;

  if (stone === 0) {
    count += calculateStoneCount(1, i + 1);
  } else if (stoneString.length % 2 === 0) {
    const firstHalf = stoneString.slice(0, stoneString.length / 2);
    const secondHalf = stoneString.slice(stoneString.length / 2);

    const firstNum = Number(firstHalf);
    count += calculateStoneCount(firstNum, i + 1);

    const secondNum = Number(secondHalf);
    count += calculateStoneCount(secondNum, i + 1);
  } else {
    count += calculateStoneCount(stone * 2024, i + 1);
  }

  computed[`${stone}-${i}`] = count;

  return count;
}

let totalCount = 0;

stones.forEach((stone) => {
  totalCount += calculateStoneCount(stone, 0);
});

console.log(totalCount);
