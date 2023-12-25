import React, { useEffect, useState } from "react";
import "./stylesheets/accountSideBar.css";

const AccountSidebar = () => {
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    const currentWindow = new URL(window.location.href);
    switch (currentWindow.pathname) {
      case "/dashboard":
        setSelected(() => 0);
        break;
      default:
        setSelected(() => 1);
    }
  }, []);
  return (
    <aside className="sideMenu">
      <a
        className={`userInfo ${selected===0?"selected":""}`}
        href="/dashboard"
      >
        Account information
      </a>
      <a 
        className={`pastOrders ${selected===1?"selected":""}`}
        href="/pastOrders">
        Past orders
      </a>
    </aside>
  );
};

export default AccountSidebar;
