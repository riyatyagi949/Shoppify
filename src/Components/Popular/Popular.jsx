import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get("https://shoppify-backend-gofd.onrender.com/popularinwomen");

        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching popular items:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  if (loading) return <div className="popular-loading">Loading...</div>;
  if (error) return <div className="popular-error">{error}</div>;

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-grid">
        {products.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
