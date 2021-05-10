import { resolve } from "path";

import { getCandles } from "../binance/restApi/getCandles";
import { actionsExecutor } from "../actions/actionsExecutor";
import pyRunner from "../core/pyRunner";

const smaPath = resolve('/home/resparx/Documents/algo-trade-api/src/indicators/sma');


export const sma = async ({
  actions,
  interval,
  lookbackPeriod = 20,
  symbol,
  limit
}) => {
  const onSMAdata = (data) => {
    console.log( data.toString().split(', '));
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
      args: [
        arg1.join(","),
        lookbackPeriod,
      ],
      onData: onSMAdata,
    });
  });
};
