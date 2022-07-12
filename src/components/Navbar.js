import React, { useState, useEffect, useRef } from "react";
import auth from "../store/Auth";
import EditPasswordModal from "./EditPasswordModal";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  // MenuItemOption,
  // MenuGroup,
  // MenuOptionGroup,
  // MenuDivider,
} from "@chakra-ui/react";
import { BiSearch, BiLoaderAlt } from "react-icons/bi";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
// import { MdNotifications } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { TbNews } from "react-icons/tb";
import { BsFillBookmarkFill } from "react-icons/bs";
// import { IoEyeSharp } from "react-icons/io5";
// import { RiSendPlaneFill } from "react-icons/ri";
// import { FaCheck } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { pathFile } from "../constants";
import { FaUsers } from "react-icons/fa";
import { useDisclosure } from "@chakra-ui/react";
import API from "../services";

// import { useLocation } from "react-router-dom";
// import API from "../services";

export default function PrimarySearchAppBar() {
  const logout = auth((state) => state.logout);
  const user = auth((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  // const { search } = useLocation();
  // console.log("loca ", search);

  // const getFeedsNotif = async () => {
  //   try {
  //     const res = await API.getContentsNotif();
  //     setNotif(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const logoutHandle = () => dispatch({ type: "LOGOUT" });
  // useEffect(() => {
  //   getFeedsNotif();
  // }, []);

  return (
    <div className="sticky z-30 top-0 bg-white w-full h-[60px] shadow-lg shadow-gray-300  px-4 ">
      <EditPasswordModal isOpen={isOpen} onClose={onClose} />
      <div className="flex items-center gap-4 max-w-4xl m-auto h-full ">
        <h1 className="text-xl font-bold hidden sm:block shrink-0">
          CAMPUS CONNECT
        </h1>
        {/* <label className="rounded-full bg-white relative sm:w-[200px] sm:min-w-[100px] w-max">
          <input
            type="text"
            className=" rounded-full h-8 w-full bg-gray-100 outline-none pl-10 pr-3  focus:w-[90vw] sm:focus:w-full transition-all duration-300"
            placeholder="Search..."
          />

          <BiSearch
            className="left-3 top-1/2   -translate-y-1/2 absolute"
            size="1.3rem"
          />
        </label> */}
        <Search />
        <div className="flex-1 hidden sm:block"></div>
        <div className="flex items-center gap-1 transition-all duration-300">
          {user.userType !== "admin" && (
            <>
              {" "}
              <NavLink
                to="/home"
                className={({ isActive }) => `
            ${
              isActive ? "text-white bg-blue-500 shadow-lg shadow-blue-400" : ""
            } flex-shrink-0 rounded-full hover:text-white hover:bg-blue-500 font-bold hover:shadow-lg hover:shadow-blue-400 transition-all cursor-pointer duration-200 h-10 w-10 flex items-center justify-center`}
              >
                <AiFillHome />
              </NavLink>
              <NavLink
                to="/explore"
                className={({ isActive }) => `
            ${
              isActive ? "text-white bg-blue-500 shadow-lg shadow-blue-400" : ""
            } flex-shrink-0 rounded-full hover:text-white hover:bg-blue-500 font-bold hover:shadow-lg hover:shadow-blue-400 transition-all cursor-pointer duration-200 h-10 w-10 flex items-center justify-center`}
              >
                <MdOutlineExplore />
              </NavLink>
              <NavLink
                to="/news"
                className={({ isActive }) => `
            ${
              isActive ? "text-white bg-blue-500 shadow-lg shadow-blue-400" : ""
            } flex-shrink-0 rounded-full hover:text-white hover:bg-blue-500 font-bold hover:shadow-lg hover:shadow-blue-400 transition-all cursor-pointer duration-200 h-10 w-10 flex items-center justify-center`}
              >
                <TbNews />
              </NavLink>
              <NavLink
                to={`/saved`}
                className={({ isActive }) => `
            ${
              isActive ? "text-white bg-blue-500 shadow-lg shadow-blue-400" : ""
            } flex-shrink-0 rounded-full hover:text-white hover:bg-blue-500 font-bold hover:shadow-lg hover:shadow-blue-400 transition-all cursor-pointer duration-200 h-10 w-10 flex items-center justify-center`}
              >
                <BsFillBookmarkFill />
              </NavLink>
              {user &&
                user.userType !== "universitas" &&
                user.userType !== "admin" && (
                  <NavLink
                    to={`/${
                      user.userType === "mahasiswa"
                        ? user.mahasiswa.idUserUniversitas
                        : user.organisasi.idUserUniversitas
                    }/posts`}
                    className={({ isActive }) => `
            ${
              isActive ? "text-white bg-blue-500 shadow-lg shadow-blue-400" : ""
            } flex-shrink-0 rounded-full hover:text-white hover:bg-blue-500 font-bold hover:shadow-lg hover:shadow-blue-400 transition-all cursor-pointer duration-200 h-10 w-10 flex items-center justify-center`}
                  >
                    <FaUniversity />
                  </NavLink>
                )}
              {/* <NavLink
            to="/notif"
            className={({ isActive }) => `
            ${
              isActive ? "text-white bg-blue-500 shadow-lg shadow-blue-400" : ""
            } flex-shrink-0 rounded-full hover:text-white hover:bg-blue-500 font-bold hover:shadow-lg hover:shadow-blue-400 transition-all cursor-pointer duration-200 h-10 w-10 flex items-center justify-center`}
          >
            <MdNotifications />
          </NavLink> */}
            </>
          )}
          {user.userType === "admin" && (
            <NavLink
              to="/users"
              className={({ isActive }) => `
            ${
              isActive ? "text-white bg-blue-500 shadow-lg shadow-blue-400" : ""
            } flex-shrink-0 rounded-full hover:text-white hover:bg-blue-500 font-bold hover:shadow-lg hover:shadow-blue-400 transition-all cursor-pointer duration-200 h-10 w-10 flex items-center justify-center`}
            >
              <FaUsers />
            </NavLink>
          )}
        </div>
        <Menu>
          <MenuButton>
            <Avatar
              height="40px"
              width="40px"
              src={user.profilePic ? pathFile + user.profilePic : ""}
            />

            {/* {user?.profilePic ? (
              <img
                className="rounded-full h-12 w-12 object-cover cursor-pointer"
                src={user.profilePic ? user.profilePic : ""}
                alt=""
              />
            ) : (
              <div className="cursor-pointer rounded-full h-12 w-12 bg-gray-900 flex justify-center items-center text-white font-bold text-xl">
                {user.name[0].toUpperCase()}
              </div>
            )} */}
          </MenuButton>
          <MenuList w={50}>
            {user.userType !== "admin" && (
              <MenuItem p={0}>
                <NavLink
                  to={`/${user.id}/posts`}
                  className="py-2 px-4 w-full transition-all hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </NavLink>
              </MenuItem>
            )}
            <MenuItem p={0}>
              <div
                onClick={onOpen}
                className="py-2 px-4 w-full transition-all hover:bg-gray-100 cursor-pointer"
              >
                Change Password
              </div>
            </MenuItem>
            <MenuItem p={0}>
              <div
                onClick={() => {
                  // navigate("/login");
                  logout();
                }}
                className="py-2 px-4 w-full transition-all hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
}

const Search = () => {
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  // const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const wrapperRef = useRef(null);
  const handleSearch = async (e) => {
    setIsFetching(true);
    if (e.target.value) {
      const res = await API.getUsers({
        name: e.target.value,
        limit: 10,
        page: 1,
      });
      console.log(res.data);
      setOptions(res.data.data);
    }
    setIsFetching(false);
  };
  // useEffect(() => {}, []);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col relative rounded-full bg-white   sm:min-w-[100px] sm:w-[30vw] sm:max-w-[300px] w-max"
    >
      <input
        id="auto"
        className=" rounded-full h-8 w-full bg-gray-100 outline-none pl-10 pr-3  focus:w-[90vw] sm:focus:w-full transition-all duration-300"
        onClick={() => setDisplay(!display)}
        placeholder="Type to search"
        // value={search}
        onChange={handleSearch}
        autocomplete="off"
      />
      <BiSearch
        className="left-3 top-1/2   -translate-y-1/2 absolute"
        size="1.3rem"
      />

      {display && (
        <div className="bg-white top-[36px] rounded-lg shadow-lg shadow-gray-400 flex   flex-col items-center w-full absolute">
          {!isFetching &&
            options.map((val, i) => (
              <div
                key={i}
                className="flex w-full py-1 px-2 gap-2 hover:bg-gray-100 items-center transition-all"
              >
                <Avatar
                  src={val.profilePic ? pathFile + val.profilePic : ""}
                  height={9}
                  width={9}
                />
                <div className="flex flex-col justify-center">
                  <Link
                    onClick={() => setDisplay(false)}
                    to={`/${val.id}/posts`}
                    className="hover:text-blue-500 transition-all"
                  >
                    {val.name}
                  </Link>
                  {/* <div className="font-thin text-xs">
                    {val?.mahasiswa?.fakultas?.namaFakultas} |{" "}
                    {val?.mahasiswa?.prodi?.namaProdi}
                  </div> */}
                </div>
              </div>
            ))}
          {isFetching && (
            <BiLoaderAlt className="animate-spin m-auto overflow-hidden mt-10 mb-10" />
          )}
        </div>
      )}
    </div>
  );
};
