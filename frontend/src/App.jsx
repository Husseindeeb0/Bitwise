import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import ManageAdmins from "./pages/AdminPanel/ManageAdmins";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ManageAnnouncements from "./pages/AdminPanel/ManageAnnouncements";
import ManageCourses from "./pages/AdminPanel/ManageCourses";
import ManageAchievements from "./pages/AdminPanel/ManageAchievements";
import RegistrationForm from "./pages/RegistrationForm";
import AnnouncementDetails from "./pages/announcementDetails";
import { checkAuth } from "./features/auth/authThunks";
import { useDispatch, useSelector } from "react-redux";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
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
              userData || isAuthenticated ? (
                <ManageAnnouncements />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/manageCourses"
            element={
              userData || isAuthenticated ? (
                <ManageCourses />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/manageAchievements"
            element={
              userData || isAuthenticated ? (
                <ManageAchievements />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/manageAdmins"
            element={
              userData || isAuthenticated ? (
                <ManageAdmins />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route index element={<Home />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route
            path="/announcementDetails"
            element={<AnnouncementDetails />}
          />
          <Route path="/registrationForm" element={<RegistrationForm />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courseDetails" element={<CourseDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
