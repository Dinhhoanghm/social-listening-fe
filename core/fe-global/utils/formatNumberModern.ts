// @ts-nocheck
export function formatNumberModern(num) {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}
