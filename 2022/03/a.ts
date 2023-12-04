const input = await Deno.readTextFile("./input.txt");

const sacks = input.split("\r\n");

let sum = 0;
sacks.forEach((sack) => {
  const firstCompartment = sack.slice(0, sack.length / 2);
  const secondCompartment = sack.slice(sack.length / 2, sack.length);

  let hasError = false;

  firstCompartment.split("").forEach((item) => {
    if (hasError) {
      return;
    }

    if (!secondCompartment.includes(item)) {
      return;
    }

    hasError = true;

    let priority = 0;
    if (item === item.toUpperCase()) {
      priority = item.charCodeAt(0) - 64 + 26;
    } else {
      priority = item.charCodeAt(0) - 96;
    }

    sum += priority;
  });
});

console.log(sum);
