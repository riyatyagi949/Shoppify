import React, { useContext } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  return (
    <div className="productDisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={product.image} alt={`thumb-${i}`} />
          ))}
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {Array(4).fill().map((_, i) => <img key={i} src={star_icon} alt="star" />)}
          <img src={star_dull_icon} alt="star empty" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">₹{product.old_price}</div>
          <div className="productdisplay-right-price-new">₹{product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Made from ultra‑soft, high‑quality cotton blend… (update with real description)
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            {["S","M","L","XL","XXL"].map(sz => <div key={sz}>{sz}</div>)}
          </div>
        </div>
        <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
        <p className="productdisplay-right-category">
          <span>Category: </span>{product.category}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
