import cron from "node-cron"
import { ruleExecutor } from "../rules/ruleExecutor";

export const executor = ({
    baseAsset,
    quoteAsset,
    limit,
    interval,
    ruleAction
}) => {
    let cronInterval = '*/5 * * * * *'
    const symbol = `${baseAsset}${quoteAsset}`
    cron.schedule(cronInterval, () => {
        ruleAction.map(({rules, actions, lookbackPeriod}) => {
            ruleExecutor({symbol, lookbackPeriod, interval, rules, actions, limit})
        });
    })
}