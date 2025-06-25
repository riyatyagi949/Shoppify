import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("auth-token"));

  const token = localStorage.getItem("auth-token");

  // Fetch all products
  useEffect(() => {
    axios.get("http://localhost:4001/allproducts")
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  // Fetch cart data if logged in
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      axios.post("http://localhost:4001/getcart", {}, {
        headers: { "auth-token": token },
      })
      .then(res => setCartItems(res.data || {}))
      .catch(console.error);
    }
  }, [token]);

  const addToCart = async (itemId) => {
    if (!token) return alert("Please log in to add items to cart.");

    try {
      const res = await axios.post("http://localhost:4001/addtocart", { itemId }, {
        headers: { "auth-token": token },
      });
      setCartItems(res.data.cartData);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) return alert("Please log in to remove items from cart.");

    try {
      const res = await axios.post("http://localhost:4001/removefromcart", { itemId }, {
        headers: { "auth-token": token },
      });
      setCartItems(res.data.cartData);
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const product = products.find(p => p.id === Number(id));
      return product ? sum + product.new_price * qty : sum;
    }, 0);
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const logout = () => {
    localStorage.removeItem("auth-token");
    setIsLoggedIn(false);
    setCartItems({});
  };

  return (
    <ShopContext.Provider value={{
      products,
      cartItems,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      getTotalCartItems,
      isLoggedIn,
      logout
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
