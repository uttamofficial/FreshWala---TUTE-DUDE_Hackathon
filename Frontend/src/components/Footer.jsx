// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa6';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="pt-16 pb-12 text-white" style={{ background: 'linear-gradient(90deg, rgba(10,10,10,0.98) 0%, rgba(30,30,30,0.95) 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Signup */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-b border-gray-800 pb-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Stay Updated!</h3>
            <p className="text-gray-400 max-w-md">Subscribe to our newsletter for the latest offers, new arrivals, and exclusive deals.</p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={e => e.preventDefault()} aria-label="Newsletter Signup">
            <input
              type="email"
              required
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              aria-label="Email address"
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">FreshWala</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting street food vendors with trusted suppliers for fresh, quality ingredients.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="rounded-full bg-white p-2 shadow-md hover:scale-110 transition-transform" style={{ color: '#1877F3' }}>
                <FaFacebook size={28} />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-white p-2 shadow-md hover:scale-110 transition-transform" style={{ color: '#1DA1F2' }}>
                <FaTwitter size={28} />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-white p-2 shadow-md hover:scale-110 transition-transform" style={{ color: '#E4405F' }}>
                <FaInstagram size={28} />
              </a>
              <a href="#" aria-label="LinkedIn" className="rounded-full bg-white p-2 shadow-md hover:scale-110 transition-transform" style={{ color: '#0077B5' }}>
                <FaLinkedin size={28} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Fruits</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vegetables</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dairy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Snacks</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Beverages</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li><span className="block">Email:</span> <a href="mailto:support@freshwala.com" className="hover:text-white transition-colors">support@freshwala.com</a></li>
              <li><span className="block">Phone:</span> <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 234 567 890</a></li>
              <li><span className="block">Address:</span> 123 Market Street, Food City</li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-12 gap-6 border-t border-gray-800 pt-8">
          <div className="text-center md:text-left text-gray-400 text-sm">
            <p>&copy; 2025 FreshWala. All rights reserved.</p>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-gray-400 text-sm mr-2">We accept:</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-6 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-6 w-auto" />
            <span title="PayPal"><FaPaypal size={32} style={{ color: '#003087', background: 'white', borderRadius: '6px', padding: '2px' }} /></span>
            <span title="Apple Pay"><FaApplePay size={32} style={{ color: '#000', background: 'white', borderRadius: '6px', padding: '2px' }} /></span>
            <span title="Google Pay"><FaGooglePay size={32} style={{ color: '#4285F4', background: 'white', borderRadius: '6px', padding: '2px' }} /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
