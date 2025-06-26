import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import axios from "axios";

const CartItems = () => {
  const {
    products,
    cartItems,
    removeFromCart,  // use removeFromCart from context
    getTotalCartAmount,
  } = useContext(ShopContext);

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const totalAmount = getTotalCartAmount();
  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalAmount = totalAmount - discountAmount;

  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Apply promo code function remains unchanged
  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoMessage("Please enter a promo code.");
      return;
    }

    try {
      const res = await axios.post("https://shoppify-backend-gofd.onrender.com/validate-promo", {
  promoCode: promoCode.trim(),
});

      if (res.data.success) {
        setDiscountPercent(res.data.discount);
        setPromoMessage(`Promo code applied! ${res.data.discount}% discount.`);
      } else {
        setDiscountPercent(0);
        setPromoMessage("Invalid promo code.");
      }
    } catch (err) {
      setDiscountPercent(0);
      setPromoMessage("Server error or invalid code.");
    }
  };

  const proceedToCheckout = () => {
    if (finalAmount <= 0) {
      alert("Cart is empty. Add some items first!");
      return;
    }

    alert(
      `Proceeding to checkout\nSubtotal: ₹${totalAmount}\nDiscount: ₹${discountAmount.toFixed(
        2
      )}\nTotal to pay: ₹${finalAmount.toFixed(2)}`
    );
  };

  const isCartEmpty =
    !cartItems ||
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0) === 0;

  if (loading) {
    return (
      <div className="cartItems">
        <p style={{ padding: "30px", textAlign: "center" }}>Loading cart...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="cartItems">
        <p style={{ padding: "30px", textAlign: "center" }}>
          🔒 Please <strong>log in</strong> to view your cart.
        </p>
      </div>
    );
  }

  return (
    <div className="cartItems">
      <div className="cartItems-scroll">
        <div className="cartItems-format-main">
          <p>Products</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

        {Array.isArray(products) && products.length > 0 ? (
          products.map((e) => {
            if (cartItems[e.id] > 0) {
              return (
                <div key={e.id}>
                  <div className="cartItems-format cartItems-format-main cart-item-row">
                    <img
                      src={e.image}
                      alt="product"
                      className="cartItem-product-icon"
                    />
                    <p>{e.name}</p>
                    <p>₹ {e.new_price}</p>
                    <button className="cartItem-quantity">{cartItems[e.id]}</button>
                    <p>₹ {e.new_price * cartItems[e.id]}</p>
                    <img
                      className="cartItem-remove-icon"
                      src={remove_icon}
                      alt="remove"
                      onClick={() => removeFromCart(e.id)}  // call removeFromCart here
                    />
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>Your cart is empty.</p>
        )}
      </div>

      <div className="cartItems-down">
        <div className="cartItems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartItems-total-item">
              <p>Subtotal</p>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartItems-total-item">
              <p>Discount</p>
              <p>₹{discountAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartItems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartItems-total-item">
              <h3>Total</h3>
              <h3>₹{finalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={proceedToCheckout} disabled={isCartEmpty}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cartItems-promocode">
          <p>If you have a promo code, enter it here:</p>
          <div className="cartItems-promobox">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromoCode}>Apply</button>
          </div>
          {promoMessage && <p>{promoMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
