import { resolve } from "path";

import { getCandles } from "../binance/restApi/getCandles";
import { actionsExecutor } from "../actions/actionsExecutor";
import pyRunner from "../core/pyRunner";
import logger from "../log/config";
import { redisClient } from "../redis";
import { getPrice } from "../binance/restApi/getPrice";
const smaPath = resolve(
  "/home/resparx/Documents/algo-trade-api/src/indicators/sma"
);

export const sma = async ({
  actions,
  interval,
  lookbackPeriod = 20,
  symbol,
  limit,
}) => {

  const onSMAdata = async (data) => {
    const sma = data.toString().split(", ");
    const { data: { price } = {} } = await getPrice({ symbol });
    if (sma[sma.length - 1] > sma[sma.length - 2]) {
      redisClient.get(`${symbol}_SMA`, (err, value) => {
        if (value !== "UP") {
          redisClient.set(`${symbol}_SMA`, "UP");
          actionsExecutor({
            actions,
            message: `Cur: ${symbol}--- Price: ${price}--- Action: BUY`,
          });
        }
      });
    } else if (sma[sma.length - 1] < sma[sma.length - 2]) {
      redisClient.get(`${symbol}_SMA`, (err, value) => {
        if (value !== "DOWN") {
          redisClient.set(`${symbol}_SMA`, "DOWN");
          actionsExecutor({
            actions,
            message: `Cur: ${symbol}--- Price: ${price}--- Action: SELL`,
          });
        }
      });
    }
    logger.info("message");
  };

  getCandles({ symbol, interval, limit }).then(({ data }) => {
    const arg1 = data.map((kline) => {
      const [
        openTime,
        open,
        high,
        low,
        close,
        volume,
        closeTime,
        quoteAssetVolume,
        numberOfTrades,
        takerBuyBaseAssetVol,
        takerBuyQuoteAssetVol,
        ignore,
      ] = kline;
      return close;
    });

    pyRunner({
      path: smaPath,
      args: [arg1.join(","), lookbackPeriod],
      onData: onSMAdata,
    });
  });
};
