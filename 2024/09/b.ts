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

type Space = { index: number; length: number };
let spaces: Space[] = [];

let i = 0;
while (i < result.length) {
  if (result[i] == ".") {
    for (let j = i; j < result.length; j++) {
      if (result[j] != ".") {
        spaces.push({ index: i, length: j - i });
        i = j;
        break;
      }
    }
  }
  i++;
}

while (right > left) {
  const file = result[right];

  if (file == ".") {
    right--;
    continue;
  }

  let startIndex = right;
  while (result[startIndex - 1] == file) {
    startIndex--;
  }

  const len = right - startIndex + 1;

  const validSpaces = spaces.filter(({ length }) => length >= len);

  if (validSpaces.length > 0) {
    const space = validSpaces[0];

    if (startIndex < space.index) {
      right = startIndex - 1;
      continue;
    }

    for (let i = 0; i < len; i++) {
      result[space.index + i] = result[right - i];
      result[right - i] = ".";
    }

    space.index += len;
    space.length -= len;
    spaces = spaces.filter(({ length }) => length > 0);

    right = startIndex;
    left = result.indexOf(".");

    while (result[right] == ".") {
      right--;
    }
  } else {
    right = startIndex - 1;
  }
}

const checksum = result.reduce((acc, curr, index) => {
  if (curr != ".") {
    acc += index * Number(curr);
  }
  return acc;
}, 0);

console.log(checksum);
