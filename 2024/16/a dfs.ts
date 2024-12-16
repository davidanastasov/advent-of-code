const START = "S";
const END = "E";
const WALL = "#";

type Direction = "up" | "down" | "left" | "right";
type Position = { i: number; j: number };
type Path = { score: number; finished: boolean; trail: Set<string> };

const input = await Deno.readTextFile("./input.txt");
const grid = input.split("\r\n").map((row) => row.split(""));

// const test = `###############
// #.......#....E#
// #.#.###.#.###.#
// #.....#.#...#.#
// #.###.#####.#.#
// #.#.#.......#.#
// #.#.#####.###.#
// #...........#.#
// ###.#.#####.#.#
// #...#.....#.#.#
// #.#.#.###.#.#.#
// #.....#...#.#.#
// #.###.#.#.#.#.#
// #S..#.....#...#
// ###############`;
// const grid = test.split("\n").map((row) => row.split(""));

function find(grid: string[][], type: typeof START | typeof END): Position {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === type) {
        return { i, j };
      }
    }
  }
  return { i: -1, j: -1 };
}

const startPosition = find(grid, START);

function getDirectionDelta(direction: Direction) {
  const di = direction == "up" ? -1 : direction == "down" ? 1 : 0;
  const dj = direction == "left" ? -1 : direction == "right" ? 1 : 0;

  return [di, dj];
}

const directionDeltas = ["up", "down", "left", "right"].reduce((acc, dir) => {
  acc[dir] = getDirectionDelta(dir as Direction);
  return acc;
}, {} as Record<string, number[]>);

function getShortestPath(
  grid: string[][],
  current: Position,
  dir: Direction,
  path: Set<string> = new Set()
): Path {
  if (path.has(`${current.i},${current.j}`)) {
    return { score: 0, finished: false, trail: path };
  }

  if (grid[current.i][current.j] === WALL) {
    return { score: 0, finished: false, trail: path };
  }

  if (grid[current.i][current.j] === END) {
    return { score: 0, finished: true, trail: path };
  }

  path.add(`${current.i},${current.j}`);

  //   const save = grid[current.i][current.j];
  //   grid[current.i][current.j] = START;
  //   console.log(grid.map((row) => row.join("")).join("\n"));
  //   console.log();
  //   grid[current.i][current.j] = save;

  const paths: Path[] = [];

  const possibleMoves =
    dir === "up"
      ? ["up", "left", "right"]
      : dir === "down"
      ? ["down", "left", "right"]
      : dir === "left"
      ? ["up", "down", "left"]
      : ["up", "down", "right"];

  if (possibleMoves.includes("up")) {
    const forwardPath = new Set(path);
    let forwardScore = dir === "up" ? 1 : 1000 + 1;
    const [di, dj] = directionDeltas["up"];
    const pathForward = getShortestPath(
      grid,
      { i: current.i + di, j: current.j + dj },
      "up",
      forwardPath
    );
    forwardScore += pathForward.score;

    paths.push({
      score: forwardScore,
      finished: pathForward.finished,
      trail: pathForward.trail,
    });
  }

  if (possibleMoves.includes("left")) {
    const leftPath = new Set(path);
    let leftScore = dir === "left" ? 1 : 1000 + 1;
    const [di, dj] = directionDeltas["left"];
    const pathLeft = getShortestPath(
      grid,
      { i: current.i + di, j: current.j + dj },
      "left",
      leftPath
    );
    leftScore += pathLeft.score;

    paths.push({
      score: leftScore,
      finished: pathLeft.finished,
      trail: pathLeft.trail,
    });
  }

  if (possibleMoves.includes("right")) {
    const rightPath = new Set(path);
    let rightScore = dir === "right" ? 1 : 1000 + 1;
    const [di, dj] = directionDeltas["right"];
    const pathRight = getShortestPath(
      grid,
      { i: current.i + di, j: current.j + dj },
      "right",
      rightPath
    );
    rightScore += pathRight.score;

    paths.push({
      score: rightScore,
      finished: pathRight.finished,
      trail: pathRight.trail,
    });
  }

  if (possibleMoves.includes("down")) {
    const downPath = new Set(path);
    let downScore = dir === "down" ? 1 : 1000 + 1;
    const [di, dj] = directionDeltas["down"];
    const pathDown = getShortestPath(
      grid,
      { i: current.i + di, j: current.j + dj },
      "down",
      downPath
    );
    downScore += pathDown.score;

    paths.push({
      score: downScore,
      finished: pathDown.finished,
      trail: pathDown.trail,
    });
  }

  const finishedPaths = paths.filter((path) => path.finished);
  const minPath =
    finishedPaths.length > 0
      ? finishedPaths.reduce((acc, path) => {
          if (path.score < acc.score) {
            return path;
          }
          return acc;
        })
      : { score: 0, finished: false, trail: new Set<string>() };

  //   console.log(finishedPaths);

  return minPath;
}

const minPath = getShortestPath(grid, startPosition, "right");
console.log(minPath.score);
