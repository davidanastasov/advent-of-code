const input = await Deno.readTextFile("./test.txt");

const matrix = input.split("\r\n").map((line) => line.split(""));

console.log(matrix);

const ELF_SYMBOL = "#";
const EMPTY_GROUND_SYMBOL = ".";

enum Direction {
  North,
  NorthWest,
  NorthEast,
  South,
  SouthWest,
  SouthEast,
  West,
  East,
}

function getAdjacentElves(matrix: string[][], x: number, y: number) {
  const adjacentElves = [];

  const north = matrix[y - 1] && matrix[y - 1][x];
  const northWest = matrix[y - 1] && matrix[y - 1][x - 1];
  const northEast = matrix[y - 1] && matrix[y - 1][x + 1];

  const south = matrix[y + 1] && matrix[y + 1][x];
  const southWest = matrix[y + 1] && matrix[y + 1][x - 1];
  const southEast = matrix[y + 1] && matrix[y + 1][x + 1];

  const west = matrix[y][x - 1];
  const east = matrix[y][x + 1];

  if (north === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.North, symbol: north });
  }

  if (northWest === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.NorthWest, symbol: northWest });
  }

  if (northEast === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.NorthEast, symbol: northEast });
  }

  if (south === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.South, symbol: south });
  }

  if (southWest === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.SouthWest, symbol: southWest });
  }

  if (southEast === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.SouthEast, symbol: southEast });
  }

  if (west === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.West, symbol: west });
  }

  if (east === ELF_SYMBOL) {
    adjacentElves.push({ direction: Direction.East, symbol: east });
  }

  return adjacentElves;
}

function performRound(roundNumber: number) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const cell = matrix[y][x];
      if (cell !== ELF_SYMBOL) {
        return;
      }

      const adjacentElves = getAdjacentElves(matrix, x, y);

      if (adjacentElves.length === 0) {
        return;
      }

      if (
        adjacentElves.every(
          (cell) =>
            cell.direction !== Direction.NorthWest &&
            cell.direction !== Direction.North &&
            cell.direction !== Direction.NorthEast
        )
      ) {
        // Move north
        matrix[y - 1][x] = ELF_SYMBOL;
      }

      if (
        adjacentElves.every(
          (cell) =>
            cell.direction !== Direction.SouthWest &&
            cell.direction !== Direction.South &&
            cell.direction !== Direction.SouthEast
        )
      ) {
        // Move south
        matrix[y + 1][x] = ELF_SYMBOL;
      }

      if (
        adjacentElves.every(
          (cell) =>
            cell.direction !== Direction.NorthWest &&
            cell.direction !== Direction.West &&
            cell.direction !== Direction.SouthWest
        )
      ) {
        // Move west
        matrix[y][x - 1] = ELF_SYMBOL;
      }

      if (
        adjacentElves.every(
          (cell) =>
            cell.direction !== Direction.NorthEast &&
            cell.direction !== Direction.East &&
            cell.direction !== Direction.SouthEast
        )
      ) {
        // Move east
        matrix[y][x + 1] = ELF_SYMBOL;
      }
    }
  }
}

let round = 0;

while (round < 1) {
  performRound(round);

  round++;
}
