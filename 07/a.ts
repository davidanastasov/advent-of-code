const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\r\n");

const parseCommand = (line: string) => {
  const fullCommand = line.substring(2, line.length);

  const commandCategory = fullCommand.split(" ")[0];
  const commandArgs = fullCommand.split(" ").slice(1);

  return { category: commandCategory, args: commandArgs };
};

const getCurrentDirectoryNode = () => {
  let node = directoryTree;

  currentPath.forEach((path) => {
    if (!node[path]) {
      node[path] = {};
    }

    node = node[path];
  });

  return node;
};

const directoryTree: { [key: string]: any } = {};
let currentPath = ["/"];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (!line.startsWith("$")) {
    console.error("Not a command:", line);
  }

  const command = parseCommand(line);
  switch (command.category) {
    case "ls": {
      let cwd = [...currentPath];

      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];

        if (nextLine.startsWith("$")) {
          break;
        }

        const node = getCurrentDirectoryNode();

        if (nextLine.startsWith("dir")) {
          cwd = [...currentPath];
          const dirName = nextLine.slice(4, nextLine.length);
          cwd.push(dirName);
        } else {
          const [fileSize, fileName] = nextLine.split(" ");
          node[fileName] = parseInt(fileSize);
        }

        i = j;
      }

      break;
    }
    case "cd": {
      if (command.args[0] === "..") {
        currentPath.pop();
      } else if (command.args[0] === "/") {
        currentPath = ["/"];
      } else {
        currentPath.push(command.args[0]);
      }

      getCurrentDirectoryNode();

      break;
    }
  }
}

const countDirectorySize = (node: { [key: string]: any }, path: string[]) => {
  let size = 0;

  for (const key in node) {
    if (typeof node[key] === "number") {
      size += node[key];
    } else {
      const directorySize = countDirectorySize(node[key], [...path, key]);
      size += directorySize;
      directorySizes.push({ path: [...path, key], size: directorySize });
    }
  }

  return size;
};

const directorySizes: { path: string[]; size: number }[] = [];
directorySizes.push({
  path: ["/"],
  size: countDirectorySize(directoryTree["/"], ["/"]),
});

const validDirectories = directorySizes.filter((dir) => dir.size <= 100000);
const sumOfSizes = validDirectories.reduce((acc, dir) => acc + dir.size, 0);
console.log(sumOfSizes);
