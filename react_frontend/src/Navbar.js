import React from "react";
import { useEffect, useState } from "react";
import appIcon from "./icons/appIcon.png";
import { navigateToNewPage, url } from "./utils";
import { createNewSearch } from "./utils";
import "./stylesheets/navbar.css";
import { useLoadingContext } from "./LoadingContext";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoading } = useLoadingContext();
  useEffect(() => {
    getCategories(setCategories);
    const checkCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        if (cart) setBadge(() => cart.length);
      } catch {
        setBadge(() => 0);
      }
    };
    checkCart();
    window.addEventListener("storage", checkCart);
    try {
      const accountToken = localStorage.getItem("accountToken");
      if (accountToken.length > 10) setIsLoggedIn(() => true);
    } catch {
      console.log("No account token");
    }
    return () => {
      window.removeEventListener("storage", checkCart);
    };
  }, []);
  const handleLoginOrLogout = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigateToNewPage("/login");
    } else {
      localStorage.clear();
      setIsLoggedIn(() => false);
      window.location.reload();
    }
  };
  return (
    <nav className={`navbar ${isLoading ? "dimmed" : ""}`}>
      <a href="/" className="icon">
        <img src={appIcon} alt="Icon placholder" />
      </a>
      <form className="searchBar" method="GET" action="search">
        <input
          type="text"
          name="searchQuery"
          placeholder="Search for products"
        />
        <button hidden type="submit">
          Search
        </button>
      </form>
      <form
        action="/login"
        onSubmit={handleLoginOrLogout}
        className="action account"
      >
        <button type="submit">{isLoggedIn ? "Log out" : "Log in"}</button>
      </form>
      <form action="/cart" className="action cart">
        <span className="badge">{badge}</span>
        <button type="submit">Cart</button>
      </form>
      <form action="/dashboard" className="action dashboard">
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
