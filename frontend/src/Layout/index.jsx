import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useMyContext } from "../context";
import useAuthVerification from "../hooks/useAuthVerification";

const Layout = () => {
  const { loading } = useMyContext();
  const [pageLoaded, setPageLoaded] = useState(false);
  const { isLoading } = useAuthVerification(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      const handleLoad = () => setPageLoaded(true);
      window.addEventListener("load", handleLoad);

      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      // style={{ fontFamily: "Bahnschrift, 'DIN Alternate', 'Franklin Gothic Medium', 'Nimbus Sans Narrow', sans-serif-condensed, sans-serif" }}
      // style={{fontFamily: "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif"}}
      style={{fontFamily: "Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif"}}
    >
      <Navbar />
      <main className="flex-1 bg-gradient-to-r from-background1 to-background2">
        {!pageLoaded || isLoading ? <Loader /> : <Outlet />}
        {loading ? <Loader /> : null}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
