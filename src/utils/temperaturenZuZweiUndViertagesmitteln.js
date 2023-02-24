export const temperaturenZuZweitagesmitteln = temperaturen => temperaturen.map((el, i) => (i === 0 ? NaN : (el + temperaturen[i - 1]) / 2));

export const temperaturenZuViertagesmitteln = temperaturen =>
   temperaturen.map((el, i) => (i < 3 ? NaN : (8 * el + 4 * temperaturen[i - 1] + 2 * temperaturen[i - 2] + temperaturen[i - 3]) / 15));
