var cart = [];
var productsFromCart = [];
var fetchedProducts = [];
var customerInfo = {};
var accountToken = "";

window.addEventListener("DOMContentLoaded", async function (ev) {
  try {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateBadge(cart.length);
    if (cart.length === 0) throw new Error("Empty cart");
  } catch (e) {
    console.log(e);
    updateBadge(0);
  }
  accountToken = this.localStorage.getItem("accountToken");
  if (!accountToken) {
    alert("Not logged in. Please login or register to continue");
    navigateToNewPage("/loginOrRegister.html");
  }
  await accountInfoLoad();
  checkNullFields();
  this.document
    .querySelector(".delivery button.change")
    .addEventListener("click", () => navigateToNewPage("/dashboard.html"));
  await getCategories();
  await getItemsFromCart();
  if (cart) await getItemRecommendation(cart.map((e) => e.id));
  else await getItemRecommendation([]);
  this.document
    .querySelector("#cartAllItemChk")
    .addEventListener("change", (e) => {
      this.document
        .querySelectorAll(".cartDetails .single .itemCheck")
        .forEach((t) => (t.checked = e.target.checked));
      checkChanged();
    });
  checkChanged();
  this.document
    .querySelector(".cartMain .purchase")
    .addEventListener("click", createOrder);
  setLoadingPageVisibility(false);
});

const modifyQuantity = (id, quantity, replace = false) => {
  console.log("Modify params: " + id + " " + quantity);
  cart = cart.map((e) => {
    if (e.id === Number(id)) {
      console.log("Found");
      e.quantity = replace ? Number(quantity) : e.quantity + Number(quantity);
      if (e.quantity <= 0) {
        removeItemFromCart(id);
        return;
      }
    }
    return e;
  });
  if (!replace) updateQuantity(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateItemTotal();
};

const updateQuantity = (id) => {
  const containerNode = document.querySelector(
    `.cartDetails .single[productid="${id}"]`
  );
  containerNode.querySelector(".quantityControl .value").value = cart.filter(
    (e) => e.id === id
  )[0].quantity;
};

const checkNullFields = () => {
  if (Object.values(customerInfo).filter((e) => e === null || e === 0).length) {
    alert(
      "Please fill out all fields that are currently null or 0 before continuing to order"
    );
    navigateToNewPage("/dashboard.html");
  }
};
const addAndUpdateRecs = async (id, quantity) => {
  showLoadingPopup(true, document.querySelector("main"), "Updating cart...");
  addToCart(id, quantity);
  cart = JSON.parse(localStorage.getItem("cart"));
  clearAllContent(document.querySelector(".itemRecs .recommendations"));
  clearAllContent(document.querySelector(".cartDetails"));
  await getItemsFromCart();
  await getItemRecommendation(cart.map((e) => e.id));
  updateItemTotal();
  checkChanged();
  updateBadge(cart.length);
  showLoadingPopup(false, document.querySelector("main"));
};

const removeItemFromCart = async (id) => {
  showLoadingPopup(true, document.querySelector("main"), "Updating cart...");
  const node = document.querySelector(
    `.cartDetails .single[productid="${id}"]`
  );
  node.parentElement.removeChild(node);
  cart = cart.filter((e) => e.id !== id);
  console.log(cart);
  clearAllContent(document.querySelector(".itemRecs .recommendations"));
  clearAllContent(document.querySelector(".cartDetails"));
  localStorage.setItem("cart", JSON.stringify(cart));
  await getItemsFromCart();
  await getItemRecommendation(cart.map((e) => e.id));
  updateItemTotal();
  checkChanged();
  updateBadge(cart.length);
  showLoadingPopup(false, document.querySelector("main"));
};

const updateItemTotal = () => {
  let sum = 0;
  let itemCount = 0;
  try {
    document.querySelectorAll(".cartDetails .single").forEach((e) => {
      let price = e.getAttribute("price");
      let quantity = e.querySelector(".quantityControl .value").value;
      if (e.querySelector(".description .itemCheck").checked) {
        sum += price * quantity;
        itemCount += 1;
      }
      let total = Math.round(price * quantity * 1000) / 1000;
      const itemTotalNode = e.querySelector(".total");
      itemTotalNode.removeChild(itemTotalNode.lastChild);
      itemTotalNode.appendChild(document.createTextNode(total));
    });
    const orderTotalNode = document.querySelector(".orderTotal .final .data");
    orderTotalNode.removeChild(orderTotalNode.childNodes[0]);
    orderTotalNode.appendChild(
      document.createTextNode(Math.round(sum * 1000) / 1000)
    );
    if (itemCount === cart.length) {
      const selectLabel = document.querySelector(
        '.columns label[for="cartAllItemChk"]'
      );
      selectLabel.removeChild(selectLabel.childNodes[0]);
      selectLabel.append(
        document.createTextNode(`Select all products (${cart.length} products)`)
      );
    }
  } catch (error) {
    console.log(error);
  }
};
const checkChanged = () => {
  const itemCheckBoxes = Array.from(
    document.querySelectorAll(".cartDetails .single .itemCheck")
  );
  itemCheckBoxes.map((e) => {
    let id = Number(e.parentNode.parentNode.getAttribute("productid"));
    console.log(id);
    cart = cart.map((t) => {
      if (t.id === id) t.checked = e.checked;
      return t;
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    if (e.checked) return e;
  });
  if (!cart) return;
  const checkedCount = cart.filter((e) => e.checked).length;
  document.querySelector("#cartAllItemChk").checked =
    checkedCount === cart.length;
  console.log(checkedCount);
  const purchaseNode = document.querySelector(".cartMain .purchase");
  purchaseNode.removeChild(purchaseNode.childNodes[0]);
  purchaseNode.appendChild(
    document.createTextNode(`Purchase (${checkedCount})`)
  );
  updateItemTotal();
};

const getItemsFromCart = async () => {
  if (!cart) {
    updateBadge(0);
    return;
  }
  if (!cart.length) return;
  const requestBody = cart.map((e) => e.id);
  console.log(requestBody);
  const getItemsFromCartUrl = url + "/api/Products/Multiple";
  const resp = await fetch(getItemsFromCartUrl, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  fetchedProducts = await resp.json();
  console.log(fetchedProducts);
  document.querySelector(".cartMain .cartDetails").insertAdjacentHTML(
    "beforeend",
    fetchedProducts
      .map(
        (e, index) => `<div class ="single" productid=${
          e.productCardId
        } price=${e.productPrice}>
      <div class="description">
        <input type="checkbox" class="itemCheck"/>
        <img src = "Crawled Images/${e.productCardId}_0.png" class="itemImg"/>
        <p class ="productName">${e.productName}</p>
      </div>
      <div class="price">
        ${Math.round(e.productPrice * 1000) / 1000}
      </div>
      <div class="quantityControl">
        <button class="subtract" onclick=modifyQuantity(${
          e.productCardId
        },-1)>-</button>
        <input type="number" class="value" value="${cart[index].quantity}"/>
        <button class="add" onclick=modifyQuantity(${
          e.productCardId
        },1)>+</button>
      </div>
      <div class="total">
        ${Math.round(e.productPrice * cart[index].quantity * 1000) / 1000}
      </div>
      <button class="delete" onclick=removeItemFromCart(${
        e.productCardId
      })></button>
    </div>`
      )
      .join("")
  );
  const selectLabel = document.querySelector(
    '.columns label[for="cartAllItemChk"]'
  );
  selectLabel.removeChild(selectLabel.childNodes[0]);
  selectLabel.append(
    document.createTextNode(`Select all products (${cart.length} products)`)
  );
  document
    .querySelectorAll(".cartDetails .single .quantityControl .value")
    .forEach((e) =>
      e.addEventListener("change", (t) => {
        const containerNode = t.target.parentNode.parentNode;
        let id = containerNode.getAttribute("productid");
        modifyQuantity(id, t.target.value, true);
      })
    );
  document
    .querySelectorAll(".cartDetails .single .itemCheck")
    .forEach((e) => e.addEventListener("change", checkChanged));
  document.querySelectorAll(".cartDetails .single .itemCheck").forEach((e) => {
    e.checked = cart.filter(
      (t) => t.id === Number(e.parentNode.parentNode.getAttribute("productid"))
    )[0].checked;
  });
  updateItemTotal();
};

const getItemRecommendation = async (ids) => {
  let resp;
  let flag = !ids.length;
  if (flag) {
    recItemUrl =
      url + "/odata/Products?$orderby=ProductSoldQuantity%20desc&top=20";
    resp = await fetch(recItemUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
  } else {
    recItemUrl = flask_url + "/mlApi/ProductRec";
    resp = await fetch(recItemUrl, {
      method: "POST",
      body: JSON.stringify(ids),
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
  }
  let data = await resp.json();
  if (flag) data = data.value;
  console.log(data);
  document.querySelector(".recommendations").insertAdjacentHTML(
    "beforeend",
    `
    ${data
      .map((item, no) => {
        if (no < 20)
          return `
        <div class ="item" >
    <img onClick =openItemDetails(${
      flag ? item.ProductCardId : item.productCardId
    }) src = "/Crawled Images/${
            flag ? item.ProductCardId : item.productCardId
          }_1.png"
    />
    <span class="name">${flag ? item.ProductName : item.productName}</span>
    <span class="itemSold">${
      flag ? item.ProductSoldQuantity : item.productSoldQuantity
    } sold</span>
    <span class="price">$ ${
      flag
        ? Math.round(item.ProductPrice * 1000) / 1000
        : Math.round(item.productPrice * 1000) / 1000
    }</span>
    <span class="button"  onclick=addAndUpdateRecs(${
      flag ? item.ProductCardId : item.productCardId
    },1)><img src="icons/addCart.png"/></span>
    </div>`;
      })
      .join("")}    `
  );
};

const accountInfoLoad = async () => {
  let accountToken = "";
  try {
    accountToken = localStorage.getItem("accountToken");
    if (accountToken.length < 1) {
      alert("Not logged in. Please login or register to continue");
      navigateToNewPage("/loginOrRegister.html");
    }
  } catch (e) {
    return;
  }
  const accoutnInfoUrl = url + "/api/Customer/Email";
  const accountData = await fetch(accoutnInfoUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accountToken,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
    .then((e) => {
      if (e.status === 401) {
        throw new Error("Token expired, redirecting you to login page");
      } else return e.json();
    })
    .catch((e) => {
      alert(e);
      navigateToNewPage("/loginOrRegister.html");
    });
  console.log(accountData);
  customerInfo = accountData;
  removeAndReplaceNodeText(
    document.querySelector(".delivery .advanced .country .data"),
    customerInfo.customerCountry
  );
  removeAndReplaceNodeText(
    document.querySelector(".delivery .advanced .city .data"),
    customerInfo.customerCity
  );
  removeAndReplaceNodeText(
    document.querySelector(".delivery .advanced .state .data"),
    customerInfo.customerState
  );
  removeAndReplaceNodeText(
    document.querySelector(".delivery .advanced .zip .data"),
    customerInfo.customerZipcode
  );
  removeAndReplaceNodeText(
    document.querySelector(".delivery .advanced .street .data"),
    customerInfo.customerStreet
  );
  removeAndReplaceNodeText(
    document.querySelector(".delivery .basic .name"),
    customerInfo.customerFname + " " + customerInfo.customerLname
  );
  removeAndReplaceNodeText(
    document.querySelector(".delivery .basic .email"),
    customerInfo.customerEmail
  );
};

const createOrder = async () => {
  showLoadingPopup(
    true,
    document.querySelector("main.cartMain"),
    "Processing your order..."
  );
  let orderCreationRequestBody = {
    type: "CASH",
    customerId: customerInfo.customerId,
    orderDetails: cart
      .map((e) => {
        if (e.checked)
          return {
            productCardId: Number(e.id),
            orderItemQuantity: Number(e.quantity),
          };
      })
      .filter((e) => e),
  };
  console.log(orderCreationRequestBody);
  const createOrderUrl = url + "/api/Order/Customer";
  const resp = await fetch(createOrderUrl, {
    method: "POST",
    body: JSON.stringify(orderCreationRequestBody),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accountToken,
      "Access-Control-Allow-Origin": "*",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  const data = await resp.json();
  console.log("Created order", data);
  cart = cart.filter((e) => !e.checked);
  localStorage.setItem("cart", JSON.stringify(cart));
  clearAllContent(document.querySelector(".itemRecs .recommendations"));
  clearAllContent(document.querySelector(".cartDetails"));
  await getItemsFromCart();
  await getItemRecommendation(cart.map((e) => e.id));
  updateItemTotal();
  checkChanged();
  updateBadge(cart.length);
  showLoadingPopup(
    false,
    document.querySelector("main.cartMain"),
    "Processing..."
  );
  navigateToNewPage("/orderConfirmation.html", { orderId: data.orderId });
};
