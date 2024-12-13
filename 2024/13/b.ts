const input = await Deno.readTextFile("./input.txt");

const COST_A = 3;
const COST_B = 1;
const FACTOR = 10000000000000;

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
    prize: { x: Number(prizeX) + FACTOR, y: Number(prizeY) + FACTOR },
  });
});

const machineCosts = new Map<number, number>();

machines.forEach((machine) => {
  const m =
    (machine.prize.y * machine.a.x - machine.prize.x * machine.a.y) /
    (machine.b.y * machine.a.x - machine.b.x * machine.a.y);

  const n = (machine.prize.x - m * machine.b.x) / machine.a.x;

  if ((n % 1) / 10 !== 0 || (m % 1) / 10 !== 0) return;

  const cost = n * COST_A + m * COST_B;

  machineCosts.set(machine.id, cost);
});

const total = machineCosts.values().reduce((acc, cost) => acc + cost, 0);
console.log(total);
