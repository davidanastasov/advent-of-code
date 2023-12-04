const input = await Deno.readTextFile("./test.txt");
const blueprintsInput = input.split("\r\n");

type Resource = "ore" | "clay" | "obsidian" | "geode";

type Cost = Record<Resource, number>;

interface Blueprint {
  id: number;
  oreRobotCost: Cost;
  clayRobotCost: Cost;
  obsidianRobotCost: Cost;
  geodeRobotCost: Cost;
}

const blueprints: Blueprint[] = [];

function parseResourceCost(resourceString: string, pattern: RegExp): number {
  const [match] = resourceString.match(pattern) || [];
  if (!match) return 0;

  return parseInt(match.split(" ")[0]);
}

function parseBlueprintCost(blueprintContents: string): Cost {
  return {
    ore: parseResourceCost(blueprintContents, /\d+\ ore/g),
    clay: parseResourceCost(blueprintContents, /\d+\ clay/g),
    obsidian: parseResourceCost(blueprintContents, /\d+\ obsidian/g),
    geode: parseResourceCost(blueprintContents, /\d+\ geode/g),
  };
}

blueprintsInput.forEach((blueprintInput) => {
  const types = blueprintInput.split(/(\:|\.)/g);

  blueprints.push({
    id: parseInt(types[0].match(/\d+/g)![0]),
    oreRobotCost: parseBlueprintCost(types[2]),
    clayRobotCost: parseBlueprintCost(types[4]),
    obsidianRobotCost: parseBlueprintCost(types[6]),
    geodeRobotCost: parseBlueprintCost(types[8]),
  });
});

console.log(blueprints);

function canAffordRobot(resources: Cost, cost: Cost): boolean {
  return (
    resources.ore >= cost.ore &&
    resources.clay >= cost.clay &&
    resources.obsidian >= cost.obsidian &&
    resources.geode >= cost.geode
  );
}

function calculateBlueprintQualityLevel(blueprint: Blueprint) {
  console.log(`============= Blueprint ${blueprint.id} =============`);

  const combinations: { robotSequence: string; score: number }[] = [];

  while (combinations.length < 100) {
    const resources: Record<Resource, number> = {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    };

    const robots: Record<Resource, number> = {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    };

    let currentMinute = 1;

    let robotSequence = "";

    while (currentMinute <= 24) {
      const newRobots: Record<Resource, number> = {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geode: 0,
      };

      console.log(`Minute ${currentMinute}:`);

      // Build robots
      if (
        canAffordRobot(resources, blueprint.geodeRobotCost) &&
        !combinations.some((combination) =>
          combination.robotSequence.startsWith(robotSequence + "4")
        )
      ) {
        newRobots.geode++;

        Object.keys(resources).forEach((key) => {
          resources[key] -= blueprint.geodeRobotCost[key];
        });

        console.log(`Built a geode robot`);

        robotSequence += "4";
      } else if (
        canAffordRobot(resources, blueprint.obsidianRobotCost) &&
        !combinations.some((combination) =>
          combination.robotSequence.startsWith(robotSequence + "3")
        )
      ) {
        newRobots.obsidian++;
        Object.keys(resources).forEach((key) => {
          resources[key] -= blueprint.obsidianRobotCost[key];
        });
        console.log(`Built an obsidian robot`);

        robotSequence += "3";
      } else if (
        canAffordRobot(resources, blueprint.clayRobotCost) &&
        !combinations.some((combination) =>
          combination.robotSequence.startsWith(robotSequence + "2")
        )
      ) {
        newRobots.clay++;
        Object.keys(resources).forEach((key) => {
          resources[key] -= blueprint.clayRobotCost[key];
        });
        console.log(`Built a clay robot`);

        robotSequence += "2";
      } else if (
        canAffordRobot(resources, blueprint.oreRobotCost) &&
        !combinations.some((combination) =>
          combination.robotSequence.startsWith(robotSequence + "1")
        )
      ) {
        newRobots.ore++;
        Object.keys(resources).forEach((key) => {
          resources[key] -= blueprint.oreRobotCost[key];
        });

        console.log(`Built an ore robot`);

        robotSequence += "1";
      } else {
        robotSequence += "0";
      }

      // Collect resources
      resources.ore += robots.ore;
      if (robots.ore > 0) console.log(`Collected ${robots.ore} ore`);

      resources.clay += robots.clay;
      if (robots.clay > 0) console.log(`Collected ${robots.clay} clay`);

      resources.obsidian += robots.obsidian;
      if (robots.obsidian > 0)
        console.log(`Collected ${robots.obsidian} obsidian`);

      resources.geode += robots.geode;
      if (robots.geode > 0) console.log(`Collected ${robots.geode} geode`);

      robots.ore += newRobots.ore;
      robots.clay += newRobots.clay;
      robots.obsidian += newRobots.obsidian;
      robots.geode += newRobots.geode;

      currentMinute++;

      console.log();
    }

    console.log("Resources:", resources);
    console.log("Robots:", robots);

    combinations.push({
      robotSequence,
      score: resources.geode,
    });
  }

  console.log(combinations);

  const bestCombination = combinations.reduce(
    (best, combination) => {
      if (combination.score > best.score) return combination;
      return best;
    },
    { robotSequence: "", score: 0 }
  );

  console.log(bestCombination);

  return bestCombination.score;
}

const scores = blueprints.map((blueprint) => ({
  id: blueprint.id,
  score: calculateBlueprintQualityLevel(blueprint),
}));

console.log(scores);
