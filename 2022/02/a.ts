const input = await Deno.readTextFile("./input.txt");

const symbols = {
  enemy: {
    rock: "A",
    paper: "B",
    scissors: "C",
  },
  player: {
    rock: "X",
    paper: "Y",
    scissors: "Z",
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
  const [enemy, player] = round.split(" ");

  if (!player || !enemy) {
    return;
  }

  if (enemy === symbols.enemy.rock && player === symbols.player.rock) {
    sum += scores.rock;
    sum += outcomeScores.draw;
  } else if (enemy === symbols.enemy.rock && player === symbols.player.paper) {
    sum += scores.paper;
    sum += outcomeScores.win;
  } else if (
    enemy === symbols.enemy.rock &&
    player === symbols.player.scissors
  ) {
    sum += scores.scissors;
    sum += outcomeScores.lost;
  } else if (enemy === symbols.enemy.paper && player === symbols.player.rock) {
    sum += scores.rock;
    sum += outcomeScores.lost;
  } else if (enemy === symbols.enemy.paper && player === symbols.player.paper) {
    sum += scores.paper;
    sum += outcomeScores.draw;
  } else if (
    enemy === symbols.enemy.paper &&
    player === symbols.player.scissors
  ) {
    sum += scores.scissors;
    sum += outcomeScores.win;
  } else if (
    enemy === symbols.enemy.scissors &&
    player === symbols.player.rock
  ) {
    sum += scores.rock;
    sum += outcomeScores.win;
  } else if (
    enemy === symbols.enemy.scissors &&
    player === symbols.player.paper
  ) {
    sum += scores.paper;
    sum += outcomeScores.lost;
  } else if (
    enemy === symbols.enemy.scissors &&
    player === symbols.player.scissors
  ) {
    sum += scores.scissors;
    sum += outcomeScores.draw;
  }
});

console.log(sum);
