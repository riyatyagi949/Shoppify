import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get("https://shoppify-backend-gofd.onrender.com/newcollection");

        setCollections(res.data);
      } catch (err) {
        console.error("Error fetching new collections:", err);
        setError("Failed to load new collections.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) return <div className="collections-loading">Loading...</div>;
  if (error) return <div className="collections-error">{error}</div>;

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections-grid">
        {collections.map((item) => (
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

export default NewCollections;

