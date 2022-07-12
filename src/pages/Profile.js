import React, { useState, useEffect } from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import { BiLinkExternal } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineInstagram } from "react-icons/ai";
import { AiOutlineLinkedin } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import EditFormModal from "../components/profile/EditFormModal";
import { BiLoaderAlt } from "react-icons/bi";
import { useDisclosure, Avatar } from "@chakra-ui/react";
import auth from "../store/Auth";
import API from "../services";
import { pathFile } from "../constants";
// import { singleUserMahasiswa, dataUsers } from "../constants";

const IconButton = ({ icon, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      className="cursor-pointer w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center hover:bg-blue-500 hover:text-white transition-all"
      rel="noreferrer"
    >
      {icon}
    </a>
  );
};

const routesUniversitas = [
  { to: "posts", label: "POSTS" },
  { to: "fakultas", label: "FAKULTAS" },
  { to: "prodi", label: "PRODI" },
  { to: "mahasiswa", label: "MAHASISWA" },
  { to: "organisasi", label: "ORGANISASI" },
];
const routesMahasiswa = [{ to: "posts", label: "POSTS" }];
const routesOrganisasi = [
  { to: "posts", label: "POSTS" },
  { to: "struktur", label: "STRUKTUR ORGANISASI" },
];

const Profile = () => {
  const user = auth((state) => state.user);

  const [data, setData] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFetching, setIsFetching] = useState(false);
  const { id } = useParams();

  const getData = async () => {
    setIsFetching(true);
    try {
      // await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      const res = await API.getUser(id);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  let routes;
  if (data?.userType === "mahasiswa") routes = routesMahasiswa;
  if (data?.userType === "organisasi") routes = routesOrganisasi;
  if (data?.userType === "universitas") routes = routesUniversitas;

  return (
    <div className="w-full bg-white flex items-center pt-5 justify-center min-h-[50vh]">
      {!isFetching && data && (
        <EditFormModal
          setData={setData}
          data={data}
          // value
          isOpen={isOpen}
          onClose={onClose}
          getData={getData}
          // optionsFakultas
          // optionsProdi,
          // isFetching
        />
      )}
      {isFetching && <BiLoaderAlt className="animate-spin m-auto" />}
      {!isFetching && data && (
        <div className="max-w-4xl flex flex-col w-full items-center gap-5">
          {user.id === parseInt(id) && (
            <button
              onClick={onOpen}
              type="button"
              className="transition-all text-white font-bold rounded-full bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-400 h-9 px-5 py-3 flex justify-center items-center"
            >
              <MdEdit className="mr-2" /> EDIT PROFILE
            </button>
          )}

          <Avatar
            height={150}
            width={150}
            src={data.profilePic ? pathFile + data.profilePic : ""}
          />

          <div className="flex flex-col items-center justify-center gap-1">
            {/* <div class="flex items-center justify-center"> */}
            {data.userType === "mahasiswa" &&
              data.mahasiswa.statusMahasiswa === "alumni" && (
                <div class="ml-2 text-xs rounded-full bg-blue-500 px-2 font-thin text-white">
                  {data.mahasiswa.statusMahasiswa.toUpperCase()}
                </div>
              )}
            <h1 className="font-bold text-xl ">{data.name}</h1>

            {/* </div> */}
            {data.userType !== "universitas" && (
              <>
                {data.userType === "mahasiswa" &&
                  data.mahasiswa.idJabatan !== 0 && (
                    <div class="flex text-xs gap-1">
                      <div class="font-bold">
                        {data.mahasiswa.jabatan.namaJabatan}
                      </div>
                      di
                      <Link
                        to={`/${data.mahasiswa.jabatan.idUserOrganisasi}/posts`}
                        className="font-bold hover:text-blue-500 transition-all"
                      >
                        {data.mahasiswa.jabatan.namaOrganisasi}
                      </Link>
                    </div>
                  )}

                {data.userType !== "organisasi" && (
                  <div className="font-thin text-xs">
                    {data.mahasiswa.fakultas.namaFakultas} |{" "}
                    {data.mahasiswa.prodi.namaProdi}
                  </div>
                )}

                <Link
                  to={`/${
                    data.userType === "mahasiswa"
                      ? data.mahasiswa.idUserUniversitas
                      : data.organisasi.idUserUniversitas
                  }/posts`}
                  className="font-thin text-xs hover:text-blue-500 transition-all"
                >
                  {data.userType === "mahasiswa"
                    ? data.mahasiswa.universitas
                    : data.organisasi.universitas}
                </Link>
              </>
            )}
          </div>
          <div className="flex gap-3">
            {data.link && (
              <IconButton href={data.link} icon={<BiLinkExternal />} />
            )}
            <IconButton
              href={`mailto:${data.email}`}
              icon={<AiOutlineMail />}
            />
            {data.whatsapp && (
              <IconButton
                href={`https://api.whatsapp.com/send/?phone=${data.whatsapp}`}
                icon={<BsWhatsapp />}
              />
            )}
            {data.instagram && (
              <IconButton
                href={`https://www.instagram.com/${data.instagram}/`}
                icon={<AiOutlineInstagram />}
              />
            )}
            {data.linkedin && (
              <IconButton
                href={`https://www.linkedin.com/in/${data.linkedin}/`}
                icon={<AiOutlineLinkedin />}
              />
            )}
            {/* <div className="w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center"></div> */}
          </div>
          <p className="max-w-2xl text-ellipsis overflow-hidden p-2">
            {data.bio}
          </p>
          <div className="w-full flex border-t-[1px] border-t-gray-300 overflow-auto">
            {routes.map((item) => (
              <NavLink
                key={item.to}
                to={`/${id}/${item.to}`}
                className={({ isActive }) => `
            ${
              isActive
                ? "text-blue-500 border-blue-500"
                : "border-gray-500 text-gray-500"
            } border-b-4  flex-shrink-0 hover:border-blue-500  hover:text-blue-500  font-bold  transition-all cursor-pointer duration-200 px-10 py-3 flex items-center justify-center`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
