import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import ManageAdmins from "./pages/AdminPanel/ManageAdmins";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ManageAnnouncements from "./pages/AdminPanel/ManageAnnouncements";
import ManageAchievements from "./pages/AdminPanel/ManageAchievements";
import RegistrationForm from "./pages/RegistrationForm";
import AnnouncementDetails from "./pages/announcementDetails";
import { checkAuth } from "./features/auth/authThunks";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/" element={<Layout />}>
          <Route
            path="/manageAnnouncements"
            element={
              userData ? <ManageAnnouncements /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/manageAchievements"
            element={
              userData ? <ManageAchievements /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/manageAdmins"
            element={userData ? <ManageAdmins /> : <Navigate to="/login" />}
          />
          <Route index element={<Home />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route
            path="/announcementDetails"
            element={<AnnouncementDetails />}
          />
          <Route path="/registrationForm" element={<RegistrationForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
