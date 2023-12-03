document.addEventListener("DOMContentLoaded", async () => {
  try {
    updateBadge(JSON.parse(localStorage.getItem("cart")).length);
  } catch (e) {
    console.log(e);
    updateBadge(0);
  }
  await getData();
  await getCategories();
  await getSidebarCategories();
  await getPopularProducts();
  setLoadingPageVisibility(false);
});

let productsTemp = [];

const getData = async () => {
  itemUrl = url + `/api/products`;
  const resp = await fetch(itemUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  const data = await resp.json();
  data.map((item) => {
    document.querySelector(".productList.allItems").insertAdjacentHTML(
      "beforeend",
      `<div class ="item" >
    <img onClick =openItemDetails(${
      item.productCardId
    }) src = "/Crawled Images/${item.productCardId}_1.png"
    />
    <span class="name">${item.productName}</span>
    <span class="itemSold">${item.productSoldQuantity} sold</span>
    <span class="price">$ ${Math.round(item.productPrice * 1000) / 1000}</span>
    <span class="button" onclick=addToCart(${
      item.productCardId
    },1)><img src="icons/addCart.png"/></span>
    </div>`
    );
  });
  productsTemp = data;
  console.log(data);
};

const getPopularProducts = async () => {
  itemUrl = url + "/odata/Products?$orderby=ProductSoldQuantity%20desc&top=20";
  const resp = await fetch(itemUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  const data = await resp.json();
  data.value.map((item) => {
    document.querySelector(".productList.trending").insertAdjacentHTML(
      "beforeend",
      `<div class ="item" >
    <img onClick =openItemDetails(${
      item.ProductCardId
    }) src = "/Crawled Images/${item.ProductCardId}_1.png"
    />
    <span class="name">${item.ProductName}</span>
    <span class="itemSold">${item.ProductSoldQuantity} sold</span>
    <span class="price">$${Math.round(item.ProductPrice * 1000) / 1000}</span>
    <span class="button"  onclick=addToCart(${
      item.ProductCardId
    },1)><img src="icons/shoppingRedIcon.png"/></span>
    </div>`
    );
  });
  console.log(data.value);
};
const getSidebarCategories = async () => {
  categoriesUrl = url + "/api/category";
  const resp = await fetch(categoriesUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  const data = await resp.json();
  data.map((cat) => {
    document.querySelector(".sideBar").insertAdjacentHTML(
      "beforeend",
      `<span
        onclick = createNewSearch("category",${cat.categoryId})
        class="item"><img class="icon" src ="icons/category_icon/${cat.categoryId}.png" /><span class="title">${cat.categoryName}</span></span>`
    );
  });
  console.log(data);
};


