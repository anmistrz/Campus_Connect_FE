import React, { useState, useEffect, useCallback } from "react";
import { BiSearch, BiLoaderAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { useParams, Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDisclosure, Avatar } from "@chakra-ui/react";

import auth from "../store/Auth";
import CreateFormModal from "../components/strukturOrganisasi/CreateFormModal";
import EditFormModal from "../components/strukturOrganisasi/EditFormModal";
import DeleteModal from "../components/strukturOrganisasi/DeleteModal";
import { dataUsersMahasiswa } from "../constants";
import API from "../services";

const StrukturOrganisasi = () => {
  const user = auth((state) => state.user);
  const params = useParams();
  const [optionsMahasiswa, setOptionsMahasiswa] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(2);

  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [action, setAction] = useState("create");
  const [id, setId] = useState();
  const handleCreate = () => {
    setAction("create");
    onOpen();
  };
  const handleDelete = (id) => {
    setId(id);
    setAction("delete");
    onOpen();
  };
  const handleEdit = (id) => {
    setId(id);
    setAction("edit");
    onOpen();
  };
  const handleSearch = useCallback(async (value) => {
    setIsFetching(true);
    if (value) {
      const res = await API.getUsers({
        name: value,
        idUserOrganisasi: params.id,
        userType: "mahasiswa",
        limit: 10,
        page: 1,
      });
      setData(res.data.data);
    }
    setIsFetching(false);
    setPage(2);

    value ? setHasMore(false) : setHasMore(true);
    if (!value) getDataInit();
  }, []);

  const getDataInit = async () => {
    try {
      const res = await API.getUsers({
        page: 1,
        limit: 10,
        idUserOrganisasi: params.id,
        userType: "mahasiswa",
        order: "users.created_at desc",
      });
      console.log("Data : ", res.data);
      setData(res.data.data);
      if (res.data.data.length === 0) setHasMore(false);
    } catch (error) {}
    // setTotalPages(res.data.totalPages);
  };
  useEffect(() => {
    getDataInit();
    getOptionsMahasiswa();
  }, []);

  const getOptionsMahasiswa = async () => {
    setIsFetching(true);
    try {
      const res = await API.getUsers({
        page: 1,
        limit: 10,
        idUserUniversitas: user.organisasi.idUserUniversitas,
        userType: "mahasiswa",
        order: "users.created_at desc",
      });
      setOptionsMahasiswa(res.data.data);
    } catch (error) {}
    setIsFetching(false);
  };

  const getData = async () => {
    const res = await API.getUsers({
      page: page,
      limit: 10,
      idUserOrganisasi: params.id,
      userType: "mahasiswa",
      order: "users.created_at desc",
    });
    console.log(res.data);
    if (res.data.data.length === 0) {
      setHasMore(false);
    }
    setPage(page + 1);
    setData((prev) => [...prev, ...res.data.data]);
  };
  return (
    <div className="bg-white rounded-lg p-3 sm:p-5">
      {action === "create" && (
        <CreateFormModal
          setData={setData}
          isOpen={isOpen}
          onClose={onClose}
          optionsMahasiswa={optionsMahasiswa}
          isFetching={isFetching}
        />
      )}
      {action === "delete" && (
        <DeleteModal
          setData={setData}
          id={id}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {action === "edit" && (
        <EditFormModal
          value={data.filter((val) => val.mahasiswa.idJabatan === id)[0]}
          setData={setData}
          isOpen={isOpen}
          onClose={() => {
            setAction(null);
            onClose();
          }}
          optionsMahasiswa={optionsMahasiswa}
          isFetching={isFetching}
        />
      )}
      <div className="flex gap-3">
        {user &&
          user.userType === "organisasi" &&
          user.id === parseInt(params.id) && (
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-full h-9 w-9 shrink-0 flex items-center justify-center hover:bg-blue-600 bg-blue-500 text-white transition-all"
            >
              <IoMdAdd />
            </button>
          )}
        <Search handleSearch={handleSearch} />
      </div>
      <div className="flex flex-col mt-2">
        {!isFetching && (
          <InfiniteScroll
            dataLength={data.length}
            next={getData}
            hasMore={hasMore}
            loader={
              <BiLoaderAlt className="animate-spin m-auto overflow-hidden" />
            }
            style={{ overflow: "hidden" }}
            // height={400}
            className="overflow-hidden"
            // endMessage={
            //   <p style={{ textAlign: "center" }}>
            //     <b>Yay! You have seen it all</b>
            //   </p>
            // }
          >
            {data.map((val, i) => (
              <div
                key={i}
                className="flex py-1 px-2 gap-2 hover:bg-gray-100 rounded-lg items-center transition-all"
              >
                <Avatar src={val.profilePic} height={9} width={9} />
                <div className="flex flex-col justify-center">
                  <div class="flex items-center">
                    <Link
                      to={`/${val.id}/posts`}
                      className="hover:text-blue-500 transition-all"
                    >
                      {val.name}
                    </Link>
                    <div class="text-xs rounded-lg bg-gray-200 px-2  ml-1">
                      {val.mahasiswa?.jabatan?.namaJabatan}
                    </div>
                  </div>
                  <div className="font-thin text-xs">
                    {val.mahasiswa.fakultas.namaFakultas} |{" "}
                    {val.mahasiswa.prodi.namaProdi}
                  </div>
                </div>
                <div className="flex-1"></div>
                {user &&
                  user.userType === "organisasi" &&
                  user.id === parseInt(params.id) && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEdit(val.mahasiswa.idJabatan)}
                        className="shrink-0 rounded-full h-9 w-9 bg-gray-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <MdEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(val.mahasiswa.idJabatan)}
                        className="shrink-0 rounded-full h-9 w-9 bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                      >
                        <MdDelete />
                      </button>
                    </>
                  )}
              </div>
            ))}
          </InfiniteScroll>
        )}
        {isFetching && (
          <BiLoaderAlt className="animate-spin m-auto overflow-hidden mt-10 mb-10" />
        )}
      </div>
    </div>
  );
};

const Search = ({ handleSearch }) => {
  const [inputSearch, setInputSearch] = useState();
  useEffect(() => {
    const fetching = setTimeout(() => {
      handleSearch(inputSearch);
    }, 500);

    return () => {
      clearTimeout(fetching);
    };
  }, [inputSearch, handleSearch]);

  return (
    <label className="rounded-full bg-white relative sm:w-[200px] sm:min-w-[100px] w-max">
      <input
        type="text"
        className=" rounded-full h-9 w-full bg-gray-100 outline-none pl-10 pr-3    transition-all duration-300"
        placeholder="Search..."
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />

      <BiSearch
        className="left-3 top-1/2   -translate-y-1/2 absolute"
        size="1.3rem"
      />
    </label>
  );
};

export default StrukturOrganisasi;
