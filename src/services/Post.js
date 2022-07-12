import axios from "axios";
import { rootPath } from "./Config";

const Post = async (path, data) => {
  try {
    const res = await axios.post(`${rootPath}${path}`, data);
    return res;
  } catch (error) {
    console.log("error req post :", error.response.data);
    throw error;
  }
};

export default Post;
