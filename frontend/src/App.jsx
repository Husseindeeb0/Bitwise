import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Context from "./context";

function App() {
  return (
    <Context>
      <HashRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route element={ProtectedRoutes}>
              <Route path="/announcements" element={<Announcements />} />
            </Route>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </Context>
  );
}

export default App;
