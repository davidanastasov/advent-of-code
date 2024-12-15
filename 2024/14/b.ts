const input = await Deno.readTextFile("./input.txt");

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

const grid: Position[][][] = [];

for (let y = 0; y < GRID_HEIGHT; y++) {
  for (let x = 0; x < GRID_WIDTH; x++) {
    if (!grid[y]) grid[y] = [];

    grid[y][x] = [];
  }
}

const lines = input.split("\r\n");

type Position = { x: number; y: number };
type Robot = { position: Position; velocity: Position };
const robots: Robot[] = [];

lines.forEach((line) => {
  const pos = line.slice(2, line.length).split(" ")[0];
  const vel = line.split(" v=")[1];

  robots.push({
    position: {
      x: Number(pos.split(",")[0]),
      y: Number(pos.split(",")[1]),
    },
    velocity: {
      x: Number(vel.split(",")[0]),
      y: Number(vel.split(",")[1]),
    },
  });
});

let seconds = 1;
while (true) {
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y][x] = [];
    }
  }

  robots.forEach((robot) => {
    robot.position.x = (robot.position.x + robot.velocity.x) % GRID_WIDTH;
    robot.position.y = (robot.position.y + robot.velocity.y) % GRID_HEIGHT;

    if (robot.position.x < 0) robot.position.x += GRID_WIDTH;
    if (robot.position.y < 0) robot.position.y += GRID_HEIGHT;

    grid[robot.position.y][robot.position.x].push(robot.position);
  });

  const map = grid
    .map((r) => r.map((b) => (b.length ? "*" : " ")).join(""))
    .join("\n");

  if (map.indexOf("*************************") !== -1) {
    break;
  }

  seconds++;
}

console.log(seconds);
