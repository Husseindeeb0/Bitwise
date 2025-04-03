import { HashRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
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
  // Use state instead of directly reading from localStorage to render routes
  const [role, setRole] = useState(localStorage.getItem("role"));
  
  useEffect(() => {
    if (accessToken) {
      const userRole = getRoleFromToken(accessToken);
      localStorage.setItem("role", userRole);
      setRole(userRole); // Update state when role changes
    } else {
      // Handle logout case
      setRole(null);
    }
  }, [accessToken]);
  
  // Also listen for localStorage changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route element={<ProtectedRoutes />}>
            <Route path="/announcements" element={<Announcements />} />
            {(role === "admin" || role === "top_admin") && (
              <>
                <Route
                  path="/manageAnnouncements"
                  element={<ManageAnnouncements />}
                />
                <Route
                  path="/manageAchievements"
                  element={<ManageAchievements />}
                />
              </>
            )}
            {role === "top_admin" && (
              <Route path="/manageAdmins" element={<ManageAdmins />} />
            )}
          </Route>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
