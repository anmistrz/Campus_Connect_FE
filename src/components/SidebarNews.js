import React, { useState, useEffect } from "react";
import { pathFile } from "../constants";
import { Link } from "react-router-dom";
import API from "../services";
import auth from "../store/Auth";

const SidebarNews = () => {
  const user = auth((state) => state.user);

  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await API.getPosts({
      idUser: user.id,
      isNews: true,
      page: 1,
      limit: 3,
    });
    setData(res.data.data.filter((val) => val.materi !== ""));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-white rounded-lg p-3">
      <h5 className="font-bold mb-1">News</h5>
      <div className="flex flex-col gap-3">
        {data.map((val, i) => (
          <Link
            key={i}
            to={`/post/${val.id}`}
            className="hover:brightness-50 transition-all"
          >
            <img
              src={val.materi !== "" ? pathFile + val.materi : ""}
              className="rounded-lg"
              alt="0"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarNews;
