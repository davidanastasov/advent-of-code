const input = await Deno.readTextFile("./input.txt");

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

const QUADRANT_WIDTH = Math.floor(GRID_WIDTH / 2);
const QUADRANT_HEIGHT = Math.floor(GRID_HEIGHT / 2);

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

for (let second = 0; second < 100; second++) {
  robots.forEach((robot) => {
    robot.position.x = (robot.position.x + robot.velocity.x) % GRID_WIDTH;
    robot.position.y = (robot.position.y + robot.velocity.y) % GRID_HEIGHT;

    if (robot.position.x < 0) robot.position.x += GRID_WIDTH;
    if (robot.position.y < 0) robot.position.y += GRID_HEIGHT;
  });
}

let sum_q1 = 0;
let sum_q2 = 0;
let sum_q3 = 0;
let sum_q4 = 0;

robots.forEach((robot) => {
  const pos = robot.position;

  if (pos.x < QUADRANT_WIDTH && pos.y < QUADRANT_HEIGHT) sum_q1++;
  if (pos.x > QUADRANT_WIDTH && pos.y < QUADRANT_HEIGHT) sum_q2++;
  if (pos.x < QUADRANT_WIDTH && pos.y > QUADRANT_HEIGHT) sum_q3++;
  if (pos.x > QUADRANT_WIDTH && pos.y > QUADRANT_HEIGHT) sum_q4++;
});

const result = sum_q1 * sum_q2 * sum_q3 * sum_q4;
console.log(result);
