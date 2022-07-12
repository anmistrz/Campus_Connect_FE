import axios from "axios";
import { rootPath } from "./Config";

const Put = async (path, data) => {
  try {
    const res = await axios.put(`${rootPath}${path}`, data);
    return res;
  } catch (error) {
    console.log("error PUT :", error.response.data);
    throw error;
  }
};

export default Put;
