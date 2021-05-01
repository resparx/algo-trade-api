import { actionsExecutor } from "../actions/actionsExecutor";
import { ruleExecutor } from "../rules/ruleExecutor";

export const executor = ({
    symbol,
    interval,
    cronInterval = '*/5 * * * * *',
    ruleAction
}) => {
    cron.schedule(cronInterval, () => {
        ruleAction.array.forEach(({rules, actions}) => {
            if(ruleExecutor(rules)){
                actionsExecutor(actions)
            }
        });
    })
}