const input = await Deno.readTextFile("./input.txt");
const codes = input.split("\r\n");

type Position = { i: number; j: number };

const PHYSICAL_KEYPAD = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [" ", "0", "A"],
];

const PHYSICAL_POSITIONS = new Map<string, Position>();

for (let i = 0; i < PHYSICAL_KEYPAD.length; i++) {
  for (let j = 0; j < PHYSICAL_KEYPAD[i].length; j++) {
    PHYSICAL_POSITIONS.set(PHYSICAL_KEYPAD[i][j], { i, j });
  }
}

const ROBOT_KEYPAD = [
  [" ", "^", "A"],
  ["<", "v", ">"],
];

const ROBOT_POSITIONS = new Map<string, Position>();

for (let i = 0; i < ROBOT_KEYPAD.length; i++) {
  for (let j = 0; j < ROBOT_KEYPAD[i].length; j++) {
    ROBOT_POSITIONS.set(ROBOT_KEYPAD[i][j], { i, j });
  }
}

const INVERSE = {
  "^": "v",
  v: "^",
  "<": ">",
  ">": "<",
};

const physicalMap = new Map<string, string[][]>();

function findPathsDFS(
  start: Position,
  target: Position,
  pathMap: Map<string, string> = new Map()
) {
  if (start.i === target.i && start.j === target.j) {
    return [];
  }

  const paths: string[][] = [];

  const directions = [
    { i: 1, j: 0, dir: "v" },
    { i: -1, j: 0, dir: "^" },
    { i: 0, j: 1, dir: ">" },
    { i: 0, j: -1, dir: "<" },
  ];

  directions.forEach((dir) => {
    const newPos: Position = {
      i: start.i + dir.i,
      j: start.j + dir.j,
    };

    if (
      newPos.i < 0 ||
      newPos.i >= PHYSICAL_KEYPAD.length ||
      newPos.j < 0 ||
      newPos.j >= PHYSICAL_KEYPAD[newPos.i].length
    )
      return;

    if (PHYSICAL_KEYPAD[newPos.i][newPos.j] === " ") {
      return;
    }

    const path = new Map<string, string>(pathMap);

    if (path.has(PHYSICAL_KEYPAD[newPos.i][newPos.j])) {
      return [];
    }

    path.set(PHYSICAL_KEYPAD[newPos.i][newPos.j], dir.dir);

    const newMap = findPathsDFS(newPos, target, path);
    newMap.forEach((map) => {
      paths.push([dir.dir, ...map]);
    });

    if (newMap.length === 0) {
      paths.push([dir.dir]);
    }
  });

  return paths;
}

const KEYPAD_KEYS = PHYSICAL_KEYPAD.flat().filter((key) => key !== " ");
KEYPAD_KEYS.forEach((key1) => {
  KEYPAD_KEYS.forEach((key2) => {
    if (key1 === key2) return;
    if (physicalMap.has(`${key1}-${key2}`)) return;

    const firstPos = PHYSICAL_POSITIONS.get(key1)!;
    const secondPos = PHYSICAL_POSITIONS.get(key2)!;

    const paths: string[][] = [];

    // Same row
    if (firstPos.i === secondPos.i) {
      const diff = secondPos.j - firstPos.j;
      if (diff > 0) {
        paths.push(Array(diff).fill(">"));
      } else {
        paths.push(Array(-diff).fill("<"));
      }
    }

    // Same column
    if (firstPos.j === secondPos.j) {
      const diff = secondPos.i - firstPos.i;
      if (diff > 0) {
        paths.push(Array(diff).fill("v"));
      } else {
        paths.push(Array(-diff).fill("^"));
      }
    }

    if (paths.length === 0) {
      const possible = findPathsDFS(firstPos, secondPos);

      const minLen = Math.min(...possible.map((path) => path.length));
      const viable = possible.filter((path) => path.length === minLen);

      viable.forEach((path) => paths.push(path));
    }

    physicalMap.set(`${key1}-${key2}`, paths);
    physicalMap.set(
      `${key2}-${key1}`,
      paths.map((path) =>
        path.toReversed().map((p) => INVERSE[p as keyof typeof INVERSE])
      )
    );
  });
});

const robotMap = new Map<string, string[][]>();
const ROBOT_KEYS = ROBOT_KEYPAD.flat().filter((key) => key !== " ");
ROBOT_KEYS.forEach((key1) => {
  ROBOT_KEYS.forEach((key2) => {
    if (key1 === key2) return;
    if (robotMap.has(`${key1}-${key2}`)) return;

    const firstPos = ROBOT_POSITIONS.get(key1)!;
    const secondPos = ROBOT_POSITIONS.get(key2)!;

    const paths: string[][] = [];

    // Same row
    if (firstPos.i === secondPos.i) {
      const diff = secondPos.j - firstPos.j;
      if (diff > 0) {
        paths.push(Array(diff).fill(">"));
      } else {
        paths.push(Array(-diff).fill("<"));
      }
    }

    // Same column
    if (firstPos.j === secondPos.j) {
      const diff = secondPos.i - firstPos.i;
      if (diff > 0) {
        paths.push(Array(diff).fill("v"));
      } else {
        paths.push(Array(-diff).fill("^"));
      }
    }

    if (paths.length === 0) {
      const possible = findPathsDFS(firstPos, secondPos);

      const minLen = Math.min(...possible.map((path) => path.length));
      const viable = possible.filter((path) => path.length === minLen);

      viable.forEach((path) => paths.push(path));
    }

    robotMap.set(`${key1}-${key2}`, paths);
    robotMap.set(
      `${key2}-${key1}`,
      paths.map((path) =>
        path.toReversed().map((p) => INVERSE[p as keyof typeof INVERSE])
      )
    );
  });
});

function inputPhysicalCode(code: string) {
  let solutions: string[][] = [];

  let cursor = "A";
  code.split("").forEach((key) => {
    const paths = physicalMap.get(`${cursor}-${key}`)!;

    if (solutions.length === 0) {
      paths.forEach((path) => {
        solutions.push([...path, "A"]);
      });
    } else {
      const newSolutions: string[][] = [];

      solutions.forEach((solution) => {
        paths.forEach((path) => {
          newSolutions.push([...solution, ...path, "A"]);
        });
      });

      solutions = newSolutions;
    }

    cursor = key;
  });

  return solutions;
}

function inputRobotSequence(physicalSeq: string) {
  let solution: string = "";

  let cursor = "A";
  physicalSeq.split("").forEach((key) => {
    const paths = robotMap.get(`${cursor}-${key}`)!;

    if (cursor === key) {
      solution += "A";
      return;
    }

    const path = paths[0];

    if (solution.length === 0) {
      solution += path.join("") + "A";
    } else {
      solution += path.join("") + "A";
    }

    cursor = key;
  });

  return solution;
}

let sum = 0;

function robotPortal(sequence: string, level: number) {
  if (level === 0) {
    return sequence.length;
  }

  const robotSeq = inputRobotSequence(sequence);
  return robotPortal(robotSeq, level - 1);
}

codes.forEach((code) => {
  const solutions = inputPhysicalCode(code);

  let leastLen = Number.MAX_SAFE_INTEGER;

  solutions.slice(0, 5).forEach((solution) => {
    const seqLength = robotPortal(solution.join(""), 2);

    if (seqLength < leastLen) {
      leastLen = seqLength;
    }
  });

  sum += leastLen * Number(code.split("A")[0]);
});

console.log(sum);
