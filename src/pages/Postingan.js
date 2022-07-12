import React, { useState, useEffect } from "react";
import CreatePost from "../components/postingan/CreatePost";
import { v4 as uuidv4 } from "uuid";
import Post from "../components/postingan/Post";
import DeleteModal from "../components/postingan/DeleteModal";
import auth from "../store/Auth";
import { BiLoaderAlt } from "react-icons/bi";

import API from "../services";
import { useDisclosure } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
const Postingan = ({ page }) => {
  const user = auth((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [idPost, setIdPost] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const { id } = useParams();
  const { idpost } = useParams();
  const [data, setData] = useState([]);
  const getDataInit = async () => {
    setIsFetching(true);
    try {
      let idUserUniversitas;
      if (user.userType === "universitas") {
        idUserUniversitas = user.id;
      } else if (user.userType === "mahasiswa") {
        idUserUniversitas = user.mahasiswa.idUserUniversitas;
      } else if (user.userType === "organisasi") {
        idUserUniversitas = user.organisasi.idUserUniversitas;
      }

      let res;
      console.log(id);
      if (page === "singlePost") {
        res = await API.getPosts({
          page: 1,
          limit: 10,
          idUser: user.id,
          idPost: idpost,
        });
      }
      if (id) {
        res = await API.getPosts({
          page: 1,
          limit: 10,
          idUser: id,
          self: true,
          order: "created_at desc",
        });
      } else if (page === "home") {
        console.log("get Home");
        res = await API.getPosts({
          page: 1,
          limit: 10,
          idUser: user.id,
          // self: true,
          idUserUniversitas,
          // userType: "mahasiswa",
          order: "created_at desc",
        });
      } else if (page === "explore") {
        console.log("get Explore");
        res = await API.getPosts({
          page: 1,
          limit: 10,
          idUser: user.id,
          order: "created_at desc",
        });
      } else if (page === "news") {
        console.log("get News");
        res = await API.getPosts({
          page: 1,
          limit: 10,
          idUser: user.id,
          isNews: true,
          order: "created_at desc",
        });
      } else if (page === "saved") {
        console.log("get Saved");
        res = await API.getPosts({
          page: 1,
          limit: 10,
          idUser: user.id,
          isSave: true,
          order: "created_at desc",
        });
      }

      console.log("Data : ", res.data);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    getDataInit();
  }, [id, page, idpost]);
  return (
    <div className="flex flex-col gap-3">
      <DeleteModal
        setData={setData}
        id={idPost}
        isOpen={isOpen}
        onClose={onClose}
      />
      {page === "home" && <CreatePost setData={setData} />}
      {parseInt(id) === user.id && <CreatePost setData={setData} />}
      {data &&
        data.map((val, i) => (
          <Post onOpen={onOpen} setIdPost={setIdPost} key={uuidv4()} {...val} />
        ))}
      {isFetching && (
        <BiLoaderAlt className="animate-spin m-auto overflow-hidden mt-10 mb-10" />
      )}
    </div>
  );
};

export default Postingan;
