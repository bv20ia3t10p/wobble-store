const currentWindow = new URL(window.location.href);
const accountToken = localStorage.getItem("accountToken");
const searchParams = currentWindow.searchParams;
const orderId = searchParams.get("orderId");
let cart = JSON.parse(localStorage.getItem("cart"));
var loadedUser = {};
var loadedOrder = {};
let container;
let main;

import { connect, fund } from "./handleWeb3.js";

window.addEventListener("DOMContentLoaded", async () => {
  await getCategories();
  main = document.querySelector("main");
  if (!accountToken || accountToken.length < 10) {
    alert("Not logged in, redirecting you to login page");
    navigateToNewPage("/loginOrRegister.html");
  }
  updateBadge(cart ? cart.length : 0);
  await loadCustomerInfo();
  console.log("dom", loadedUser);
  container = document.querySelector(".orderConfirmMain");
  await loadOrderInfo();
  document
    .querySelector("main button:last-of-type")
    .addEventListener("click", async () => {
      showLoadingPopup(true, main, "Processing your request");
      switch (document.querySelector("main select").value) {
        case "web3":
          await confirmWeb3();
          break;
        case "cash":
          await confirmCash();
          break;
        default:
          await confirmTransfer();
      }
      window.location.reload();
    });
  setLoadingPageVisibility(false);
});

const confirmCash = async () => {
  const updateOrderUrl = url + "/api/Order/Customer";
  await fetch(updateOrderUrl, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      type: "CASH",
      orderStatus: "CONFIRMED PAYMENT",
    }),
  })
    .then(async (e) => {
      if (e.ok) return e.json();
      else
        return e.text().then((text) => {
          throw new Error(text);
        });
    })
    .then(() => window.location.reload())
    .catch((e) => alert(e));
};

const confirmTransfer = async () => {
  const updateOrderUrl = url + "/api/Order/Customer";
  await fetch(updateOrderUrl, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      type: "TRANSFER",
      orderStatus: "CONFIRMED PAYMENT",
    }),
  })
    .then(async (e) => {
      if (e.ok) return e.json();
      else
        return e.text().then((text) => {
          throw new Error(text);
        });
    })
    .catch((e) => alert(e));
};

const confirmWeb3 = async () => {
  await connect();
  await fund(loadedOrder);
  const updateOrderUrl = url + "/api/Order/Customer";
  await fetch(updateOrderUrl, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + accountToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId,
      type: "WEB3",
      orderStatus: "CONFIRMED PAYMENT",
    }),
  })
    .then(async (e) => {
      if (e.ok) return e.json();
      else
        return e.text().then((text) => {
          throw new Error(text);
        });
    })
    .catch((e) => alert(e));
};

const loadCustomerInfo = async () => {
  const customerInfoUrl = url + "/api/Customer/Email";
  await fetch(customerInfoUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accountToken,
    },
  })
    .then(async (e) => {
      if (e.ok) return e.json();
      else if (e.status === 401) throw new Error("Unathorized");
      else
        return e.text().then((text) => {
          throw new Error(text);
        });
    })
    .then((e) => {
      loadedUser = e;
    })
    .catch((e) => {
      alert(e);
      navigateToNewPage("/loginOrRegister.html");
    });
};

const loadOrderInfo = async () => {
  if (!orderId || orderId.length < 1) {
    alert("Request invalid, redirecting to home page");
    navigateToNewPage("/index.html");
  }
  const customerInfoUrl = url + `/api/Order/${orderId}/Customer`;
  await fetch(customerInfoUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accountToken,
    },
  })
    .then(async (e) => {
      if (e.ok) return e.json();
      else
        return e.text().then((text) => {
          throw new Error(text);
        });
    })
    .then((e) => {
      let order = e;
      loadedOrder = order;
      console.log(loadedOrder);
      container.insertAdjacentHTML(
        "beforeend",
        `<div class ="order">
            <div class="orderId">
                Order #${order.orderId}
            </div>
            ${
              order.details &&
              order.details
                .map(
                  (od) =>
                    `
                <div class="orderItem">
                    <img src="Crawled Images/${od.productCardId}_0.png"</img>
                    <div class="badge">${od.orderItemQuantity}</div>
                    <h4 class = "productName">${od.productName}</h4>
                    <h5 class ="departmentName">${od.departmentName}</h5>
                    <h4 class="itemTotal">$${
                      Math.round(od.orderItemTotal * 1000) / 1000
                    }</h4>
                </div>`
                )
                .join("")
            }
              <div class="orderTotal">
                    <h5 class="label">Order total:</h5>
                    <h5 class="value">$ ${
                      Math.round(order.total * 1000) / 1000
                    }</h5>
              </div>
              <button class="expandDetails hidden">Details</button>
              <h3 class="subTitle">Advanced Details</h3>
              <div class="payment">
                    <h5 class="label">Payment type</h5>
                    <h5 class="value">${order.type}</h5>
              </div>
              <div class="orderStatus">
                    <h5 class="label">Order status</h5>
                    <h5 class="value">${order.orderStatus}</h5>
              </div>
              <div class="deliveryStatus">
                    <h5 class="label">Delivery status</h5>
                    <h5 class="value">${order.deliveryStatus}</h5>
              </div>
              <div class="orderDate">
                    <h5 class="label">Order date</h5>
                    <h5 class="value">${order.orderDate.replace("T", " ")}</h5>
              </div>
              <div class="shippingDate">
                    <h5 class="label">Shipping date</h5>
                    <h5 class="value">${order.shippingDate.replace(
                      "T",
                      " "
                    )}</h5>
              </div>
              <div class="shippingMode">
                    <h5 class="label">Shipping mode</h5>
                    <h5 class="value">${order.shippingMode}</h5>
              </div>
        </div>`
      );
    })
    .catch((e) => {
      alert(
        "Request invalid, redirecting to home page\nAdvanced details: " + e
      );
      navigateToNewPage("/index.html");
    });
};
