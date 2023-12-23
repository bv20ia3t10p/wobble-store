import React, { useEffect, useMemo, useState } from "react";
import { navigateToNewPage, url } from "./utils";
import { useLoadingContext } from "./LoadingContext";
import { getItemRecommendation } from "./Search";
import "./stylesheets/cart.css";
import Product from "./Product";

const loadUserInfo = async (setUserInfo) => {
  const accountToken = localStorage.getItem("accountToken");
  if (!accountToken) {
    alert("Not logged in. Please login or register to continue");
    navigateToNewPage("/login");
    return;
  }
  await fetch(url + "/api/Customer/Email", {
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
    .then((e) => setUserInfo(() => e))
    .catch((e) => {
      alert(e);
      navigateToNewPage("/login");
    });
};

const getCartItems = async (setCartItems, setPageLoaded) => {
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  if (!cart) return;
  const requestBody = cart.map((e) => e.id);
  const getItemsFromCartUrl = url + "/api/Products/Multiple";
  await fetch(getItemsFromCartUrl, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
    .then((e) => e.ok && e.json())
    .then((e) => {
      setCartItems(() => e);
      setPageLoaded(true);
    });
};

const Cart = () => {
  const [userInfo, setUserInfo] = useState({
    customerCity: "",
    customerCountry: "",
    customerSegment: "",
    customerStreet: "",
    customerState: "",
    customerZipcode: 0,
    customerId: 0,
    customerEmail: "",
    customerPassword: "",
    customerFname: "",
    customerLname: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const [recItems, setRecItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState([]);
  const { setPageLoaded, setDialogueLoading, isLoading } = useLoadingContext();
  useEffect(() => {
    loadUserInfo(setUserInfo);
    getCartItems(setCartItems, setPageLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getItemRecommendation(
      cartItems ? cartItems.map((e) => e.productCardId) : [],
      setRecItems
    );
  }, [cartItems]);
  useMemo(() => {
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart && !localCart) setLocalCart(() => cart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useMemo(() => {
    if (!cartItems) return;
    let sum = 0;
    for (let cartItem in localCart) {
      sum +=
        cartItem.quantity *
        cartItems.filter(
          (cartItem) => cartItem.productCardId === cartItem.id
        )[0].productPrice;
    }
    setTotalPrice(() => sum);
  }, [cartItems, localCart]);
  const modifyCart = (id, quantity, op = null) => {
    if (quantity === 0 && !op)
      alert(
        "Value can't be smaller than 0, delete the item if you want to remove"
      );
    let newCart = [];
    op = Number(op);
    if (op) {
      // -1 is subtract, 1 is add
      newCart = localCart.map((cartItem) => {
        if (cartItem.id === id) {
          if (cartItem.quantity + op < 1) return cartItem;
          else return { ...cartItem, quantity: cartItem.quantity + op };
        } else return cartItem;
      });
    } else {
      newCart = localCart.map((cartItem) => {
        if (cartItem.id === id) {
          return { ...cartItem, quantity };
        }
        return cartItem;
      });
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
    setLocalCart(() => newCart);
  };
  return (
    <main className={`cartMain ${isLoading ? "dimmed" : ""}`}>
      <h1 className="title">Your shopping cart</h1>
      <div className="columns">
        <div className="allItem">
          <input type="checkbox" name="allItem" id="cartAllItemChk" />
          <label for="cartAllItemChk">Select all products (0 product)</label>
        </div>
        <div className="price">Product Price</div>
        <div className="quantity">Quantity</div>
        <div className="total">Total</div>
        <button className="delete"></button>
      </div>
      <div className="cartDetails">
        {cartItems &&
          cartItems.map((product, key) => {
            const productImg = require(`./productImages/${product.productCardId}_0.png`);
            return (
              <div key={key} className="single">
                <input type="checkbox" name="" id="" className="itemCheck" />
                <img src={productImg} alt="" srcset="" className="itemImg" />
                <p className="productName">{product.productName}</p>
                <div className="price">
                  {Math.round(product.productPrice * 1000) / 100}
                </div>
                <div className="quantityControl"></div>
              </div>
            );
          })}
      </div>
      <div className="itemRecs">
        <h1 className="title">Relevant products you might like</h1>
        <div className="recommendations">
          {recItems &&
            recItems.map((recItem, key) => (
              <Product product={recItem} key={key} />
            ))}
        </div>
      </div>
      <div className="delivery">
        <div className="title">
          <h1 className="label">Deliver to</h1>
          <button className="change">Change</button>
        </div>
        <div className="basic">
          <div className="name">
            {userInfo.customerFname + " " + userInfo.customerLname}
          </div>
          <div className="email">{userInfo.customerEmail}</div>
        </div>
        <div className="advanced">
          <div className="country">
            <div className="label">Country</div>
            <div className="data">{userInfo.customerCountry}</div>
          </div>
          <div className="city">
            <div className="label">City</div>
            <div className="data">{userInfo.customerCity}</div>
          </div>
          <div className="state">
            <div className="label">State</div>
            <div className="data">{userInfo.customerState}</div>
          </div>
          <div className="zip">
            <div className="label">Zipcode</div>
            <div className="data">{userInfo.customerZipcode}</div>
          </div>
          <div className="street">
            <div className="label">Street</div>
            <div className="data">{userInfo.customerStreet}</div>
          </div>
        </div>
      </div>
      <div className="orderTotal">
        <div className="estimated">
          <div className="label">Estimated Total</div>
          <div className="data">0</div>
        </div>
        <div className="final">
          <div className="label">Order Total</div>
          <div className="data">0</div>
        </div>
      </div>
      <button className="purchase">Purchase (0)</button>
    </main>
  );
};

export default Cart;
