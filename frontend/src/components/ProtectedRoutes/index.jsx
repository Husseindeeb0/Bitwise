import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkTokenValidity from '../../api/checkTokenValidity';
import { useMyContext } from '../../context';
import refreshAccessToken from '../../api/refreshToken';

const ProtectedRoutes = ({ children }) => {
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useMyContext();
  const refreshToken = localStorage.getItem("refreshToken")

  useEffect(() => {
    const verifyToken = async () => {
      if (!accessToken) {
        setIsValid(false);
        navigate('/login');
        return;
      }

      // Check if the accessToken is valid
      const valid = await checkTokenValidity(accessToken);

      if (!valid) {
        if (!refreshToken) {
          setIsValid(false);
          navigate('/login');
          return;
        }

        // Try refreshing the access token using the refreshToken
        const newAccessToken = await refreshAccessToken();

        if (!newAccessToken) {
          // If no new accessToken was received, redirect user to the login
          setIsValid(false);
          navigate('/login');
          return;
        }

        // If a new accessToken is received, update the context and set the page to valid
        setAccessToken(newAccessToken);
        setIsValid(true);
      } else {
        setIsValid(true);
      }
    };

    verifyToken();
  }, [accessToken]);

  return isValid ? children : null;
};

export default ProtectedRoutes;
