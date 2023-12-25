import React, { useEffect, useState } from "react";
import "./stylesheets/accountSideBar.css";

const AccountSidebar = () => {
  const [selected, setSelected] = useState(0);
  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => {
    const currentWindow = new URL(window.location.href);
    switch (currentWindow.pathname) {
      case "/dashboard":
        setSelected(() => 0);
        break;
      default:
        setSelected(() => 1);
    }
    try {
      const priv = localStorage.getItem("isStaff");
      if (priv === "true") setIsStaff(() => true);
    } catch {
      console.log("Customer privileges only");
    }
  }, []);
  return (
    <aside className="sideMenu">
      <a
        className={`button userInfo ${selected === 0 ? "selected" : ""}`}
        href="/dashboard"
      >
        Account information
      </a>
      <a
        className={`button pastOrders ${selected === 1 ? "selected" : ""}`}
        href="/pastOrders"
      >
        Past orders
      </a>
      {isStaff && <a className="button" href="/adminDashboard">To admin dashboard</a>}
    </aside>
  );
};

export default AccountSidebar;
