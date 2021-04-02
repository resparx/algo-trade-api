const express = require("express");
const cron = require("node-cron");
const serverless = require("serverless-http");
const Binance = require("node-binance-api");
const winston = require('winston');

app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'trade_stats.log', level: 'info' }),
  ],
});

const binance = new Binance().options({
  APIKEY: process.env.testKey,
  APISECRET: process.env.testSecret,
});

let firstCronRun = true;

const targetBaseAssets = [
  // {
  //   targetAsset: "BTC",
  //   frequency: "1m",
  //   maxCapital: 500,
  //   rsiSellSlab: 30,
  //   rsiBuySlab: 50,
  // },
  // {
  //   targetAsset: "WRX",
  //   frequency: "1m",
  //   maxCapital: 500,
  //   rsiSellSlab: 30,
  //   rsiBuySlab: 50,
  // },
  {
    targetAsset: "BNB",
    frequency: "1m",
    maxCapital: 500,
    rsiSellSlab: 30,
    rsiBuySlab: 50,
  },
  // {
  //   targetAsset: "BTT",
  //   frequency: "5m",
  //   maxCapital: 500,
  //   rsiSellSlab: 30,
  //   rsiBuySlab: 50,
  // },
  // {
  //   targetAsset: "ENJ",
  //   frequency: "5m",
  //   maxCapital: 500,
  //   rsiSellSlab: 30,
  //   rsiBuySlab: 50,
  // },
  // {
  //   targetAsset: "CELR",
  //   frequency: "5m",
  //   maxCapital: 500,
  //   rsiSellSlab: 30,
  //   rsiBuySlab: 50,
  // },
];
const quoteAsset = "USDT";
const periods = 150;

const rsiData = {
  totalGain: 0,
  totalLoss: 0,
};
const date = new Date();

const frequencyCheck = ({
  lastRequiredTicks,
  targetAsset,
  frequency,
  maxCapital,
  rsiSellSlab,
  rsiBuySlab,
}) => {

  if (firstCronRun) {
    const dataForRsiCalculation = lastRequiredTicks.map((tick, index) => {
      const [
        time,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        assetVolume,
        trades,
        buyBaseVolume,
        buyAssetVolume,
        ignored,
      ] = tick;

      const [
        prevTime,
        prevOpen,
        prevHigh,
        prevLow,
        prevClose,
        prevVolume,
        prevCloseTime,
        prevAssetVolume,
        prevTrades,
        prevBuyBaseVolume,
        prevBuyAssetVolume,
        prevIgnored,
      ] = lastRequiredTicks[index - 1] || [];

      const change = close - prevClose;

      if (prevClose)
        return {
          close,
          change,
          gain: change > 0 ? change : 0,
          loss: change < 0 ? Math.abs(change) : 0,
        };
    });

    // get averge value of loss and gain

    dataForRsiCalculation.forEach((data = {}, index) => {
      if (data.gain) {
        rsiData.totalGain = rsiData.totalGain + data.gain;
      }
      if (data.loss) {
        rsiData.totalLoss = rsiData.totalLoss + data.loss;
      }

      if (dataForRsiCalculation.length === index + 1) {

        rsiData.close = data.close
        rsiData.avgGain = rsiData.totalGain / index + 1;
        rsiData.avgLoss = rsiData.totalLoss / index + 1;
      }
    });

    // find the rsi value
    const rsi = 100 - 100 / (1 + rsiData.avgGain / rsiData.avgLoss);
    console.log(rsi, targetAsset,rsiData , "first rsi");
    firstCronRun = false;
  } else {
    // getting the last value
    const [
      time,
      open,
      high,
      low,
      close,
      volume,
      closeTime,
      assetVolume,
      trades,
      buyBaseVolume,
      buyAssetVolume,
      ignored,
    ] = lastRequiredTicks[periods - 1];

    // getting the last second value
    const [
      prevTime,
      prevOpen,
      prevHigh,
      prevLow,
      prevClose,
      prevVolume,
      prevCloseTime,
      prevAssetVolume,
      prevTrades,
      prevBuyBaseVolume,
      prevBuyAssetVolume,
      prevIgnored,
    ] = lastRequiredTicks[periods - 2] || [];

    const change = close - prevClose;
    const currentGain = change > 0 ? change : 0;
    const currentLoss = change < 0 ? Math.abs(change) : 0;

    rsiData.close = close
    rsiData.avgGain = (rsiData.avgGain * (periods - 1) + currentGain) / periods;
    rsiData.avgLoss = (rsiData.avgLoss * (periods - 1) + currentLoss) / periods;

    const rsi = 100 - 100 / (1 + rsiData.avgGain / rsiData.avgLoss);
    console.log(rsi, targetAsset ,rsiData, "rsi")
  }
};

const sell = () => {
  //sell logic
};

const buy = () => {
  //buy logic
};

// Schedule tasks to be run on the server.
cron.schedule("* * * * *", async () => {
  targetBaseAssets.map(
    ({ targetAsset, frequency, maxCapital, rsiSellSlab, rsiBuySlab }) =>
      binance.candlesticks(
        `${targetAsset}${quoteAsset}`,
        frequency,
        (error, ticks, symbol) => {
          const ticksLength = ticks.length;
          frequencyCheck({
            lastRequiredTicks: (ticks || []).splice(
              ticksLength - periods,
              ticksLength
            ),
            targetAsset,
            frequency,
            maxCapital,
            rsiSellSlab,
            rsiBuySlab,
          });
        }
      )
  );
});

app.listen(9000);

module.exports.handler = serverless(app);
