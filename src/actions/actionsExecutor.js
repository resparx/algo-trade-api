import { ENUMS } from "../ENUMS"
import { isEmpty } from "../utils/isEmpty";
import { sendNotification } from "./sendNotification";


const { actions: actionENUM} = ENUMS

export const actionsExecutor = ({actions, message}) => {
    const actionDef = actions.map(actionId => actionENUM.find(action => action.id === actionId));
    console.log(actionDef,"er")
    if(!isEmpty(actionDef))
    actionDef.forEach(({action}) => {
        switch(action){
            case 'NOTIFICATION':
                sendNotification({message});
            break;
            default:
        }
    })
}