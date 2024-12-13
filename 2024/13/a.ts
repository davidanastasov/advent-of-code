const input = await Deno.readTextFile("./input.txt");

const COST_A = 3;
const COST_B = 1;

const specs = input.split("\r\n\r\n");

type Position = { x: number; y: number };
type Machine = {
  id: number;
  a: Position;
  b: Position;
  prize: Position;
};

const machines: Machine[] = [];

specs.forEach((spec, i) => {
  const lines = spec.split("\r\n");

  const ARegex = /A: X([+-]\d*), Y([+-]\d*)/g;
  const BRegex = /B: X([+-]\d*), Y([+-]\d*)/g;
  const prizeRegex = /Prize: X=(\d*), Y=(\d*)/g;

  // @ts-ignore
  const [_, aX, aY] = ARegex.exec(lines[0]);
  const [_2, bX, bY] = BRegex.exec(lines[1]);
  const [_3, prizeX, prizeY] = prizeRegex.exec(lines[2]);

  machines.push({
    id: i,
    a: { x: Number(aX), y: Number(aY) },
    b: { x: Number(bX), y: Number(bY) },
    prize: { x: Number(prizeX), y: Number(prizeY) },
  });
});

const machineCosts = new Map<number, number>();

machines.forEach((machine) => {
  const maxStepsA = 100;
  for (let i = maxStepsA; i >= 0; i--) {
    for (let j = 0; j < maxStepsA; j++) {
      const position: Position = {
        x: machine.a.x * i + machine.b.x * j,
        y: machine.a.y * i + machine.b.y * j,
      };

      if (position.x === machine.prize.x && position.y === machine.prize.y) {
        const cost = i * COST_A + j * COST_B;

        if (!machineCosts.has(machine.id)) {
          machineCosts.set(machine.id, cost);
        }

        if (
          machineCosts.has(machine.id) &&
          cost < machineCosts.get(machine.id)!
        ) {
          machineCosts.set(machine.id, cost);
        }
      }
    }
  }

  //   const maxStepsB = 100;
  //   //   console.log(maxStepsA, maxStepsB);
  //   for (let i = maxStepsB; i >= 0; i--) {
  //     for (let j = 0; j < maxStepsB; j++) {
  //       const position: Position = {
  //         x: machine.a.x * i + machine.b.x * j,
  //         y: machine.a.y * i + machine.b.y * j,
  //       };

  //       if (position.x === machine.prize.x && position.y === machine.prize.y) {
  //         const cost = i * COST_A + j * COST_B;

  //         if (!machineCosts.has(machine.id)) {
  //           machineCosts.set(machine.id, cost);
  //         }

  //         if (
  //           machineCosts.has(machine.id) &&
  //           cost < machineCosts.get(machine.id)!
  //         ) {
  //           machineCosts.set(machine.id, cost);
  //         }
  //       }
  //     }
  //   }
});

const total = machineCosts.values().reduce((acc, cost) => acc + cost, 0);
console.log(total);
