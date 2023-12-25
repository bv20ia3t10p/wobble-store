import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../LoadingContext";
import AdminSideBar from "./AdminSidebar";
import { loadUserInfo } from "../Cart";

const AdminDashboard = () => {
  const { isLoading, setPageLoaded } = useLoadingContext();
  useEffect(() => {
    setPageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <AdminSideBar></AdminSideBar>
    </div>
  );
};

export default AdminDashboard;
