import React, { useEffect, useState } from "react";
import { createNewSearch, url } from "./utils";
import Product from "./Product";
import "./stylesheets/home.css";
import { useLoadingContext } from "./LoadingContext";

const getAllProducts = async (setProducts) => {
  const itemUrl = url + `/api/products`;
  await fetch(itemUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
    .then((e) => e.ok && e.json())
    .then((e) => setProducts(() => e));
};
const getSidebarCategories = async (setSidebarCategories) => {
  const categoriesUrl = url + "/api/category";
  await fetch(categoriesUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  })
    .then((e) => {
      if (e.ok) return e.json();
    })
    .then((e) => setSidebarCategories(() => e));
};

const getTrendingProducts = async (setTrendingProducts, setPageLoaded) => {
  const itemUrl =
    url + "/odata/Products?$orderby=ProductSoldQuantity%20desc&top=20";
  await fetch(itemUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
    .then((e) => e.ok && e.json())
    .then((e) => {
      setTrendingProducts(e.value);
      setPageLoaded(true);
    })
    .catch((e) => alert(e));
};

const Home = () => {
  const salesBanner = require("./icons/banner/saleBanner.webp");
  const [sidebarCategories, setSidebarCategories] = useState([]);
  const { setPageLoaded } = useLoadingContext();
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  useEffect(() => {
    getAllProducts(setProducts);
    getSidebarCategories(setSidebarCategories);
    getTrendingProducts(setTrendingProducts, setPageLoaded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="homeMain">
      <aside className="sideBar">
        <span className="title">Categories</span>
        {sidebarCategories &&
          sidebarCategories.map((category, key) => {
            const sidebarCategoryIcon = require(`./icons/category_icon/${category.categoryId}.png`);
            return (
              <span
                key={key}
                className="item"
                onClick={() => createNewSearch("category", category.categoryId)}
              >
                <img src={sidebarCategoryIcon} alt="" className="icon" />
                <span className="title">{category.categoryName}</span>
              </span>
            );
          })}
      </aside>
      <article className="productList banner">
        <h3 className="productListTitle">Limited Time Special Offers</h3>
        <img src={salesBanner} alt="salesBanner" />
      </article>
      <article className="productList trending">
        <h3 className="productListTitle">What's Hot</h3>
        {trendingProducts &&
          trendingProducts.map((product, key) => {
            return <Product product={product} key={key} />;
          })}
      </article>
      <article className="productList allItems">
        <h3 className="productListTitle">All Products</h3>
        {products &&
          products.map((product, key) => {
            return <Product product={product} key={key} />;
          })}
      </article>
    </main>
  );
};

export default Home;
