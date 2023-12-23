import Navbar from "./Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import "./stylesheets/button.css";
import "./stylesheets/reset.css";
import "./stylesheets/colors.css";
import ItemDetail from "./ItemDetail";
import Login from "./Login";
import { LoadingContext } from "./LoadingContext";
import PageLoader from "./PageLoader";
import UniversalLoader from "./UniversalLoader";
import Search from "./Search";
import Cart from "./Cart";

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
          <Route
            path="/search"
            element={
              <>
                <Navbar />
                <Search />
              </>
            }
          ></Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
              </>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </LoadingContext>
  );
}

export default App;
