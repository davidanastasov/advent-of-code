const input = await Deno.readTextFile("./input.txt");
const lines = input.split("\n");

const output = `
<svg width="512" height="512" viewBox="0 0 100000 100000" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${lines.join(" ")}"
        stroke="black" fill="white" stroke-width="20"/>
</svg>
`;

Deno.writeTextFileSync("./output.svg", output);
