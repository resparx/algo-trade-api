const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const winston = require("winston");
var cron = require("node-cron");

app = express();
dotenv.config();


var notificationData = {test: 'test'}


const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "trade_stats.log", level: "info" }),
  ],
});

let firstCronRun = true;

const quoteAsset = "USDT";

const targetBaseAssets = [
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
].map((data) => ({ ...data, limit: 4 }));



const sendNotification = () => {
  if(Object.keys(notificationData).length)
  axios.post(
    "https://discordapp.com/api/webhooks/833203583368298596/PV5v4sKpXXXqW7WoVN5SRwg5eMx97UmG7sS9If1cMkgJ7kwdOHjvzAiYGEBk5ODU0Fpr",
    {
      username: "Canny",
      avatar_url: "https://i.imgur.com/Kjg8wim.png",
      content: `TYPE: ${notificationData.type}:- \n MESSAGE: test`,
    }
  ).then(()=>{}).catch(err => console.error("Canny ---> ", err.message));
}

const verifyNotificationRules = ({data}) => {
  console.log(Object.keys(data),"test")

  const continuousFluctuation = data.reduce((acc, cur, index, arr)=>{
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
  ] = cur

  const diff = close - open;
  const diffInPercentage = (diff / open) * 100
  if(!Object.keys(cur)){
    if(diff > 0){
      return {
        fluctuationType: 'POSITIVE',
        diffInPercemtage: `${diffInPercentage}%`
      }
    } else {
      return {
        fluctuationType: 'NEGATIVE',
        diffInPercemtage: `- ${diffInPercentage}%`
      }
    }
  } else {
    if(cur.fluctuationType === 'POSITIVE' && diff > 0){
      return {
        fluctuationType: 'POSITIVE',
        diffInPercemtage: `${diffInPercentage}%`
      }
    }
    else if(cur.fluctuationType === 'POSITIVE' && diff < 0){
      return {}
    }
    else if(cur.fluctuationType === 'NEGATIVE' && diff < 0){
      return {
        fluctuationType: 'NEGATIVE',
        diffInPercemtage: `${diffInPercentage}%`
      }
    }
    else if(cur.fluctuationType === 'NEGATIVE' && diff > 0){
      return {}
    }
  }
  },{})

  if(Object.keys(continuousFluctuation)){
    sendNotification({
      type: 'CONTINUES FLUCTUATIONS'
    })
  }

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

  };

targetBaseAssets.forEach((asset) => {
  // console.log(`${quoteAsset}${asset.baseAsset}`,"`${quoteAsset}${asset.baseAsset}`")
  cron.schedule("*/5 * * * * *", () => {
    axios
      .get("https://api1.binance.com/api/v3/klines", {
        params: {
          symbol: `${asset.baseAsset}${quoteAsset}`,
          interval: asset.interval,
          limit: asset.limit,
        },
      })
      .then(verifyNotificationRules)
      .catch((err) => console.error(err.message));
  });
});

app.listen(9000);
