import { useEffect, useState } from "react";
import { useNavigate, Navigate, Outlet  } from "react-router-dom";
import checkTokenValidity from '../../api/checkTokenValidity';
import { useMyContext } from '../../context';
import refreshAccessToken from '../../api/refreshToken';

const ProtectedRoutes = () => {
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();
  const { accessToken, setAccessToken, isAuthenticated, setIsAuthenticated } = useMyContext();
  const refreshToken = localStorage.getItem("refreshToken")

  useEffect(() => {
    const verifyToken = async () => {
      console.log("verifying...")
      if (!accessToken) {
        setIsValid(false);
        setIsAuthenticated(false);
        navigate('/login');
        console.log("No accessToken")
        return;
      }

      // Check if the accessToken is valid
      const valid = await checkTokenValidity(accessToken);

      if (!valid) {
        if (!refreshToken) {
          setIsValid(false);
          setIsAuthenticated(false);
          navigate('/login');
          console.log("No refreshToken")
          return;
        }

        // Try refreshing the access token using the refreshToken
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          // If no new accessToken was received, redirect user to the login
          setIsValid(false);
          console.log("No newaccessToken")
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }

        // If a new accessToken is received, update the context and set the page to valid
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

  return isValid ? <Outlet /> : null;
};

export default ProtectedRoutes;
