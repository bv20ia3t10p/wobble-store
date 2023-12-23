import React from "react";
import { openItemDetails, addToCart } from "./utils";
import addCartIcon from "./icons/addCart.png";

const Product = ({ product }) => {
  if (product.ProductCardId)
    product = {
      ...product,
      productCardId: product.ProductCardId,
      productName: product.ProductName,
      productPrice: product.ProductPrice,
      productSoldQuantity: product.ProductSoldQuantity,
    };
  const productImg = require(`./productImages/${product.productCardId}_0.png`);
  return (
    <div className="item">
      <img
        src={productImg}
        alt={product.productName + " product image"}
        onClick={() => openItemDetails(product.productCardId)}
      />
      <h4 className="name">{product.productName}</h4>
      <h4 className="price">
        {Math.round(product.productPrice * 1000) / 1000}
      </h4>
      <h4 className="itemSold">{product.productSoldQuantity} sold</h4>
      <span
        className="button"
        onClick={() => addToCart(product.productCardId, 1)}
      >
        <img src={addCartIcon} alt="Add to cart icon" />
      </span>
    </div>
  );
};

export default Product;
