import axios from "axios";
import config from "../../../config";

export const getPrice = async ({ symbol }) => {
  const data = await axios.get(`${config.apiUrl}/api/v3/ticker/price`, {
    params: {
      symbol
    },
  });
  return data;
};