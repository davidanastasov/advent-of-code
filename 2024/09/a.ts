const input = await Deno.readTextFile("./input.txt");

let isFile = true;
let fileIndex = 0;

const result: string[] = [];

for (let i = 0; i < input.length; i++) {
  const num = Number(input[i]);

  if (isFile) {
    for (let j = 0; j < num; j++) {
      result.push(fileIndex.toString());
    }
    fileIndex++;
  } else {
    for (let j = 0; j < num; j++) {
      result.push(".");
    }
  }

  isFile = !isFile;
}

let left = result.indexOf(".");
let right = result.length - 1;

while (right > left) {
  const file = result[right];

  if (file == ".") {
    right--;
    continue;
  }

  result[left] = result[right];
  result[right] = ".";

  right--;
  left++;

  while (result[right] == ".") {
    right--;
  }

  while (result[left] != ".") {
    left++;
  }
}

const checksum = result.reduce((acc, curr, index) => {
  if (curr != ".") {
    acc += index * Number(curr);
  }
  return acc;
}, 0);

console.log(checksum);
