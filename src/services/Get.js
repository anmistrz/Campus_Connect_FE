import axios from "axios";
import { rootPath } from "./Config";

const Get = async (path) => {
  try {
    const res = await axios.get(`${rootPath}${path}`);
    return res;
  } catch (error) {
    console.log("Error GET:", error.response.data);
    throw error;
  }
};

export default Get;
