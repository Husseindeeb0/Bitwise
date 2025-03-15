import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Layout from "./Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
