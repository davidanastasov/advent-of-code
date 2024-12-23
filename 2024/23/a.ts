const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\r\n");

const computers: string[] = [];
const network = new Map<string, Set<string>>();

lines.forEach((line) => {
  const first = line.split("-")[0];
  const second = line.split("-")[1];

  if (!network.has(first)) {
    network.set(first, new Set());
    computers.push(first);
  }

  network.get(first)!.add(second);

  if (!network.has(second)) {
    network.set(second, new Set());
    computers.push(second);
  }

  network.get(second)!.add(first);
});

const sets = new Set<string>();

for (let i = 0; i < computers.length; i++) {
  for (let j = 0; j < computers.length; j++) {
    for (let k = 0; k < computers.length; k++) {
      const first = computers[i];
      const second = computers[j];
      const third = computers[k];

      if (
        !first.startsWith("t") &&
        !second.startsWith("t") &&
        !third.startsWith("t")
      )
        continue;

      if (
        network.get(first)!.has(second) &&
        network.get(first)!.has(third) &&
        network.get(second)!.has(third)
      ) {
        sets.add([first, second, third].sort().join("-"));
      }
    }
  }
}

console.log(sets.size);
