const input = await Deno.readTextFile("./input.txt");

const ranges = input.split(",").map((range) => ({
  start: Number(range.split("-")[0]),
  end: Number(range.split("-")[1]),
}));

function isInvalidId(num: number) {
  const str = num.toString();
  const firstPart = str.slice(0, str.length / 2);
  const secondPart = str.slice(str.length / 2);

  return firstPart === secondPart;
}

let sum = 0;

for (const range of ranges) {
  for (let number = range.start; number <= range.end; number++) {
    if (isInvalidId(number)) {
      sum += number;
    }
  }
}

console.log(sum);
