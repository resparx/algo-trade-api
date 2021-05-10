import { ENUMS } from '../ENUMS'
import { rules } from '../rules'
import { isEmpty } from '../utils/isEmpty';

const { rules: ruleENUM} = ENUMS
const { sma } = rules

export const ruleExecutor = ({symbol, lookbackPeriod, interval, limit, rules = [], actions = []}) => {
    const ruleDef = rules.map(ruleId => ruleENUM.find(rule => rule.id === ruleId));
    if(!isEmpty(ruleDef))
    ruleDef.forEach(({rule})=>{
        switch(rule){
            case 'SMA':
                sma({actions, interval, lookbackPeriod, symbol, limit});
            break;
            default:
        }
    })
}