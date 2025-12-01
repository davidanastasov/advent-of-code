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

function calculatePrice(secret: bigint, iterations: number) {
  const price_diff: bigint[][] = [];

  let last_price = secret % 10n;

  for (let i = 0; i < iterations; i++) {
    secret = evolveSecret(secret);

    const price = secret % 10n;

    price_diff.push([price, price - last_price]);
    last_price = price;
  }

  return { secret, price_diff };
}

const sellers: bigint[][][] = [];
const window_counts: Record<string, number> = {};

for (const number of numbers) {
  const { price_diff: history } = calculatePrice(number, 2000);

  sellers.push(history);

  for (let i = 0; i < history.length - 3; i++) {
    const items = history.slice(i, i + 4);

    const diffs = items.map((x) => x[1]);

    const window_str = diffs.toString();

    if (!(window_str in window_counts)) {
      window_counts[window_str] = 0;
    }

    window_counts[window_str] += 1;
  }
}

const sorted_windows = Object.entries(window_counts).sort(
  (a, b) => b[1] - a[1]
);
const top_100_windows = sorted_windows.slice(0, 100).map((x) => x[0]);

const sold = [];

for (const history of sellers) {
  const gains: { window: string; price: bigint }[] = [];

  for (const window of top_100_windows) {
    for (let i = 0; i < history.length - 3; i++) {
      const diffs = history.slice(i, i + 4).map((x) => x[1]);
      const window_str = diffs.toString();

      if (window === window_str) {
        const price = history[i + 3][0];
        gains.push({ window, price });
        break;
      }
    }
  }

  if (gains.length > 0) {
    sold.push(gains);
  }
}

const sum_sold_by_window: Record<string, bigint> = {};

for (const sold_window of sold) {
  for (const { window, price } of sold_window) {
    if (!(window in sum_sold_by_window)) {
      sum_sold_by_window[window] = 0n;
    }

    sum_sold_by_window[window] += price;
  }
}

const max_window = Object.entries(sum_sold_by_window).reduce(
  (max, [window, price]) => (price > max[1] ? [window, price] : max),
  ["", 0n]
);
console.log(max_window[0], max_window[1].toString());
