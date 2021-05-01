import axios from "axios";
import config from "../../../config";

export const getCandles = async ({ baseAsset, quoteAsset, interval, limit }) =>
  await axios.get(`${config.apiUrl}/api/v3/klines`, {
    params: {
      symbol: `${baseAsset}${quoteAsset}`,
      interval: interval,
      limit: limit,
    },
  });

/**
 * candle entity
 */

// const [
//   openTime,
//   open,
//   high,
//   low,
//   close,
//   volume,
//   closeTime,
//   quoteAssetVolume,
//   numberOfTrades,
//   takerBuyBaseAssetVol,
//   takerBuyQuoteAssetVol,
//   ignore,
// ] = kline;
