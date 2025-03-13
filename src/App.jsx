import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home";
import Layout from "./Layout";

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
