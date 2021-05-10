export default [
  {
    baseAsset: "BTC",
    interval: "30m",
    minGainPercent: 5,
    maxLossPercent: 5,
  },
  {
    baseAsset: "WRX",
    interval: "5m",
    minGainPercent: 5,
    maxLossPercent: 5,
  },
  {
    baseAsset: "BNB",
    interval: "15m",
    minGainPercent: 5,
    maxLossPercent: 5,
  },
  {
    baseAsset: "BTT",
    interval: "1m",
    minGainPercent: 5,
    maxLossPercent: 5,
  },
  {
    baseAsset: "VET",
    interval: "1m",
    minGainPercent: 5,
    maxLossPercent: 5,
  },
  {
    baseAsset: "DOGE",
    interval: "1m",
    minGainPercent: 5,
    maxLossPercent: 5,
  },
].map((data) => ({ ruleAction: [{
  rules: [1],
  lookbackPeriod: 20,
  actions: [1]
}], quoteAsset: "BUSD", limit: 50, ...data }));
