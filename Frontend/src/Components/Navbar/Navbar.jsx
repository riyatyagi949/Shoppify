import React, { useState, useContext } from "react";
import Classes from "./navbar.module.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartItems, isLoggedIn, logout } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = (item) => {
    setMenu(item);
    setMobileMenuOpen(false);
  };

  return (
    <div className={Classes.navbar}>
      <div className={Classes.nav_logo}>
        <img src={logo} alt="logo" />
        <p>SHOPPIFY</p>
      </div>

      <div
        className={Classes.mobile_hamburger}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <div className={`${Classes.bar} ${mobileMenuOpen ? Classes.bar1 : ""}`}></div>
        <div className={`${Classes.bar} ${mobileMenuOpen ? Classes.bar2 : ""}`}></div>
        <div className={`${Classes.bar} ${mobileMenuOpen ? Classes.bar3 : ""}`}></div>
      </div>

      <ul
        className={`${Classes.nav_menu} ${
          mobileMenuOpen ? Classes.mobile_menu_open : ""
        }`}
      >
        {["shop", "mens", "womens", "kids"].map((item) => (
          <li
            key={item}
            onClick={() => handleMenuClick(item)}
            className={menu === item ? Classes.active_menu : ""}
          >
            <Link to={item === "shop" ? "/" : `/${item}`}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
            {menu === item && <hr />}
          </li>
        ))}
      </ul>

      <div className={Classes.cart}>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className={Classes.nav_cart_count}>{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
