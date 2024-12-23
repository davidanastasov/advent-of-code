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

function findConnections(computer: string) {
  const visited = new Set<string>();
  const queue: string[] = [];
  const connected: string[] = [];

  queue.push(computer);

  while (queue.length > 0) {
    const cur = queue.shift()!;

    const curCons = network.get(cur)!;
    const connectedToAll = connected.every((c) => curCons.has(c));

    if (connectedToAll) {
      connected.push(cur);
    }

    curCons.forEach((connection) => {
      if (visited.has(connection)) return;

      visited.add(connection);
      queue.push(connection);
    });
  }

  return connected;
}

const max = network
  .keys()
  .map((computer) => findConnections(computer))
  .reduce((max, cur) => (cur.length > max.length ? cur : max));

const result = max.toSorted().join(",");
console.log(result);
