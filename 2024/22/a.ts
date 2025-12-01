const input = await Deno.readTextFile("./input.txt");
const numbers = input.split("\r\n").map((line) => BigInt(line.trim()));

function mix(secret: bigint, x: bigint) {
  return x ^ secret;
}

function prune(secret: bigint) {
  return secret % 16777216n;
}

function evolveSecret(secret: bigint) {
  secret = mix(secret, secret * 64n);
  secret = prune(secret);

  secret = mix(secret, secret / 32n);
  secret = prune(secret);

  secret = mix(secret, secret * 2048n);
  secret = prune(secret);

  return secret;
}

let sum = 0n;

for (const number of numbers) {
  let secret = number;

  for (let i = 0; i < 2000; i++) {
    secret = evolveSecret(secret);
  }

  sum += secret;
}

console.log(sum.toString());
