import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../features/auth/authSlice";
import { announcementsActions } from "../features/announcements/announcementsSlice";
import { userActions } from "../features/user/userSlice";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const dispatch = useDispatch();
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);
  const location = useLocation();

  useEffect(() => {
    dispatch(authActions.clearError());
    dispatch(announcementsActions.clearError());
    dispatch(userActions.clearError());
  }, [location.pathname, dispatch]);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        fontFamily:
          "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
      }}
    >
      <Navbar />
      <main className="flex-1 bg-gradient-to-r from-background1 to-background2">
        {isAuthenticating ? <Loader /> : <Outlet />}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
