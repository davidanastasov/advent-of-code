const input = await Deno.readTextFile("./input.txt");
const turns = input.split("\r\n");

type Position = { x: number; y: number };

const allPositions = new Set<string>();
const ropePositions: Position[] = new Array(10)
  .fill(1)
  .map(() => ({ x: 0, y: 0 }));

turns.forEach((step) => {
  const [direction, steps] = step.split(" ");

  for (let i = 0; i < parseInt(steps); i++) {
    const headPosition = { ...ropePositions[0] };

    switch (direction) {
      case "R": {
        headPosition.x += 1;
        break;
      }
      case "L": {
        headPosition.x -= 1;
        break;
      }
      case "U": {
        headPosition.y += 1;
        break;
      }
      case "D": {
        headPosition.y -= 1;
        break;
      }
    }

    ropePositions[0] = headPosition;

    for (let position = 0; position < ropePositions.length - 1; position++) {
      const curr = ropePositions[position];
      const next = ropePositions[position + 1];

      const diffX = curr.x - next.x;
      const diffY = curr.y - next.y;

      if (Math.abs(diffX) > 1) {
        next.x += diffX > 0 ? 1 : -1;

        if (Math.abs(diffY) != 0) {
          next.y += diffY > 0 ? 1 : -1;
        }
      } else if (Math.abs(diffY) > 1) {
        next.y += diffY > 0 ? 1 : -1;

        if (Math.abs(diffX) != 0) {
          next.x += diffX > 0 ? 1 : -1;
        }
      }
    }

    allPositions.add(`${ropePositions[9].x},${ropePositions[9].y}`);
  }
});

console.log(allPositions.size);
