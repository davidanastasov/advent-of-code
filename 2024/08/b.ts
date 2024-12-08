const input = await Deno.readTextFile("./input.txt");

const rows = input.split("\r\n");
const grid = rows.map((row) => row.split(""));

type Location = { i: number; j: number };

const frequencyAntennas: Record<string, Location[]> = {};

for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    const curr = grid[i][j];

    if (curr == ".") continue;

    if (!frequencyAntennas[curr]) {
      frequencyAntennas[curr] = [];
    }

    frequencyAntennas[curr].push({ i, j });
  }
}

Object.entries(frequencyAntennas).forEach(([_, antennas]) => {
  for (let i = 0; i < antennas.length; i++) {
    for (let j = i; j < antennas.length; j++) {
      if (i == j) continue;

      const antenna1 = antennas[i];
      const antenna2 = antennas[j];

      const dx = antenna1.i - antenna2.i;
      const dy = antenna1.j - antenna2.j;

      const antinode1: Location = { i: antenna1.i + dx, j: antenna1.j + dy };
      const antinode2: Location = { i: antenna2.i - dx, j: antenna2.j - dy };

      while (
        antinode1.i >= 0 &&
        antinode1.i < grid.length &&
        antinode1.j >= 0 &&
        antinode1.j < grid[0].length
      ) {
        grid[antinode1.i][antinode1.j] = "#";

        antinode1.i += dx;
        antinode1.j += dy;
      }

      while (
        antinode2.i >= 0 &&
        antinode2.i < grid.length &&
        antinode2.j >= 0 &&
        antinode2.j < grid[0].length
      ) {
        grid[antinode2.i][antinode2.j] = "#";

        antinode2.i -= dx;
        antinode2.j -= dy;
      }
    }
  }
});

// grid.forEach((row) => {
//   console.log(row.join(""));
// });

const count = grid.reduce(
  (acc, row) => acc + row.filter((cell) => cell != ".").length,
  0
);

console.log(count);
