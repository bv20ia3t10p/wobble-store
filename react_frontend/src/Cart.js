import React, { useEffect, useState } from "react";
import { navigateToNewPage, url } from "./utils";
import { useLoadingContext } from "./LoadingContext";
import { getItemRecommendation } from "./Search";
import "./stylesheets/cart.css";
import Product from "./Product";

export const loadUserInfo = async (setUserInfo, setPageLoaded = null) => {
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
    .then((e) => {
      setUserInfo(() => e);
      if (setPageLoaded) setPageLoaded(true);
    })
    .catch((e) => {
      alert(e);
      navigateToNewPage("/login");
    });
};

const getCartItems = async (
  setCartItems,
  setRecItems,
  setDialogueLoading = null,
  setPageLoaded = null,
  setTotalPrice = null
) => {
  const cart = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
  if (!cart) return;
  if (setDialogueLoading) setDialogueLoading(true, "Updating cart");
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
      getItemRecommendation(
        cart.map((e) => e.id),
        setRecItems
      );
      if (setDialogueLoading) setDialogueLoading(false);
      if (setPageLoaded) setPageLoaded(true);
      if (setTotalPrice) {
        let sum = 0;
        for (let i = 0; i < e.length; i++) {
          if (cart[i].checked) sum += e[i].productPrice * cart[i].quantity;
        }
        setTotalPrice(() => sum);
      }
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
  const [totalPrice, setTotalPrice] = useState(0);
  const { setPageLoaded, setDialogueLoading, isLoading } = useLoadingContext();
  useEffect(() => {
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart) setLocalCart(() => cart);
    loadUserInfo(setUserInfo);
    getCartItems(
      setCartItems,
      setRecItems,
      setDialogueLoading,
      setPageLoaded,
      setTotalPrice
    );
    const modifyLocalCart = () => {
      setDialogueLoading(true, "Updating cart...");
      const cart = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
      if (cart) setLocalCart(() => cart);
      getCartItems(setCartItems, setRecItems, setDialogueLoading);
    };
    const modifyLocalCartListener = window.addEventListener(
      "storage",
      modifyLocalCart
    );
    return () => window.removeEventListener("storage", modifyLocalCartListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let sum = 0;
    if (!localCart) return;
    if (!cartItems || !cartItems.length) return;
    for (let i = 0; i < localCart.length; i++) {
      const item = localCart[i];
      if (item.checked) {
        const itemPrice = cartItems[i].productPrice;
        sum += itemPrice * item.quantity;
      }
    }
    setTotalPrice(() => sum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localCart]);
  const checkChanged = (id, checked) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let newCart = cart.map((p) => {
      if (p.id === id) return { ...p, checked };
      return p;
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    setLocalCart(() => newCart);
  };
  const checkChangedAll = (checked) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let newCart = cart.map((p) => {
      return { ...p, checked };
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    setLocalCart(() => newCart);
  };
  const modifyQuantity = (id, quantity, opt = null) => {
    let tempNewCart = [];
    if (opt) {
      opt = Number(opt);
      for (let i = 0; i < localCart.length; i++) {
        const item = localCart[i];
        if (item.id === id)
          if (item.quantity + opt < 1) {
            removeItemFromCart(id);
            return;
          } else
            tempNewCart = [
              ...tempNewCart,
              { ...item, quantity: item.quantity + opt },
            ];
        else {
          tempNewCart = [...tempNewCart, item];
        }
      }
    } else {
      for (let i = 0; i < localCart.length; i++) {
        const item = localCart[i];
        if (item.id === id) {
          if (quantity > 0)
            tempNewCart = [...tempNewCart, { ...item, quantity }];
          else {
            removeItemFromCart(id);
            return;
          }
        } else tempNewCart = [...tempNewCart, item];
      }
    }
    localStorage.setItem("cart", JSON.stringify(tempNewCart));
    setLocalCart(() => tempNewCart);
  };
  const removeItemFromCart = (id) => {
    setDialogueLoading(true, "Updating cart...");
    const newCart = localCart.filter((e) => e.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setLocalCart(() => newCart);
    setCartItems(() => cartItems.filter((e) => e.productCardId !== id));
    getItemRecommendation(
      newCart.map((e) => e.id),
      setRecItems,
      setDialogueLoading
    );
  };
  const createOrder = async () => {
    setDialogueLoading(true, "Creating your order");
    let orderCreationRequestBody = {
      type: "CASH",
      customerId: userInfo.customerId,
      orderDetails: localCart
        // eslint-disable-next-line array-callback-return
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
    const accountToken = localStorage.getItem("accountToken");
    const createOrderUrl = url + "/api/Order/Customer";
    await fetch(createOrderUrl, {
      method: "POST",
      body: JSON.stringify(orderCreationRequestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accountToken,
        "Access-Control-Allow-Origin": "*",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
      .then((e) => e.ok && e.json())
      .then((data) => {
        console.log("Created order", data);
        setDialogueLoading(true, "Updating cart...");
        const newCart = localCart.filter((e) => !e.checked);
        setLocalCart(() => newCart);
        setCartItems(() =>
          cartItems.filter((e) => newCart.find((t) => t.id === e.productCardId))
        );
        // setCartItems(() => cartItems.filter((e) => !e.checked));
        localStorage.setItem("cart", JSON.stringify(newCart));
        // getItemRecommendation(
        //   newCart.map((e) => e.id),
        //   setRecItems,
        //   setDialogueLoading
        // );
        navigateToNewPage("/OrderDetails", { orderId: data.orderId });
      });
  };
  return (
    <main className={`cartMain ${isLoading ? "dimmed" : ""}`}>
      <h1 className="title">Your shopping cart</h1>
      <div className="columns">
        <div className="allItem">
          <input
            type="checkbox"
            name="allItem"
            id="cartAllItemChk"
            onClick={(e) => checkChangedAll(e.target.checked)}
          />
          <label htmlFor="cartAllItemChk">
            Select all products ({localCart ? localCart.length : 0} product)
          </label>
        </div>
        <div className="price">Product Price</div>
        <div className="quantity">Quantity</div>
        <div className="total">Total</div>
        <button className="delete"></button>
      </div>
      <div className="cartDetails">
        {cartItems &&
          localCart &&
          cartItems.map((product, key) => {
            let productImg;
            try {
              productImg = require(`./productImages/${product.productCardId}_0.png`);
            } catch {
              productImg = "";
            }
            return (
              <div key={key} className="single">
                <div className="description">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className="itemCheck"
                    checked={localCart[key].checked}
                    onChange={(e) =>
                      checkChanged(product.productCardId, e.target.checked)
                    }
                  />
                  <img src={productImg} alt="" className="itemImg" />
                  <p className="productName">{product.productName}</p>
                </div>
                <div className="price">
                  ${Math.round(product.productPrice * 1000) / 1000}
                </div>
                <div className="quantityControl">
                  <button
                    className="subctract"
                    onClick={() => modifyQuantity(product.productCardId, 0, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name=""
                    id=""
                    className="value"
                    value={localCart[key].quantity}
                    onChange={(e) =>
                      modifyQuantity(product.productCardId, e.target.value)
                    }
                  />
                  <button
                    className="add"
                    onClick={() => modifyQuantity(product.productCardId, 0, 1)}
                  >
                    +
                  </button>
                </div>
                <div className="total">
                  $
                  {Math.round(
                    localCart[key].quantity * product.productPrice * 1000
                  ) / 1000}
                </div>
                <button
                  className="delete"
                  onClick={() => removeItemFromCart(product.productCardId)}
                ></button>
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
          <button
            className="change"
            onClick={() => navigateToNewPage("/dashboard")}
          >
            Change
          </button>
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
          <div className="data">{Math.round(totalPrice * 100000) / 100000}</div>
        </div>
        <div className="final">
          <div className="label">Order Total</div>
          <div className="data">{Math.round(totalPrice * 1000) / 1000}</div>
        </div>
      </div>
      <button className="purchase" onClick={() => createOrder()}>
        Purchase ({localCart ? localCart.filter((e) => e.checked).length : 0})
      </button>
    </main>
  );
};

export default Cart;
