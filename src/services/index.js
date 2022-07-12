// import { post, posts } from "../constants/dummy";
import Get from "./Get";
import Post from "./Post";
import Delete from "./Delete";
import Put from "./Put";

const convertToQueryStr = (query) => {
  let result = "";
  for (const key in query) {
    result += `&${key}=${query[key]}`;
  }
  return result.replace("&", "?");
};
// GET

const getUsers = (query) => Get(`users${convertToQueryStr(query)}`);
const getPosts = (query) => Get(`posts${convertToQueryStr(query)}`);
const getUser = (id) => Get(`users/${id}`);
const getAllFakultas = (query) => Get(`fakultas${convertToQueryStr(query)}`);
const getFakultas = (id) => Get(`fakultas/${id}`);
const getProdis = (query) => Get(`prodi${convertToQueryStr(query)}`);
const getComments = (query) => Get(`comments${convertToQueryStr(query)}`);
const getProdi = (id) => Get(`prodi/${id}`);

// POST
const signin = (data) => Post("users/signin", data);
const signup = (data) => Post("users/signup", data);
const createUser = (data) => Post("users", data);
const createFakultas = (data) => Post("fakultas", data);
const createProdi = (data) => Post("prodi", data);
const createJabatan = (data) => Post(`jabatan`, data);
const uploadFile = (data) => Post(`upload`, data);
const createPost = (data) => Post(`posts`, data);
const createComment = (data) => Post(`comments`, data);
const savePost = (data) => Post(`posts/${data.idPost}/save`, data);
const unsavePost = (data) => Post(`posts/${data.idPost}/unsave`, data);
const likePost = (data) => Post(`posts/${data.idPost}/like`, data);
const unlikePost = (data) => Post(`posts/${data.idPost}/unlike`, data);

// PUT
const updateUser = (data) => Put(`users/${data.id}`, data);
const updateUserProfile = (data) => Put(`users/${data.id}/profile`, data);
const updateFakultas = (data) => Put(`fakultas/${data.id}`, data);
const updateProdi = (data) => Put(`prodi/${data.id}`, data);
const updateJabatan = (data) => Put(`jabatan/${data.id}`, data);
const updatePassword = (data) => Put(`users/${data.id}/password`, data);
const updateVerified = (data) => Put(`users/${data.id}/verified`, data);

// DELETE
const deleteFakultas = (id) => Delete(`fakultas/${id}`);
const deleteProdi = (id) => Delete(`prodi/${id}`);
const deleteUser = (id) => Delete(`users/${id}`);
const deleteJabatan = (id) => Delete(`jabatan/${id}`);
const deletePost = (id) => Delete(`posts/${id}`);
const deleteComment = (id) => Delete(`comments/${id}`);

const API = {
  getUsers,
  getPosts,
  getUser,
  getAllFakultas,
  getFakultas,
  getProdis,
  getProdi,
  getComments,
  signin,
  signup,
  createPost,
  createComment,
  savePost,
  unsavePost,
  likePost,
  unlikePost,
  createUser,
  createFakultas,
  createProdi,
  createJabatan,
  uploadFile,
  updateUser,
  updateVerified,
  updatePassword,
  updateUserProfile,
  updateProdi,
  updateFakultas,
  updateJabatan,
  deleteFakultas,
  deleteProdi,
  deleteUser,
  deleteComment,
  deleteJabatan,
  deletePost,
};

export default API;
