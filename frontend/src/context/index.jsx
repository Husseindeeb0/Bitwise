import { createContext, useState, useContext } from "react";

export const GlobalContext = createContext(null);

// Custom hook for consuming context
export function useMyContext() {
  return useContext(GlobalContext);
}

const Context = ({ children }) => {
  const refreshToken = localStorage.getItem("refreshToken")
  const [accessToken, setAccessToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(
      refreshToken ? true : false
    );

  return (
    <GlobalContext
      value={{
        accessToken,
        setAccessToken,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </GlobalContext>
  );
};

export default Context;
