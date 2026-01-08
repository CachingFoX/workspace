function toPercent(x) {
  return (x * 100).toFixed(3) + "%";
}
function toCurrency(x) {
  return x.toFixed(2) + " EUR";
}

export { toCurrency, toPercent };
