import React, { useEffect, useState } from "react";
import "../stylesheets/adminSidebar.css";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { loadUserInfo } from "../Cart";
import { useLoadingContext } from "../LoadingContext";
import { navigateToNewPage } from "../utils";

const AdminSidebar = () => {
  const { setPageLoaded } = useLoadingContext();
  const [userInfo, setUserInfo] = useState();
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    loadUserInfo(setUserInfo, setPageLoaded);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const adminIcon = require("../icons/adminIcon.png");
  return (
    <div className="adminSidebar">
      <div className="adminInfo">
        {userInfo && (
          <h3 className="greetings">Hi there, {userInfo.customerFname}</h3>
        )}
        <img className="adminIcon" src={adminIcon} alt="Admin icon" />
        <h1 className="Administrator">Administrator</h1>
      </div>
      <List>
        {[
          "Dashboard",
          "Orders",
          "Customers",
          "Products",
          // "Categories",
          // "Department",
          // "Staffs",
          "Back To Store",
        ].map((text, index) => (
          <ListItem
            key={text}
            onClick={() =>
              navigateToNewPage(index === 4 ? "/" : "/adminDashboard/" + text)
            }
          >
            <ListItemButton>
              <ListItemIcon>
                {((index) => {
                  switch (index + 1) {
                    case 1:
                      return <DashboardIcon />;
                    case 2:
                      return <ReceiptIcon />;
                    case 3:
                      return <AccountBoxIcon />;
                    case 4:
                      return <Inventory2Icon />;
                    case 5:
                      // return <CategoryIcon />;
                      return <StorefrontIcon />;
                    case 6:
                      return <StorefrontIcon />;
                    default:
                      return <SupervisorAccountIcon />;
                  }
                })(index)}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AdminSidebar;
