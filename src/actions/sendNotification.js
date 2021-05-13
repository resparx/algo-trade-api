import axios from "axios";
import { isEmpty } from "../utils/isEmpty";

export const sendNotification = ({message = ''}) => {
    if(message !== '')
    axios.post(
        process.env.discordCannyBot,
      {
        username: "Canny",
        avatar_url: "https://i.imgur.com/Kjg8wim.png",
        content: message,
      }
    ).then(()=>{}).catch(err => console.error("Canny ---> ", err.message));
  }

  