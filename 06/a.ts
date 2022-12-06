const input = await Deno.readTextFile("./input.txt");
const data = input.replace(/\r\n/g, "");

const packetSize = 4;

for (let i = 0; i < data.length - packetSize; i++) {
  const characters = data.slice(i, i + packetSize).split("");
  const uniqueCharacters = new Set(characters);
  const valid = uniqueCharacters.size === characters.length;

  if (valid) {
    console.log(i + packetSize);
    break;
  }
}
