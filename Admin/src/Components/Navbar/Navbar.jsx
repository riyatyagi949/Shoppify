import React from 'react';
import './Navbar.css';
import navlogo from '../../Assets/logo.png';
import navProfile from '../../Assets/nav_profile.png';

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div className="nav-left">
        <img src={navlogo} alt="Logo" className="nav-logo" />
        <div className="nav-title">
          <h1>Shoppify</h1>
          <p>Admin Panel</p>
        </div>
      </div>

      {/* Profile with dropdown arrow */}
      <div className="nav-right">
        <img src={navProfile} alt="Profile" className="nav-profile" />
        <span className="dropdown-icon">▼</span>
      </div>
    </div>
  );
};

export default Navbar;
