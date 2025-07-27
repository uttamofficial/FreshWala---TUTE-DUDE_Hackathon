import React from 'react';
import { Shield, Clock, Star, Truck, DollarSign, Heart } from 'lucide-react';

const TrustIndicators = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-100 via-blue-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the reasons why we are trusted by thousands of businesses for their daily supplies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Trust Indicator 1: Trusted Suppliers */}
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-tr from-green-200 via-green-100 to-green-50 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Trusted Suppliers</h3>
            <p className="text-gray-600">All our suppliers are verified and rated by the vendor community</p>
          </div>

          {/* Trust Indicator 2: Fast Delivery */}
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-200 via-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Clock className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Same-day delivery available for fresh ingredients in your area</p>
          </div>

          {/* Trust Indicator 3: Quality Guaranteed */}
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-200 via-yellow-100 to-yellow-50 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Star className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">Fresh, high-quality ingredients or your money back</p>
          </div>

          {/* Trust Indicator 4: Reliable Delivery Trucks */}
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-tr from-orange-200 via-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Truck className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Reliable Delivery Trucks</h3>
            <p className="text-gray-600">We ensure timely and secure delivery with our fleet of trucks</p>
          </div>

          {/* Trust Indicator 5: Competitive Pricing */}
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-tr from-green-200 via-green-100 to-green-50 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Competitive Pricing</h3>
            <p className="text-gray-600">We offer the best prices without compromising quality</p>
          </div>

          {/* Trust Indicator 6: Customer Satisfaction */}
          <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-tr from-pink-200 via-pink-100 to-pink-50 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Heart className="w-10 h-10 text-pink-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
            <p className="text-gray-600">We prioritize customer satisfaction with 24/7 support and feedback</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustIndicators;
