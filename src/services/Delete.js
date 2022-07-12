import axios from "axios";
import { rootPath } from "./Config";

const Delete = async (path, data) => {
  try {
    const res = await axios.delete(`${rootPath}${path}`, data);
    return res;
  } catch (error) {
    console.log("error req DELETE :", error.response.data);
    throw error;
  }
};

export default Delete;
