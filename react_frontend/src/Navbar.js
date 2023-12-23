import React from "react";
import { useEffect, useState } from "react";
import appIcon from "./icons/appIcon.png";
import { url } from "./utils";
import { createNewSearch } from "./utils";
import "./stylesheets/navbar.css";

const getCategories = async (setCategories) => {
  const categoriesUrl = url + "/api/Category";
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
    .then((e) => {
      setCategories(() => e);
    });
};

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [badge, setBadge] = useState(0);
  useEffect(() => {
    getCategories(setCategories);
    const checkCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        setBadge(() => cart.length);
      } catch {
        setBadge(() => 0);
      }
    };
    checkCart();
    window.addEventListener("storage", checkCart);
    return () => {
      window.removeEventListener("storage", checkCart);
    };
  }, []);
  return (
    <nav className="navbar">
      <a href="/" className="icon">
        <img src={appIcon} alt="Icon placholder" />
      </a>
      <form className="searchBar" method="GET" action="search.html">
        <input
          type="text"
          name="searchQuery"
          placeholder="Search for products"
        />
        <button hidden type="submit">
          Search
        </button>
      </form>
      <form action="/login" className="action account">
        <button type="submit">Login</button>
      </form>
      <form action="/cart.html" className="action cart">
        <span className="badge">{badge}</span>
        <button type="submit">Cart</button>
      </form>
      <form action="/dashboard.html" className="action dashboard">
        <button type="submit">Dashboard</button>
      </form>
      <div className="categories">
        {categories &&
          categories.map((category, key) => {
            return (
              <span
                key={key}
                onClick={() => createNewSearch("category", category.categoryId)}
                className={key < 7 ? "navbarCategory" : "navbarCategory hidden"}
              >
                {category.categoryName}
              </span>
            );
          })}
      </div>
    </nav>
  );
};

//   `<span
//   onclick=createNewSearch("category",${cat.categoryId})
//   className="item ${key < maxItem ? "" : "hidden"}">${
//     cat.categoryName
//   }</span>`
export default Navbar;
