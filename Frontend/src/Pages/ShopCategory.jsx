import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import axios from "axios";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4001/allproducts");
        const products = res.data.filter(
          (item) => item.category.toLowerCase() === props.category.toLowerCase()
        );
        setFilteredProducts(products);
      } catch (err) {
        console.error("Failed to fetch category products:", err);
        setError("Failed to load products. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [props.category]);

  return (
    <div className="shop-category">
      <img className="shopCategory-banner" src={props.banner} alt="banner" />

      <div className="shopCategory-indexSort">
        <p>
          <span>Showing {filteredProducts.length}</span> product(s)
        </p>
        <div className="shopCategory-short">
          sort by <img src={dropdown_icon} alt="sort" />
        </div>
      </div>

      {loading ? (
        <div className="shopCategory-loading">Loading...</div>
      ) : error ? (
        <div className="shopCategory-error">{error}</div>
      ) : (
        <div className="shopCategory-products">
          {filteredProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopCategory;

