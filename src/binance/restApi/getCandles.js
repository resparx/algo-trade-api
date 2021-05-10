import axios from "axios";
import config from "../../../config";

export const getCandles = async ({ symbol, interval, limit }) => {
  const data = await axios.get(`${config.apiUrl}/api/v3/klines`, {
    params: {
      symbol,
      interval,
      limit,
    },
  });
  return data;
};

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
