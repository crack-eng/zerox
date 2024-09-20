export const rate = async (base: string, quote: "kzt"): Promise<number> => {
  const res = await fetch(`http://localhost:8080/rates/${base}/quote`);

  const rate = await res.text();

  return parseFloat(rate);
};
