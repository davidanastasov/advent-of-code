const input = await Deno.readTextFile("./input.txt");

const sacks = input.split("\r\n");

const groups = sacks.reduce((acc: string[][], curr, i) => {
  if (i % 3 === 0) {
    acc.push([curr]);
  } else {
    acc[acc.length - 1].push(curr);
  }
  return acc;
}, []);

let sum = 0;
groups.forEach((group) => {
  const firstSack = group[0];
  const items = firstSack.split("");

  const badge = items.find((item) =>
    group.every((sack) => sack.includes(item))
  ) as string;

  let priority = 0;
  if (badge === badge.toUpperCase()) {
    priority = badge.charCodeAt(0) - 64 + 26;
  } else {
    priority = badge.charCodeAt(0) - 96;
  }

  sum += priority;
});

console.log(sum);
