const input = await Deno.readTextFile("./input.txt");

const stones = input.split(" ").map(Number);

for (let i = 0; i < 25; i++) {
  for (let j = 0; j < stones.length; j++) {
    const stone = stones[j];
    const stoneString = stone.toString();

    if (stone === 0) {
      stones[j] = 1;
    } else if (stoneString.length % 2 === 0) {
      const firstHalf = stoneString.slice(0, stoneString.length / 2);
      const secondHalf = stoneString.slice(stoneString.length / 2);

      stones[j] = Number(firstHalf);
      stones.splice(j + 1, 0, Number(secondHalf));
      j++;
    } else {
      stones[j] = stone * 2024;
    }
  }
}

console.log(stones.length);
