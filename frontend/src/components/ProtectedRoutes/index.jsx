import { useLocation } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader";
import useAuthVerification from "../../hooks/useAuthVerification";

const ProtectedRoutes = () => {
  const { isValid, isLoading } = useAuthVerification(true);
  const role = localStorage.getItem("role");
  const location = useLocation();
  const currentPath = location.pathname;

  // Render loading state until verification completes
  if (isLoading) {
    return <Loader />;
  }

  // Check route access based on role
  const adminOnlyRoutes = ['/manageAnnouncements', '/manageAchievements'];
  const topAdminOnlyRoutes = ['/manageAdmins'];

  if (isValid) {
    // Check role-based permissions
    if (adminOnlyRoutes.includes(currentPath) && 
        !(role === "admin" || role === "top_admin")) {
      return <Navigate to="/" />;
    }
    
    if (topAdminOnlyRoutes.includes(currentPath) && 
        role !== "top_admin") {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoutes;