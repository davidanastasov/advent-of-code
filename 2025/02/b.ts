const input = await Deno.readTextFile("./input.txt");

const ranges = input.split(",").map((range) => ({
  start: Number(range.split("-")[0]),
  end: Number(range.split("-")[1]),
}));

function isInvalidId(num: number) {
  const str = num.toString();

  for (let length = 1; length <= str.length / 2; length++) {
    const firstPart = str.slice(0, length);
    let invalid = true;

    for (let j = length; j < str.length; j += length) {
      const secondPart = str.slice(j, j + length);

      if (firstPart !== secondPart) {
        invalid = false;
        break;
      }
    }

    if (invalid) {
      return true;
    }
  }
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
