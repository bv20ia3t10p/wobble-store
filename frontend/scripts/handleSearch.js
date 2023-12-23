const currentWindow = new URL(window.location.href);
const searchParams = currentWindow.searchParams;
const categorySearch = searchParams.get("category");
const searchQuery = searchParams.get("searchQuery");
const additionalOpt = searchParams.get("additionalOpt");
const sortOptions = searchParams.get("sort");
let cart = JSON.parse(localStorage.getItem("cart"));
let fetchedProducts = [];
console.log(cart);
const main = document.querySelector(".searchMain");

document.addEventListener("DOMContentLoaded", async () => {
  setLoadingPageVisibility(true);
  await getCategories();
  if (categorySearch) await getItemsByCategory(categorySearch);
  if (searchQuery) await getItemsByName(searchQuery);
  updateBadge(cart ? cart.length : 0);
  document
    .querySelector(".searchControls button")
    .addEventListener("click", () => {
      applyOptions();
    });
  document
    .querySelector("#priceRange")
    .addEventListener("change", (e) =>
      removeAndReplaceNodeText(
        document.querySelector('label[for="priceRange"]'),
        "Minimum product price: $" + e.target.value
      )
    );
  if (!categorySearch && (!searchQuery || searchQuery.length === 0)) {
    if (cart && cart.length) await getItemRecommendation(cart.map((e) => e.id));
    else await getItemRecommendation([]);
    setLoadingPageVisibility(false);
  }
});

const waitAndLoadRecs = async () => {
  let recsId = cart && cart.length ? cart.map((e) => e.id) : [];
  console.log(recsId, fetchedProducts);
  recsId = [
    ...recsId,
    ...(fetchedProducts.length
      ? fetchedProducts.map((e) => e.ProductCardId)
      : []),
  ];
  await getItemRecommendation(recsId);
  setLoadingPageVisibility(false);
};

const getItemsByCategory = async (id) => {
  const queryUrl =
    url +
    `/odata/Products?filter=CategoryId Eq ${id} ${
      additionalOpt ? "and " + additionalOpt : ""
    } ${sortOptions ? "&$orderby=" + sortOptions : ""}`;
  await fetch(queryUrl)
    .then((e) => (e.ok ? e.json() : e))
    .then(async (data) => {
      fetchedProducts = data.value;
      data.value.map((item) => {
        document.querySelector(".searchResult").insertAdjacentHTML(
          "beforeend",
          `<div class ="item" >
            <img onClick =openItemDetails(${
              item.ProductCardId
            }) src = "/Crawled Images/${item.ProductCardId}_1.png"
            />
            <span class="name">${item.ProductName}</span>
            <span class="itemSold">${item.ProductSoldQuantity} sold</span>
            <span class="price">$${
              Math.round(item.ProductPrice * 1000) / 1000
            }</span>
            <span class="button"  onclick=addToCart(${
              item.ProductCardId
            },1)><img src="icons/addCart.png"/></span>
            </div>`
        );
      });
      await waitAndLoadRecs();
    });
};

const getItemsByName = async (query) => {
  const queryUrl =
    url +
    `/odata/Products?${
      query.length > 0
        ? "$filter=contains(tolower(ProductName),tolower('" + query + "'))"
        : ""
    }  ${additionalOpt ? "and " + additionalOpt : ""} ${
      sortOptions ? "&$orderby=" + sortOptions : ""
    }`;
  console.log(queryUrl);
  await fetch(queryUrl)
    .then((e) => (e.ok ? e.json() : e))
    .then(async (data) => {
      fetchedProducts = data.value;
      data.value.map((item) => {
        document.querySelector(".searchResult").insertAdjacentHTML(
          "beforeend",
          `<div class ="item" >
            <img onClick =openItemDetails(${
              item.ProductCardId
            }) src = "/Crawled Images/${item.ProductCardId}_1.png"
            />
            <span class="name">${item.ProductName}</span>
            <span class="itemSold">${item.ProductSoldQuantity} sold</span>
            <span class="price">$${
              Math.round(item.ProductPrice * 1000) / 1000
            }</span>
            <span class="button"  onclick=addToCart(${
              item.ProductCardId
            },1)><img src="icons/addCart.png"/></span>
            </div>`
        );
      });
      await waitAndLoadRecs();
    });
};

const applyOptions = () => {
  const userSortOption = document.querySelector(".searchControls select").value;
  const minPrice = document.querySelector("#priceRange").value;
  createNewSearch(
    categorySearch ? "category" : "searchQuery",
    categorySearch ? categorySearch : searchQuery,
    "ProductPrice gt " + minPrice,
    userSortOption
  );
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

const addAndUpdateRecs = async (id, quantity) => {
  addToCart(id, quantity);
  cart = JSON.parse(localStorage.getItem("cart"));
  window.location.reload();
};
