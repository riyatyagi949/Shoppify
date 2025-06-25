import React, { useState, useContext } from "react";
import "./NewsLetter.css";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext";

const NewsLetter = () => {
  const { isLoggedIn } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      setMessage("⚠️ You must be logged in to subscribe.");
      return;
    }
    if (!email) {
      setMessage("❌ Email is required.");
      return;
    }
    try {
      const token = localStorage.getItem("auth-token");
      const res = await axios.post(
        "http://localhost:4001/newsletter",
        { email },
        { headers: { "auth-token": token } }
      );
      setMessage(res.data.success ? "✅ Subscribed!" : res.data.message);
    } catch (err) {
      setMessage(
        err.response?.status === 409
          ? "⚠️ Already subscribed."
          : "❌ Subscription failed."
      );
    }
  };

  return (
    <div className="newsletter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated!!!!</p>
      <div>
        <input
          type="email"
          placeholder="Your Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isLoggedIn}
        />
        <button onClick={handleSubscribe} disabled={!isLoggedIn}>
          Subscribe
        </button>
      </div>
      {message && <p className="newsletter-message">{message}</p>}
    </div>
  );
};

export default NewsLetter;

