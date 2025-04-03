import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Loader";
import useAuthVerification from "../../hooks/useAuthVerification";

const ProtectedRoutes = () => {
  const { isValid, isLoading } = useAuthVerification(true);

  // Render loading state until verification completes
  if (isLoading) {
    return <Loader />;
  }

  if (isValid) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoutes;