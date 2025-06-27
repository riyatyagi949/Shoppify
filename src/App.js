import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignUp from './Pages/LoginSignup';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';

import ShopContextProvider from './Context/ShopContext';

//  Protect route if not logged in
const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('auth-token');
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ShopContextProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid" />} />

          <Route path='/product/:productId' element={<Product />} />

          <Route path='/cart' element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />

          <Route path='/login' element={<LoginSignUp />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ShopContextProvider>
  );
}

export default App;

