// import Home from "./pages/Home";
// import Explore from "./pages/Explore";
// import { useState } from "react";
import auth from "./store/Auth";

import SinglePost from "./pages/SinglePost";
import Postingan from "./pages/Postingan";
import Profile from "./pages/Profile";
import Fakultas from "./pages/Fakultas";
import Prodi from "./pages/Prodi";
import Mahasiswa from "./pages/Mahasiswa";
import Organisasi from "./pages/Organisasi";
import StrukturOrganisasi from "./pages/StrukturOrganisasi";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Users from "./pages/Users";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import SidebarNews from "./components/SidebarNews";

const Layout = () => {
  const { id } = useParams();

  return (
    <div className="bg-gray-100 min-h-screen pb-5">
      <Navbar />

      {id && <Profile userId={id} />}
      <div className="flex gap-5 max-w-4xl m-auto lg:px-0 px-4 mt-5 ">
        <div className="w-full xs:w-[60%] ">
          <Outlet />
        </div>
        <div className="w-[40%] hidden xs:block">
          <SidebarNews />
        </div>
      </div>
    </div>
  );
};
const LayoutAdmin = () => {
  // const { id } = useParams();

  return (
    <div className="bg-gray-100 min-h-screen pb-5">
      <Navbar />

      {/* {id && <Profile userId={id} />} */}
      <div className="flex gap-5 max-w-4xl m-auto lg:px-0 px-4 mt-5 ">
        <div className="w-full  ">
          <Users />
        </div>
      </div>
    </div>
  );
};

function App() {
  const user = auth((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.userType === "admin" ? (
                <Navigate to="/users" />
              ) : (
                <Navigate to="/home" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/*" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="home" element={<Postingan page="home" />} />
          <Route path="explore" element={<Postingan page="explore" />} />
          <Route path="news" element={<Postingan page="news" />} />
          <Route path="saved" element={<Postingan page="saved" />} />
          <Route
            path="post/:idpost"
            element={<Postingan page="singlePost" />}
          />
          <Route path=":id/posts" element={<Postingan page="Posts" />} />
          <Route path=":id/fakultas" element={<Fakultas />} />
          <Route path=":id/prodi" element={<Prodi />} />
          <Route path=":id/mahasiswa" element={<Mahasiswa />} />
          <Route path=":id/organisasi" element={<Organisasi />} />
          <Route path=":id/struktur" element={<StrukturOrganisasi />} />
        </Route>

        <Route
          path="/users"
          element={user ? <LayoutAdmin /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
