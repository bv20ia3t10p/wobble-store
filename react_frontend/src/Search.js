import React, { useEffect, useState } from "react";
import { useLoadingContext } from "./LoadingContext";
import Product from "./Product";
import { flask_url, url } from "./utils";
import "./stylesheets/search.css";

const getItemsByCategory = async (
  id,
  setSearchResults,
  additionalOpt,
  sortOptions
) => {
  const queryUrl =
    url +
    `/odata/Products?filter=CategoryId Eq ${id} ${
      additionalOpt ? "and " + additionalOpt : ""
    } ${sortOptions ? "&$orderby=" + sortOptions : ""}`;
  await fetch(queryUrl)
    .then((e) => e.ok && e.json())
    .then((data) => setSearchResults(data.value));
};

export const getItemRecommendation = async (
  ids,
  setRecs,
  setDialogueLoading = null
) => {
  let resp;
  let flag = !ids.length;
  let recItemUrl;
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
    if (setDialogueLoading) setDialogueLoading(false);
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
    if (setDialogueLoading) setDialogueLoading(false);
  }
  try {
    const data = await resp.json();
    console.log(data);
    if (flag) setRecs(() => data.value);
    else setRecs(() => data);
  } catch (e) {
    console.log(e);
    // setPageLoaded(true);
    recItemUrl =
      url + "/odata/Products?$orderby=ProductSoldQuantity%20desc&top=20";
    await fetch(recItemUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(e=>e.ok);
  }
};

const getItemsByName = async (
  query,
  setSearchResults,
  additionalOpt,
  sortOptions
) => {
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
    .then((e) => (e.ok ? e.json() : new Error(e)))
    .then((data) => {
      setSearchResults(() => data.value);
    })
    .catch((e) => alert(e));
};

const Search = () => {
  const { setPageLoaded, isLoading, setDialogueLoading } = useLoadingContext();
  const [searchResults, setSearchResults] = useState([]);
  const [recResults, setRecResults] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [sortOpt, setSortOpt] = useState("ProductPrice asc");
  useEffect(() => {
    if (searchResults && recResults) setPageLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults, recResults]);
  // useEffect(() => {});
  useEffect(() => {
    const currentWindow = new URL(window.location.href);
    const searchParams = currentWindow.searchParams;
    const categorySearch = searchParams.get("category");
    const searchQuery = searchParams.get("searchQuery");
    const additionalOpt = searchParams.get("additionalOpt")
      ? searchParams.get("additionalOpt")
      : null;
    const sortOptions = searchParams.get("sort")
      ? searchParams.get("sort")
      : null;
    if (categorySearch)
      getItemsByCategory(
        categorySearch,
        setSearchResults,
        additionalOpt,
        sortOptions
      );
    else
      getItemsByName(searchQuery, setSearchResults, additionalOpt, sortOptions);
  }, []);
  useEffect(() => {
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;
    let ids = [];
    if (cart) ids = [...ids, ...cart.map((e) => e.id)];
    if (searchResults)
      ids = [...ids, ...searchResults.map((e) => e.ProductCardId)];
    getItemRecommendation(ids, setRecResults);
  }, [searchResults]);
  const refreshSearch = async () => {
    setDialogueLoading(true, "Refreshing your search");
    const currentWindow = new URL(window.location.href);
    const searchParams = currentWindow.searchParams;
    const searchQuery = searchParams.get("searchQuery");
    if (searchQuery)
      await getItemsByName(
        searchQuery,
        setSearchResults,
        "ProductPrice gt " + minPrice,
        sortOpt
      );
    const categoryId = searchParams.get("categoryId");
    if (categoryId)
      await getItemsByCategory(
        searchQuery,
        setSearchResults,
        "ProductPrice gt " + minPrice,
        sortOpt
      );
    setDialogueLoading(false);
  };
  return (
    <main className={`searchMain ${isLoading ? "dimmed" : ""}`}>
      <div className="searchControls">
        <h2 className="title">Filter options</h2>
        <select
          name="sort"
          value={sortOpt}
          onChange={(e) => setSortOpt(() => e.target.value)}
        >
          <option value="ProductPrice asc">Ascending product price</option>
          <option value="ProductPrice desc">Descending product price</option>
          <option value="ProductSoldQuantity desc">Trending products</option>
          <option value="ProductName asc">A-Z</option>
          <option value="ProductName desc">Z-A</option>
        </select>
        <label htmlFor="priceRange">Minimum price: ${minPrice}</label>
        <h3 className="valueRange">0</h3>
        <input
          type="range"
          value={minPrice}
          onChange={(e) => setMinPrice(() => e.target.value)}
          min="0"
          step="10"
          max="1000"
          name="priceRange"
          id="priceRange"
        />
        <h3 className="valueRange">1000</h3>
        <button onClick={() => refreshSearch()}>Apply</button>
      </div>
      <div className="searchResult">
        <h2 className="title">Search results</h2>
        {searchResults &&
          searchResults.map((product, key) => (
            <Product product={product} key={key}></Product>
          ))}
      </div>
      <div className="recommendations">
        <h2 className="title">Recommendations based on your search and cart</h2>
        {recResults &&
          recResults.map((product, key) => (
            <Product product={product} key={key} />
          ))}
      </div>
    </main>
  );
};

export default Search;
