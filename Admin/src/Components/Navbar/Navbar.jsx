import React from 'react';
import './Navbar.css';
import navlogo from '../../Assets/logo.png';
import navProfile from '../../Assets/nav_profile.png';

const Navbar = () => {
  return (
    <nav className='Navbar'>
      <div className="nav-left">
        <img src={navlogo} alt="Shoppify Logo" className="nav-logo" />
        <div className="nav-title">
          <h1>Shoppify</h1>
          <p>Admin Panel</p>
        </div>
      </div>

      <div className="nav-right">
        <img src={navProfile} alt="Admin Profile" className="nav-profile" />
        <span className="dropdown-icon">▼</span>
      </div>
    </nav>
  );
};

export default Navbar;
