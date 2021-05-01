import express from "express"
import  axios from "axios"
import dotenv from "dotenv"
import cron from "node-cron"

import coins from './coins'
import { isEmpty } from "./utils/isEmpty"
import { executor } from "./core/executor"

const app = express();
dotenv.config();

coins.forEach(executor)

app.listen(9000);
