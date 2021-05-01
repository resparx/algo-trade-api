import axios from "axios";
import { isEmpty } from "../utils/isEmpty";

export const sendNotification = ({messageData}) => {
    if(!isEmpty(messageData))
    axios.post(
        process.env.discordCannyBot,
      {
        username: "Canny",
        avatar_url: "https://i.imgur.com/Kjg8wim.png",
        content: `TYPE: ${notificationData.type}:- \n MESSAGE: test`,
      }
    ).then(()=>{}).catch(err => console.error("Canny ---> ", err.message));
  }

  