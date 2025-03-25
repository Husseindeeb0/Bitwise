import { useEffect, useState } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import checkTokenValidity from "../../api/checkTokenValidity";
import { useMyContext } from "../../context";
import refreshAccessToken from "../../api/refreshToken";
import { fetchUserRole } from "../../utils/roleUtils";

const ProtectedRoutes = () => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {
    accessToken,
    setAccessToken,
    isAuthenticated,
    setIsAuthenticated,
    role,
  } = useMyContext();
  const refreshToken = localStorage.getItem("refreshToken");

  const handleLogout = () => {
    console.log("Logging out");
    localStorage.removeItem("refreshToken");
    setAccessToken('');
    setIsValid(false);
    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    let isMounted = true;
    const verifyToken = async () => {
      setIsLoading(true);
      // If no refresh token, immediately logout
      if (!refreshToken) {
        handleLogout();
        return;
      }

      // If no access token, attempt to refresh
      if (!accessToken) {
        try {
          const newAccessToken = await refreshAccessToken();
          if (!isMounted) return;
          if (!newAccessToken) {
            handleLogout();
            return;
          }
          setAccessToken(newAccessToken);
          setIsAuthenticated(true);
          setIsValid(true);
        } catch (error) {
          console.error("Token refresh failed:", error);
          handleLogout();
          return;
        }
      } else {
        // Validate existing access token
        try {
          const valid = await checkTokenValidity(accessToken);
          if (!isMounted) return;
          if (!valid) {
            try {
              const newAccessToken = await refreshAccessToken();
              if (!isMounted) return;
              if (!newAccessToken) {
                handleLogout();
                return;
              }
              setAccessToken(newAccessToken);
              setIsAuthenticated(true);
              setIsValid(true);
            } catch (error) {
              console.error("Token refresh failed:", error);
              handleLogout();
              return;
            }
          } else {
            setIsAuthenticated(true);
            setIsValid(true);
          }
        } catch (error) {
          console.error("Token validation error:", error);
          if (isMounted) handleLogout();
          return;
        }
      }
      if (isMounted) setIsLoading(false);
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [refreshToken, accessToken, setAccessToken, setIsAuthenticated, navigate]);

  // Role verification effect
  useEffect(() => {
    let isMounted = true;
    const fetchRole = async () => {
      try {
        if (role !== "user" && accessToken && isAuthenticated) {
          const userRole = await fetchUserRole(accessToken);
          if (!isMounted) return;
          if (userRole !== role) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Role verification error:", error);
        if (isMounted) handleLogout();
      }
    };

    if (isAuthenticated) {
      fetchRole();
    }
    return () => {
      isMounted = false;
    };
  }, [role, accessToken, isAuthenticated, navigate, setIsAuthenticated]);

  // Render a loading state until the verification completes.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isValid) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoutes;
