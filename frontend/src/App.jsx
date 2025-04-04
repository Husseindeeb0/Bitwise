import { HashRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useMyContext } from "./context";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import ManageAdmins from "./pages/AdminPanel/ManageAdmins";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { getRoleFromToken } from "./utils/roleUtils";
import ManageAnnouncements from "./pages/AdminPanel/ManageAnnouncements";
import ManageAchievements from "./pages/AdminPanel/ManageAchievements";

function App() {
  const { accessToken } = useMyContext();
  
  // Effect to update role when access token changes
  useEffect(() => {
    if (accessToken) {
      const userRole = getRoleFromToken(accessToken);
      localStorage.setItem("role", userRole);
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
            <Route path="/manageAnnouncements" element={<ManageAnnouncements />} />
            <Route path="/manageAchievements" element={<ManageAchievements />} />
            <Route path="/manageAdmins" element={<ManageAdmins />} />
          </Route>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;