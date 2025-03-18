import { createContext, useState, useContext } from "react";

export const GlobalContext = createContext(null);

// Custom hook for consuming context
export function useMyContext() {
  return useContext(GlobalContext);
}

const Context = ({ children }) => {
  const [accessToken, setAccessToken] = useState("");
  return (
    <GlobalContext value={{ accessToken, setAccessToken }}>
      {children}
    </GlobalContext>
  );
};

export default Context;
