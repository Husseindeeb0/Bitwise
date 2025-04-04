import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyContext } from '../context';
import checkTokenValidity from '../api/checkTokenValidity';
import refreshAccessToken from '../api/refreshToken';
import { fetchUserRole } from '../utils/roleUtils';

const useAuthVerification = (redirectOnFail = true) => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { accessToken, setAccessToken, isAuthenticated, setIsAuthenticated } =
    useMyContext();
  const refreshToken = localStorage.getItem("refreshToken");
  const role = localStorage.getItem("role");

  // Use useCallback to memoize the function
  const handleLogout = useCallback(() => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setAccessToken(null);
    setIsValid(false);
    setIsAuthenticated(false);
    setIsLoading(false);
    if (redirectOnFail) {
      navigate("/login");
    }
  }, [navigate, setAccessToken, setIsAuthenticated]);

  useEffect(() => {
    let isMounted = true;

    const verifyAuthentication = async () => {
      setIsLoading(true);

      // Step 1: Check if refresh token exists
      if (!refreshToken) {
        handleLogout();
        return;
      }

      // Step 2: Validate or refresh access token
      let currentAccessToken = accessToken;

      if (!currentAccessToken) {
        try {
          const newAccessToken = await refreshAccessToken();
          if (!isMounted) return;

          if (!newAccessToken) {
            handleLogout();
            return;
          }

          currentAccessToken = newAccessToken;
          setAccessToken(newAccessToken);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token refresh failed:", error);
          if (isMounted) handleLogout();
          return;
        }
      } else {
        // Validate existing token
        try {
          const valid = await checkTokenValidity(currentAccessToken);
          if (!isMounted) return;

          if (!valid) {
            try {
              const newAccessToken = await refreshAccessToken();
              if (!isMounted) return;

              if (!newAccessToken) {
                handleLogout();
                return;
              }

              currentAccessToken = newAccessToken;
              setAccessToken(newAccessToken);
              setIsAuthenticated(true);
            } catch (error) {
              console.error("Token refresh failed:", error);
              if (isMounted) handleLogout();
              return;
            }
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Token validation error:", error);
          if (isMounted) handleLogout();
          return;
        }
      }

      // Step 3: Verify role if needed
      if (role !== "user" && currentAccessToken) {
        try {
          const userRole = await fetchUserRole(currentAccessToken);
          if (!isMounted) return;
          localStorage.setItem("role", userRole);

          if (userRole !== role) {
            handleLogout();
            return;
          }
        } catch (error) {
          console.error("Role verification error:", error);
          if (isMounted) handleLogout();
          return;
        }
      }

      if (isMounted) {
        setIsValid(true);
        setIsLoading(false);
      }
    };

    verifyAuthentication();

    return () => {
      isMounted = false;
    };
  }, [
    refreshToken,
    accessToken,
    role,
    handleLogout,
    setAccessToken,
    setIsAuthenticated,
    redirectOnFail,
  ]);
  return { isValid, isLoading };
};

export default useAuthVerification;