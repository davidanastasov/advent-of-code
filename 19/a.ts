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

const cache: { [key: string]: number }[] = [];

function canAffordRobot(resources: Cost, cost: Cost): boolean {
  return (
    resources.ore >= cost.ore &&
    resources.clay >= cost.clay &&
    resources.obsidian >= cost.obsidian &&
    resources.geode >= cost.geode
  );
}

function hasRobotSpace(robotCount: number, robotCost: Cost): boolean {
  const maxRobotCount = Object.values(robotCost).reduce((a, b) => a + b, 0);
  return robotCount < maxRobotCount;
}

function findBestCombinationRecursively(
  blueprint: Blueprint,
  resources: Cost,
  robots: Cost,
  currentMinute: number
) {
  if (currentMinute > 24) {
    return resources.obsidian;
  }

  // console.log(`Minute ${currentMinute}:`);

  const key = JSON.stringify({
    id: blueprint.id,
    resources,
    robots,
    currentMinute,
  });
  if (key in cache) {
    return cache[key];
  }

  // Collect resources
  resources.ore += robots.ore;
  // if (robots.ore > 0) console.log(`Collected ${robots.ore} ore`);

  resources.clay += robots.clay;
  // if (robots.clay > 0) console.log(`Collected ${robots.clay} clay`);

  resources.obsidian += robots.obsidian;
  // if (robots.obsidian > 0) console.log(`Collected ${robots.obsidian} obsidian`);

  resources.geode += robots.geode;
  // if (robots.geode > 0) console.log(`Collected ${robots.geode} geode`);

  // Build robots

  let mostGeodeCollected = 0;

  // Don't do anything this turn
  mostGeodeCollected = findBestCombinationRecursively(
    blueprint,
    resources,
    robots,
    currentMinute + 1
  );

  if (currentMinute === 1) console.log("Best if waiting", mostGeodeCollected);

  // // Buy a geode robot
  // if (
  //   canAffordRobot(resources, blueprint.geodeRobotCost) &&
  //   hasRobotSpace(robots.geode, blueprint.geodeRobotCost)
  // ) {
  //   const modified = { ...resources };
  //   Object.keys(modified).forEach(
  //     (key) => (modified[key] -= blueprint.geodeRobotCost[key])
  //   );

  //   const option = findBestCombinationRecursively(
  //     blueprint,
  //     modified,
  //     { ...robots, geode: robots.geode + 1 },
  //     currentMinute + 1
  //   );

  //   if (option > mostGeodeCollected) {
  //     mostGeodeCollected = option;
  //     // console.log(`Built a geode robot`);
  //   }
  // }

  // Buy an obsidian robot
  if (
    canAffordRobot(resources, blueprint.obsidianRobotCost) &&
    hasRobotSpace(robots.obsidian, blueprint.obsidianRobotCost)
  ) {
    const modified = { ...resources };
    Object.keys(modified).forEach(
      (key) => (modified[key] -= blueprint.obsidianRobotCost[key])
    );

    const option = findBestCombinationRecursively(
      blueprint,
      modified,
      { ...robots, obsidian: robots.obsidian + 1 },
      currentMinute + 1
    );

    console.log("Best if buying obsidian", option, mostGeodeCollected);
    // console.log(robots);

    if (option > mostGeodeCollected) {
      mostGeodeCollected = option;
      // console.log(`Built an obsidian robot`);
    }
  }

  // Buy a clay robot
  if (
    canAffordRobot(resources, blueprint.clayRobotCost) &&
    hasRobotSpace(robots.clay, blueprint.clayRobotCost)
  ) {
    const modified = { ...resources };
    Object.keys(modified).forEach(
      (key) => (modified[key] -= blueprint.clayRobotCost[key])
    );

    const option = findBestCombinationRecursively(
      blueprint,
      modified,
      { ...robots, clay: robots.clay + 1 },
      currentMinute + 1
    );

    if (option > mostGeodeCollected) {
      mostGeodeCollected = option;
      // console.log(`Built a clay robot`);
    }
  }

  // Buy a ore robot
  if (
    canAffordRobot(resources, blueprint.oreRobotCost) &&
    hasRobotSpace(robots.ore, blueprint.oreRobotCost)
  ) {
    const modified = { ...resources };
    Object.keys(modified).forEach(
      (key) => (modified[key] -= blueprint.oreRobotCost[key])
    );

    const option = findBestCombinationRecursively(
      blueprint,
      modified,
      { ...robots, ore: robots.ore + 1 },
      currentMinute + 1
    );

    if (option > mostGeodeCollected) {
      mostGeodeCollected = option;
      // console.log(`Built an ore robot`);
    }
  }

  // console.log(mostGeodeCollected);

  cache[key] = mostGeodeCollected;

  return mostGeodeCollected;
}

function calculateBlueprintQualityLevel(blueprint: Blueprint) {
  console.log(`============= Blueprint ${blueprint.id} =============`);

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

  const maxGeodeMined = findBestCombinationRecursively(
    blueprint,
    resources,
    robots,
    1
  );

  console.log("Max", maxGeodeMined);

  return maxGeodeMined;
}

const scores = blueprints.map((blueprint) => ({
  id: blueprint.id,
  score: calculateBlueprintQualityLevel(blueprint),
}));

console.log(scores);
