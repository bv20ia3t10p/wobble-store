import Navbar from "./Navbar";
import "./stylesheets/colors.css";
import "./stylesheets/button.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./stylesheets/reset.css";
import ItemDetail from "./ItemDetail";
import Login from "./Login";
import { LoadingContext } from "./LoadingContext";
import PageLoader from "./PageLoader";
import UniversalLoader from "./UniversalLoader";

function App() {
  return (
    <LoadingContext>
      <PageLoader />
      <UniversalLoader />
      <BrowserRouter>
        <Routes>
          <Route
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
    </LoadingContext>
  );
}

export default App;
