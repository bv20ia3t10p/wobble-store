import React, { useEffect, useState } from "react";
import { useLoadingContext } from "./LoadingContext";
import Product from "./Product";
import { url } from "./utils";

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
    .then((e) => (e.ok ? e.json() : e))
    .then((data) => setSearchResults(data));
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
    .then((e) => (e.ok ? e.json() : e))
    .then(async (data) => setSearchResults(data));
};

const Search = () => {
  const { setPageLoaded, isLoading } = useLoadingContext();
  const [searchResult, setSearchResults] = useState([]);
  const [recResults, setRecResults] = useState([]);
  useEffect(() => {
    if (searchResult && recResults) setPageLoaded(true);
  }, [searchResult, recResults]);
  useEffect(() => {});
  useEffect(() => {
    const currentWindow = new URL(window.location.href);
    const searchParams = currentWindow.searchParams;
    const categorySearch = searchParams.get("category");
    const searchQuery = searchParams.get("searchQuery");
    const additionalOpt = searchParams.get("additionalOpt");
    const sortOptions = searchParams.get("sort");
    if (categorySearch)
      getItemsByCategory(
        categorySearch,
        setSearchResults,
        additionalOpt,
        sortOptions
      );
    else getItemsByCategory(setSearchResults);
  }, []);
  return (
    <main className={`searchMain ${isLoading ? "dimmed" : ""}`}>
      <div className="searchControls">
        <h2 className="title">Filter options</h2>
        <select name="sort">
          <option value="ProductPrice asc">Ascending product price</option>
          <option value="ProductPrice desc">Descending product price</option>
          <option value="ProductSoldQuantity desc">Trending products</option>
          <option value="ProductName asc">A-Z</option>
          <option value="ProductName desc">Z-A</option>
        </select>
        <label for="priceRange">Minimum price: $0</label>
        <h3 className="valueRange">0</h3>
        <input
          type="range"
          value="0"
          min="0"
          step="10"
          max="1000"
          name="priceRange"
          id="priceRange"
        />
        <h3 className="valueRange">1000</h3>
        <button>Apply</button>
      </div>
      <div className="searchResult">
        <h2 className="title">Search results</h2>
        {searchResult &&
          searchResult.map((product, key) => (
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
