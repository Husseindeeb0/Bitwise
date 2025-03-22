import { useEffect, useState } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import checkTokenValidity from "../../api/checkTokenValidity";
import { useMyContext } from "../../context";
import refreshAccessToken from "../../api/refreshToken";
import { fetchUserRole } from "../../utils/roleUtils";

const ProtectedRoutes = () => {
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();
  const { accessToken, setAccessToken, isAuthenticated, setIsAuthenticated, role } = useMyContext();
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    const verifyToken = async () => {
      if (!accessToken) {
        setIsValid(false);
        setIsAuthenticated(false);
        navigate("/login");
        return;
      }

      // Check if the accessToken is valid
      const valid = await checkTokenValidity(accessToken);

      if (!valid) {
        if (!refreshToken) {
          setIsValid(false);
          setIsAuthenticated(false);
          navigate("/login");
          return;
        }

        // Try refreshing the access token using the refreshToken
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          setIsValid(false);
          setIsAuthenticated(false);
          navigate("/login");
          return;
        }

        setAccessToken(newAccessToken);
        setIsAuthenticated(true);
        setIsValid(true);
      } else {
        setIsAuthenticated(true);
        setIsValid(true);
      }
    };

    verifyToken();
  }, [accessToken]);

  useEffect(() => {
    const fetchRole = async () => {
      if (role !== "user" && accessToken && isAuthenticated) {
        const userRole = await fetchUserRole(accessToken);
        if (userRole !== role) {
          setIsValid(false);
          setIsAuthenticated(false);
          navigate("/login");
        }
      }
    };

    if (isAuthenticated) {
      fetchRole();
    }
  }, [role, accessToken, isAuthenticated]);

  if (isValid) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoutes;
