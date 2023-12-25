import React from "react";
import { navigateToNewPage } from "./utils";
import './stylesheets/order.css'


const Order = ({ order }) => {
  return (
    <div className="singleOrderView">
      <div
        className="orderId"
        onClick={() =>
          navigateToNewPage("/OrderDetails", { orderId: order.orderId })
        }
      >
        Order #{order.orderId}
      </div>
      {order.details &&
        order.details.map((orderItem, key) => {
          const itemImage = require(`./productImages/${orderItem.productCardId}_0.png`);
          return (
            <div className="orderItem" key={key}>
              <img src={itemImage} alt={orderItem.productName} />
              <div className="badge">{orderItem.orderItemQuantity}</div>
              <h4 className="productName">{orderItem.productName}</h4>
              <h5 className="departmentName">{orderItem.departmentName}</h5>
              <h4 className="itemTotal">
                ${Math.round(orderItem.orderItemTotal * 1000) / 1000}
              </h4>
            </div>
          );
        })}
      <div className="orderTotal">
        <h5 className="label">Order total:</h5>
        <h5 className="value">$ {Math.round(order.total * 1000) / 1000}</h5>
      </div>
      <button className="expandDetails hidden">Details</button>
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
        <h5 className="value">{order.shippingDate.replace("T", " ")}</h5>
      </div>
      <div className="shippingMode">
        <h5 className="label">Shipping mode</h5>
        <h5 className="value">{order.shippingMode}</h5>
      </div>
    </div>
  );
};

export default Order;
