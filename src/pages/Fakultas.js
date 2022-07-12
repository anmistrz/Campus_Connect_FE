import React, { useState, useEffect, useCallback, useRef } from "react";
import { BiSearch, BiLoaderAlt } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDisclosure } from "@chakra-ui/react";
import auth from "../store/Auth";
import CreateFormModal from "../components/fakultas/CreateFormModal";
import EditFormModal from "../components/fakultas/EditFormModal";
import DeleteModal from "../components/fakultas/DeleteModal";
import API from "../services";

const Fakultas = ({ initData, initTotalPages }) => {
  const user = auth((state) => state.user);
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(2);
  const [isFetching, setIsFetching] = useState(false);
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
      const res = await API.getAllFakultas({
        namaFakultas: value,
        idUserUniversitas: params.id,

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
    const res = await API.getAllFakultas({
      page: 1,
      limit: 10,
      idUserUniversitas: params.id,
      order: "created_at desc",
    });
    setData(res.data.data);
    if (res.data.data.length === 0) setHasMore(false);
    // setTotalPages(res.data.totalPages);
  };
  useEffect(() => {
    getDataInit();
  }, []);

  const getData = async () => {
    const res = await API.getAllFakultas({
      page: page,
      limit: 10,
      idUserUniversitas: params.id,
      order: "created_at desc",
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
        <CreateFormModal setData={setData} isOpen={isOpen} onClose={onClose} />
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
          value={data.filter((val) => val.id === id)[0]}
          setData={setData}
          isOpen={isOpen}
          onClose={() => {
            setAction(null);
            onClose();
          }}
        />
      )}
      <div className="flex gap-3">
        {user &&
          user.userType === "universitas" &&
          user.id === parseInt(params.id) && (
            <button
              type="button"
              onClick={handleCreate}
              class="rounded-full h-9 w-9 shrink-0 flex items-center justify-center hover:bg-blue-600 bg-blue-500 text-white transition-all"
            >
              <IoMdAdd />
            </button>
          )}
        <Search handleSearch={handleSearch} />
      </div>
      <div class="flex flex-col mt-2">
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
            {data.length != 0 &&
              data.map((val, i) => (
                <div
                  key={i}
                  className="flex py-1 px-2 gap-2 hover:bg-gray-100 rounded-lg items-center transition-all"
                >
                  <div class="">{val.namaFakultas}</div>
                  <div class="flex-1"></div>
                  {user &&
                    user.userType === "universitas" &&
                    user.id === parseInt(params.id) && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(val.id)}
                          class="shrink-0 rounded-full h-9 w-9 bg-gray-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <MdEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(val.id)}
                          class="shrink-0 rounded-full h-9 w-9 bg-gray-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
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

export default Fakultas;
