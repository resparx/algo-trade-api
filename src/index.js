import express from "express"
import dotenv from "dotenv"

import coins from './coins'
import { executor } from "./core/executor"

const app = express();
dotenv.config();

coins.forEach(executor)

app.listen(9000);
