import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import TrustIndicators from './components/TrustIndicators';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';  // New component for search results page
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Cart from './components/Cart';
import SellerDashboard from './components/SellerDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home page with Navbar, Hero, etc.
const Home = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TrustIndicators />
      <Footer />
    </div>
  );
}

  const handleSearch = async (query) => {
  setSearchQuery(query); // Update the search query state
  try {
    const response = await fetch(`http://localhost:8000/api/product/searchProducts?keyword=${query}`);
    const data = await response.json();
    console.log("Search Data:", data);  // Log the data to check if it's fetched correctly
    if (data.success) {
      setProducts(data.products);  // Update the products state with search results
    } else {
      setProducts([]);  // If no results, clear the products state
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export default App;
