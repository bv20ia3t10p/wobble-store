import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../LoadingContext";
import { url } from "../utils";
const loadAdminOrders = async (setOrders, setDialogueLoading, pageNumber) => {
  const accountToken = localStorage.getItem("accountToken");
  await fetch(url + "/api/Order?pageNumber=" + pageNumber + "&pageSize=10", {
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-type":"application/json"
    },
  })
    .then((e) => e.ok && e.json())
    .then((e) => {
      console.log(e);
      setOrders(() => e);
      setDialogueLoading(false);
    })
    .catch((e) => alert(e));
};

const setPagination = (page, setCurrentPage) => {
  const maxItems = 15;
};

const AdminOrders = () => {
  const { setPageLoaded, setDialogueLoading } = useLoadingContext();
  const [orders, setOrders] = useState([]);
  const [currentPageOrders, setCurrentPageOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    loadAdminOrders(setOrders, setDialogueLoading,2);
    // setPageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="adminOrdersMain"></div>;
};

export default AdminOrders;
