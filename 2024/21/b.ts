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

const physicalMap = new Map<string, string[]>();

function findPathsDFS(
  keypad: string[][],
  start: Position,
  target: Position,
  pathMap: Set<string> = new Set()
) {
  if (start.i === target.i && start.j === target.j) {
    return [];
  }

  const paths: { dir: string; position: Position }[][] = [];

  const directions = [
    { i: 1, j: 0, dir: "v" },
    { i: -1, j: 0, dir: "^" },
    { i: 0, j: 1, dir: ">" },
    { i: 0, j: -1, dir: "<" },
  ];

  for (const dir of directions) {
    const newPos: Position = {
      i: start.i + dir.i,
      j: start.j + dir.j,
    };

    if (
      newPos.i < 0 ||
      newPos.i >= keypad.length ||
      newPos.j < 0 ||
      newPos.j >= keypad[newPos.i].length
    )
      continue;

    if (keypad[newPos.i][newPos.j] === " ") {
      continue;
    }

    const path = new Set<string>(pathMap);

    if (path.has(keypad[newPos.i][newPos.j])) {
      continue;
    }

    path.add(keypad[newPos.i][newPos.j]);

    const newMap = findPathsDFS(keypad, newPos, target, path);

    newMap.forEach((map) => {
      paths.push([{ dir: dir.dir, position: newPos }, ...map]);
    });

    if (newMap.length === 0) {
      paths.push([{ dir: dir.dir, position: newPos }]);
    }
  }

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
      const possible = findPathsDFS(PHYSICAL_KEYPAD, firstPos, secondPos)
        .filter(
          (option) =>
            option.at(-1)?.position.i === secondPos.i &&
            option.at(-1)?.position.j === secondPos.j
        )
        .map((option) => option.map((o) => o.dir));

      const minLen = Math.min(...possible.map((path) => path.length));
      const viable = possible.filter((path) => path.length === minLen);

      viable.forEach((path) => paths.push(path));
    }

    physicalMap.set(
      `${key1}-${key2}`,
      paths.map((path) => path.join(""))
    );
    physicalMap.set(
      `${key2}-${key1}`,
      paths.map((path) =>
        path
          .toReversed()
          .map((p) => INVERSE[p as keyof typeof INVERSE])
          .join("")
      )
    );
  });
});

const robotMap = new Map<string, string[]>();
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
      const possible = findPathsDFS(ROBOT_KEYPAD, firstPos, secondPos)
        .filter(
          (option) =>
            option.at(-1)?.position.i === secondPos.i &&
            option.at(-1)?.position.j === secondPos.j
        )
        .map((option) => option.map((o) => o.dir));

      const minLen = Math.min(...possible.map((path) => path.length));
      const viable = possible.filter((path) => path.length === minLen);

      viable.forEach((path) => paths.push(path));
    }

    robotMap.set(
      `${key1}-${key2}`,
      paths.map((path) => path.join(""))
    );
    robotMap.set(
      `${key2}-${key1}`,
      paths.map((path) =>
        path
          .toReversed()
          .map((p) => INVERSE[p as keyof typeof INVERSE])
          .join("")
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

const cache = new Map<string, number>();

function robotPortal(sequence: string, level: number) {
  if (level === 0) {
    return sequence.length;
  }

  const cacheKey = `${level}-${sequence}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  let count = 0;

  let cursor = "A";
  sequence.split("").forEach((key) => {
    const paths = robotMap.get(`${cursor}-${key}`)!;

    const pathLengths = paths?.map((path) =>
      robotPortal(path + "A", level - 1)
    );

    if (pathLengths?.length > 0) {
      const min = pathLengths?.reduce((acc, len) => (len < acc ? len : acc));
      count += min;
    } else {
      count++;
    }

    cursor = key;
  });

  cache.set(cacheKey, count);

  return count;
}

let sum = 0;

codes.forEach((code) => {
  const solutions = inputPhysicalCode(code);

  const solutionLens = solutions.map((solution) =>
    robotPortal(solution.join(""), 25)
  );

  const minLen = solutionLens.reduce((acc, len) => (len < acc ? len : acc));
  sum += minLen * Number(code.split("A")[0]);
});

console.log(sum);
