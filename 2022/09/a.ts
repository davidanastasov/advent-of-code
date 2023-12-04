const input = await Deno.readTextFile("./input.txt");
const turns = input.split("\r\n");

type Position = { x: number; y: number };

const headPosition: Position = { x: 0, y: 0 };
const tailPosition: Position = { x: 0, y: 0 };

const tailVisitedPositions: Position[] = [{ x: 0, y: 0 }];
let prevHeadPosition: Position = headPosition;

turns.forEach((step) => {
  const [direction, steps] = step.split(" ");

  for (let i = 0; i < parseInt(steps); i++) {
    prevHeadPosition = { ...headPosition };

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

    if (
      Math.abs(headPosition.x - tailPosition.x) > 1 ||
      Math.abs(headPosition.y - tailPosition.y) > 1
    ) {
      tailPosition.x = prevHeadPosition.x;
      tailPosition.y = prevHeadPosition.y;
      tailVisitedPositions.push({ ...tailPosition });
    }
  }
});

const uniquePositions = new Set(
  tailVisitedPositions.map((position) => `${position.x},${position.y}`)
);
console.log(uniquePositions.size);
