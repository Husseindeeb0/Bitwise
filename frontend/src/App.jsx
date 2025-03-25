import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import ManageAdmins from "./pages/ManageAdmins";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { getRoleFromToken } from "./utils/roleUtils";
import { useEffect } from "react";
import { useMyContext } from "./context";

function App() {
  const { accessToken, role, setRole } = useMyContext();
  useEffect(() => {
    if (accessToken) {
      setRole(getRoleFromToken(accessToken));
    }
  }, [accessToken]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route element={<ProtectedRoutes />}>
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/manageAdmins" element={<ManageAdmins />} />
            {/* {role === "admin" && (
              <Route path="/admin" element={<div>Admin Page</div>} />
            )}
            {role === "top-admin" && (
              <Route path="/manageAdmins" element={<ManageAdmins />} />
            )} */}
          </Route>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
