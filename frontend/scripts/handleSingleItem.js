var viewingProductId = 0;

window.addEventListener("DOMContentLoaded",async function (ev) {
  const currentWindow = new URL(
    window.location.href.replace("#state=", "?state=")
  );
  try {
    viewingProductId = currentWindow.searchParams.get("productId");
  } catch (e) {
    this.alert(e);
  }
  try {
    updateBadge(JSON.parse(localStorage.getItem("cart")).length);
  } catch (e) {
    console.log(e);
  }
  console.log("DOMContentLoaded event");
  await getCategories();
  await getSingleItem(viewingProductId);
  await getItemRecommendation(viewingProductId);
  setLoadingPageVisibility(false);
});

currentViewing = 0;
currentQuantity = 1;

const moveSlides = (direction = null, index = null) => {
  if (index !== null) {
    currentViewing = index;
  } else {
    switch (direction) {
      case direction < 0:
        currentViewing = currentViewing === 0 ? 5 : currentViewing - 1;
        break;
      default:
        currentViewing = currentViewing === 5 ? 0 : currentViewing + 1;
    }
  }
  document
    .querySelectorAll(".itemImages .slideshow .singleImage")
    .forEach((t, counter) => {
      t.setAttribute(
        "class",
        counter === currentViewing ? "singleImage" : "singleImage hiddenImg"
      );
    });
  document
    .querySelectorAll(".itemImages .minimizeImage")
    .forEach((t, counter) => {
      t.setAttribute(
        "class",
        counter === currentViewing ? "minimizeImage highlight" : "minimizeImage"
      );
    });
};
const getSingleItem = async (id) => {
  itemUrl = url + `/api/Products/${id}`;
  const resp = await fetch(itemUrl, {
    method: "GET",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify({"id":id}), // body data type must match "Content-Type" header
  });
  const data = await resp.json();
  document.querySelector(".itemDetailMain").insertAdjacentHTML(
    `beforeend`,
    `<div class ="itemImages">
    <div class="buttonContainer">
    <button onclick=moveSlides(-1)></button>
    <button onclick=moveSlides(1)></button>
    </div>
    <div class="slideshow">
    ${Array.from(Array(6).keys())
      .map(
        (val) =>
          `<img class="singleImage ${
            val != currentViewing ? "hiddenImg" : ""
          }" src="/Crawled Images/${data.productCardId}_${val}.png"/>`
      )
      .join("")}
    </div>
    <div class ="itemImagesMinimize">
    ${Array.from(Array(6).keys())
      .map(
        (val) =>
          `<img onclick=moveSlides(0,${val}) class="minimizeImage ${
            val === currentViewing ? "highlight" : ""
          }" src="/Crawled Images/${data.productCardId}_${val}.png"/>`
      )
      .join("")}
    </div>
    </div>
    `
  );

  document.querySelector(".itemDetailMain").insertAdjacentHTML(
    "beforeend",
    `
  <div class="ProductInfo">
  <span class="name">${data.productName}</span>
  <span class="depName"><span class="label">Department in charge: </span><span class="data">${
    data.departmentName
  }</span></span>
  <span class ="sold">${data.productSoldQuantity} products sold</span>
  <span class ="price">$${Math.round(data.productPrice * 1000) / 1000}</span>
  </div>
  <div class="AdvancedProductInfo">
  <h1 class="header">Other product information</h1>
  <span class ="id"><span class="label">Product Id: </span><span class="data">${
    data.productCardId
  }</span></span>
  <span class="status"><span class="label">Availability Status: </span><span class="data">${
    data.productStatus ? "Available" : "Not Available (Order for later)"
  }</span></span>
  </div>`
  );
  document.querySelector(".itemDetailMain").insertAdjacentHTML(
    "beforeend",
    `
    <div class ="description">
    <h1 class="header">Product Description</h1>
    <div class="descriptionDetail">${data.productDescription}</div>
    <button class="expand">&#x21E9</button>
    </div>
    <div class="cart">
    <div class="quantityControl">
    <span class="label">Order Quantity</span>
    </div>
    <div class="controls">
    <button class="subtract" onClick="subtractItem(${data.productPrice})">
    -
    </button>
    <input type="number" class="quantity data" value="${currentQuantity}"/>
    <button class="add" onClick="addItem(${data.productPrice})">
    +
    </button>
    </div>
    <span class="label">Estimated Totals</span><span class="total">$ ${
      Math.round(data.productPrice * currentQuantity * 1000) / 1000
    }</span>
    <button class="toCart">
    Add to cart
  </button>
  <button class ="instaBuy">
  Buy now
  </button>
</div>`
  );
  document
    .querySelector(".description .expand")
    .addEventListener("click", (e) => {
      let node = document.querySelector(".descriptionDetail");
      let currentClass = node.getAttribute("class");
      let expandNode = e.target;
      try {
        while (expandNode.firstChild)
          expandNode.removeChild(expandNode.lastChild);
      } catch (e) {
        console.log(e);
      }
      expandNode.appendChild(
        document.createTextNode(
          currentClass === "descriptionDetail" ? "\u21E7" : "\u21E9"
        )
      );
      node.setAttribute(
        "class",
        currentClass === "descriptionDetail"
          ? "descriptionDetail open"
          : "descriptionDetail"
      );
    });
  document
    .querySelector(".itemDetailMain .toCart")
    .addEventListener("click", () => {
      addToCart(
        Number(
          document.querySelector(
            "body > main > div.AdvancedProductInfo > span.id > span.data"
          ).textContent
        ),
        currentQuantity
      );
    });
  setInterval(() => moveSlides(1), 3000);
  console.log(data);
};

const addItem = (price) => {
  currentQuantity++;
  document.querySelector(".itemDetailMain  .total").textContent =
    "$ " + Math.round(price * currentQuantity * 1000) / 1000;
  document.querySelector(".itemDetailMain .quantity").value = currentQuantity;
};

const subtractItem = (price) => {
  if (currentQuantity - 1 < 1) return;
  currentQuantity--;
  document.querySelector(".itemDetailMain  .total").textContent =
    "$ " + Math.round(price * currentQuantity * 1000) / 1000;
  document.querySelector(".itemDetailMain  .quantity").value = currentQuantity;
};

const getItemRecommendation = async (id) => {
  recItemUrl = flask_url + "/mlApi/ProductRec/" + id;
  const resp = await fetch(recItemUrl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "no-cors",
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  const data = await resp.json();
  document.querySelector(".itemDetailMain").insertAdjacentHTML(
    "beforeend",
    `<div class="relevantItems">
    <h1 class="header">You might be interested in</h1>
    ${data
      .map((item, no) => {
        if (no < 20)
          return `
        <div class ="item" >
    <img onClick =openItemDetails(${
      item.productCardId
    }) src = "/Crawled Images/${item.productCardId}_1.png"
    />
    <span class="name">${item.productName}</span>
    <span class="itemSold">${item.productSoldQuantity} sold</span>
    <span class="price">$ ${Math.round(item.productPrice * 1000) / 1000}</span>
    <span class="button"  onclick=addToCart(${
      item.productCardId
    },1)><img src="icons/addCart.png"/></span>
    </div>`;
      })
      .join("")}
    </div>
    `
  );
};
