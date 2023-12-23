var loadedUser = {};
const accountToken = localStorage.getItem("accountToken");
var loadedOrders = [];
let cart = JSON.parse(localStorage.getItem("cart"));

window.addEventListener("DOMContentLoaded", async () => {
  await getCategories();
  if (!accountToken || accountToken.length < 10) {
    alert("Not logged in, redirecting you to login page");
    navigateToNewPage("/loginOrRegister.html");
  }
  updateBadge(cart ? cart.length : 0);
  console.log("dom", loadedUser);
  await loadOrders();
  console.log("dom2", loadedOrders);
  loadOrdersOntoUI();
  setLoadingPageVisibility(false);
});

const loadOrders = async () => {
  const pastOrdersUrl = url + "/api/Order/Customer";
  await fetch(pastOrdersUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accountToken,
    },
  })
    .then((e) => {
      if (e.ok) return e.json();
    })
    .then((e) => (loadedOrders = e));
};

const loadOrdersOntoUI = () => {
  if (!loadedOrders) return;
  const container = document.querySelector(".pastMain .orders");
  container.insertAdjacentHTML(
    "beforeend",
    loadedOrders
      .map(
        (order) =>
          `<div class ="order">
        <div class="orderId">
            Order #${order.orderId}
        </div>
        ${order.details && order.details
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
          .join("")}
          <div class="orderTotal">
                <h5 class="label">Order total:</h5>
                <h5 class="value">$ ${Math.round(order.total*1000)/1000}</h5>
          </div>
          <button class="expandDetails">Details</button>
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
                <h5 class="value">${order.orderDate.replace("T"," ")}</h5>
          </div>
          <div class="shippingDate">
                <h5 class="label">Shipping date</h5>
                <h5 class="value">${order.shippingDate.replace("T"," ")}</h5>
          </div>
          <div class="shippingMode">
                <h5 class="label">Shipping mode</h5>
                <h5 class="value">${order.shippingMode}</h5>
          </div>
    </div>`
      )
      .join("")
  );
};
