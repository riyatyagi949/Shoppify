import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RelatedProducts.css";
import Item from "../Item/Item";

const RelatedProducts = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4001/popularinwomen");
        setRelatedProducts(response.data);
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Failed to load related products.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, []);

  if (loading) return <div className="related-loading">Loading...</div>;
  if (error) return <div className="related-error">{error}</div>;

  return (
    <div className="RelatedProducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedProducts-row">
        {relatedProducts.map((item) => (
          <div key={item.id} className="item-card">
            <Item
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
