import React, { useEffect, useState } from "react";
import { useLoadingContext } from "./LoadingContext";
import AccountSidebar from "./AccountSidebar";
import { navigateToNewPage, url } from "./utils";
import "./stylesheets/pastOrders.css";

const getPastOrders = async (setPastOrders, setPageLoaded) => {
  try {
    const accountToken = localStorage.getItem("accountToken");
    if (!accountToken || accountToken.length < 10)
      throw new Error("Token not found or expired please login again");
    await fetch(url + "/api/Order/Customer", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accountToken,
      },
    })
      .then((e) => {
        if (e.ok) return e.json();
      })
      .then((e) => {
        setPastOrders(() => e);
        setPageLoaded(true);
      });
  } catch (e) {
    alert(e);
    navigateToNewPage("/login");
  }
};
const reloadOrdersWithOpts = (setOrders, setDialogueLoading) => {};

const PastOrders = () => {
  const { isLoading, setDialogueLoading, setPageLoaded } = useLoadingContext();
  const [pastOrders, setPastOrders] = useState([]);
  useEffect(() => {
    getPastOrders(setPastOrders, setPageLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="pastMain">
      <AccountSidebar />
      <h2 className="title">All orders</h2>
      <div className="orders">
        {pastOrders &&
          pastOrders.map((order, key) => (
            <div className="order" key={key}>
              <div className="orderId">Order #{order.orderId}</div>
              {order.details &&
                order.details.map((orderItem, key) => {
                  const itemImage = require(`./productImages/${orderItem.productCardId}_0.png`);
                  return (
                    <div className="orderItem" key={key}>
                      <img src={itemImage} alt={orderItem.productName} />
                      <div className="badge">{orderItem.orderItemQuantity}</div>
                      <h4 className="productName">{orderItem.productName}</h4>
                      <h5 className="departmentName">
                        {orderItem.departmentName}
                      </h5>
                      <h4 className="itemTotal">
                        ${Math.round(orderItem.orderItemTotal * 1000) / 1000}
                      </h4>
                    </div>
                  );
                })}
              <div className="orderTotal">
                <h5 className="label">Order total:</h5>
                <h5 className="value">
                  $ {Math.round(order.total * 1000) / 1000}
                </h5>
              </div>
              <button className="expandDetails">Details</button>
              <h3 className="subTitle">Advanced Details</h3>
              <div className="payment">
                <h5 className="label">Payment type</h5>
                <h5 className="value">{order.type}</h5>
              </div>
              <div className="orderStatus">
                <h5 className="label">Order status</h5>
                <h5 className="value">{order.orderStatus}</h5>
              </div>
              <div className="deliveryStatus">
                <h5 className="label">Delivery status</h5>
                <h5 className="value">{order.deliveryStatus}</h5>
              </div>
              <div className="orderDate">
                <h5 className="label">Order date</h5>
                <h5 className="value">{order.orderDate.replace("T", " ")}</h5>
              </div>
              <div className="shippingDate">
                <h5 className="label">Shipping date</h5>
                <h5 className="value">
                  {order.shippingDate.replace("T", " ")}
                </h5>
              </div>
              <div className="shippingMode">
                <h5 className="label">Shipping mode</h5>
                <h5 className="value">{order.shippingMode}</h5>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
};

export default PastOrders;
