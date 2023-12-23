import Navbar from "./Navbar";
import "./stylesheets/colors.css";
import "./stylesheets/button.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./stylesheets/reset.css";
import ItemDetail from "./ItemDetail";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          index
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        ></Route>
        <Route
          path="/item"
          element={
            <>
              <Navbar />
              <ItemDetail />
            </>
          }
        ></Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
