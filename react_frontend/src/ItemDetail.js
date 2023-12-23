import React, { useCallback, useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { addToCart, flask_url, url } from "./utils";
import "./stylesheets/itemDetail.css";
import Product from "./Product";

const getItemDetail = async (id, setCurrenItem) => {
  const itemUrl = url + `/api/Products/${id}`;
  await fetch(itemUrl, {
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
  })
    .then((e) => e.ok && e.json())
    .then((e) => setCurrenItem(() => e));
};

const getItemRecs = async (id, setRecItems) => {
  const recItemUrl = flask_url + "/mlApi/ProductRec/" + id;
  await fetch(recItemUrl, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "no-cors",
      "Content-Type": "application/json",
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
    .then((e) => e.ok && e.json())
    .then((e) => setRecItems(() => e));
};

const ItemDetail = () => {
  const [currentItem, setCurrentItem] = useState({});
  const [recItems, setRecItems] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(365);
  const [images, setImages] = useState([]);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [currentViewing, setCurrentViewing] = useState(0);
  const [isExpandingDescription, setIsExpandingDescription] = useState(false);
  const moveSlides = useCallback(
    (direction = null, index = null) => {
      if (index !== null) {
        setCurrentViewing(() => index);
      } else {
        switch (direction) {
          case direction < 0:
            setCurrentViewing(() =>
              currentViewing === 0 ? 5 : currentViewing - 1
            );
            break;
          default:
            setCurrentViewing(() =>
              currentViewing === 5 ? 0 : currentViewing + 1
            );
        }
      }
    },
    [currentViewing]
  );

  useMemo(() => {
    setCurrentItemId(() => {
      return new URL(window.location.href).searchParams.get("productId");
    });
  }, []);
  useEffect(() => {
    setImages(() => {
      return Array.from(Array(6).keys()).map((val) =>
        require(`./productImages/${currentItemId}_${val}.png`)
      );
    });
    getItemRecs(currentItemId, setRecItems);
    getItemDetail(currentItemId, setCurrentItem);

    const autoSlideMover = setInterval(() => moveSlides(1), 3000);
    return () => clearInterval(autoSlideMover);
  }, [moveSlides, currentItemId]);
  return (
    <main className="itemDetailMain">
      <div className="itemImages">
        <div className="buttonContainer">
          <button onClick={() => moveSlides(-1)}></button>
          <button onClick={() => moveSlides(1)}></button>
        </div>
        <div className="slideshow">
          {images &&
            images.map((img, key) => (
              <img
                key={key}
                className={`singleImage ${
                  currentViewing !== key && "hiddenImg"
                }`}
                alt={`${currentItem.productName} Product ${key} `}
                src={img}
              />
            ))}
        </div>
        <div className="itemImagesMinimize">
          {images &&
            images.map((img, key) => (
              <img
                onClick={() => moveSlides(0, key)}
                key={key}
                className={`minimizeImage ${
                  currentViewing === key && "highlight"
                }`}
                alt={`${currentItem.productName} Product ${key} `}
                src={img}
              />
            ))}
        </div>
      </div>
      <div className="ProductInfo">
        <span className="name">{currentItem.productName}</span>
        <span className="depName">
          <span className="label">Department in charge: </span>
          <span className="data">{currentItem.departmentName}</span>
        </span>
        <span className="sold">
          {currentItem.productSoldQuantity} products sold
        </span>
        <span className="price">
          ${Math.round(currentItem.productPrice * 1000) / 1000}
        </span>
      </div>
      <div className="AdvancedProductInfo">
        <h1 className="header">Other product information</h1>
        <span className="id">
          <span className="label">Product Id: </span>
          <span className="data">{currentItem.productCardId}</span>
        </span>
        <span className="status">
          <span className="label">Availability Status: </span>
          <span className="data">
            {currentItem.productStatus
              ? "Available"
              : "Not Available (Order for later)"}
          </span>
        </span>
      </div>
      <div className="description">
        <h1 className="header">Product Description</h1>
        <div
          className={`descriptionDetail ${isExpandingDescription && "open"}`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(currentItem.productDescription),
          }}
        ></div>
        <button
          className="expand"
          onClick={() =>
            setIsExpandingDescription(() => !isExpandingDescription)
          }
        >
          {isExpandingDescription ? "\u21E7" : "\u21E9"}
        </button>
      </div>
      <div className="cart">
        <div className="quantityControl">
          <span className="label">Order Quantity</span>
        </div>
        <div className="controls">
          <button
            className="subtract"
            onClick={() =>
              setCurrentQuantity(() =>
                currentQuantity <= 1 ? 1 : currentQuantity - 1
              )
            }
          >
            -
          </button>
          <input
            type="number"
            onChange={(e) => setCurrentQuantity(() => e.target.value)}
            className="quantity data"
            value={currentQuantity}
          />
          <button
            className="add"
            onClick={() => setCurrentQuantity(() => currentQuantity + 1)}
          >
            +
          </button>
        </div>
        <span className="label">Estimated Totals</span>
        <span className="total">
          $
          {Math.round(currentItem.productPrice * currentQuantity * 1000) / 1000}
        </span>
        <button
          className="toCart"
          onClick={() => addToCart(currentItem.productCardId, currentQuantity)}
        >
          Add to cart
        </button>
        <button className="instaBuy">Buy now</button>
      </div>
      <div className="relevantItems">
        <h1 className="header">You might be interested in</h1>
        {recItems.map(
          (item, no) => no < 20 && <Product product={item} key={no} />
        )}
      </div>
    </main>
  );
};

export default ItemDetail;
