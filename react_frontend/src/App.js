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
import Dashboard from "./Dashboard";
import PastOrders from "./PastOrders";
import OrderConfirmation from "./OrderConfirmation";
import AdminDashboard from "./AdminHelper/AdminDashboard";
import AdminSidebar from "./AdminHelper/AdminSidebar";
import AdminOrders from "./AdminHelper/AdminOrders";
import AdminCustomer from "./AdminHelper/AdminCustomer";

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
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/pastOrders"
            element={
              <>
                <Navbar />
                <PastOrders />
              </>
            }
          />
          <Route
            path="/OrderDetails"
            element={
              <>
                <Navbar />
                <OrderConfirmation />
              </>
            }
          />
          <Route
            path="/adminDashboard/Orders"
            element={
              <>
                <AdminSidebar />
                <AdminOrders />
              </>
            }
          />
          <Route
            path="/adminDashboard/Customers"
            element={
              <>
                <AdminSidebar />
                <AdminCustomer />
              </>
            }
          />
          <Route
            path="/adminDashboard/Dashboard"
            element={
              <>
                <AdminSidebar />
                <AdminDashboard />
              </>
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <>
                <AdminSidebar />
                <AdminDashboard />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </LoadingContext>
  );
}

export default App;
