const input = await Deno.readTextFile("./input.txt");

const symbols = {
  enemy: {
    rock: "A",
    paper: "B",
    scissors: "C",
  },
  outcome: {
    lose: "X",
    draw: "Y",
    win: "Z",
  },
};

const scores = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const outcomeScores = {
  lost: 0,
  draw: 3,
  win: 6,
};

let sum = 0;

const rounds = input.split("\r\n");
rounds.forEach((round) => {
  const [enemy, outcome] = round.split(" ");

  if (!outcome || !enemy) {
    return;
  }

  if (enemy === symbols.enemy.rock && outcome === symbols.outcome.lose) {
    sum += scores.scissors;
    sum += outcomeScores.lost;
  } else if (enemy === symbols.enemy.rock && outcome === symbols.outcome.draw) {
    sum += scores.rock;
    sum += outcomeScores.draw;
  } else if (enemy === symbols.enemy.rock && outcome === symbols.outcome.win) {
    sum += scores.paper;
    sum += outcomeScores.win;
  } else if (
    enemy === symbols.enemy.paper &&
    outcome === symbols.outcome.lose
  ) {
    sum += scores.rock;
    sum += outcomeScores.lost;
  } else if (
    enemy === symbols.enemy.paper &&
    outcome === symbols.outcome.draw
  ) {
    sum += scores.paper;
    sum += outcomeScores.draw;
  } else if (enemy === symbols.enemy.paper && outcome === symbols.outcome.win) {
    sum += scores.scissors;
    sum += outcomeScores.win;
  } else if (
    enemy === symbols.enemy.scissors &&
    outcome === symbols.outcome.lose
  ) {
    sum += scores.paper;
    sum += outcomeScores.lost;
  } else if (
    enemy === symbols.enemy.scissors &&
    outcome === symbols.outcome.draw
  ) {
    sum += scores.scissors;
    sum += outcomeScores.draw;
  } else if (
    enemy === symbols.enemy.scissors &&
    outcome === symbols.outcome.win
  ) {
    sum += scores.rock;
    sum += outcomeScores.win;
  }
});

console.log(sum);
