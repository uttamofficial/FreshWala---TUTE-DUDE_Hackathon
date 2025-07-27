import React from 'react';
import { Apple, Leaf, Milk, Cookie, Coffee, Star, TrendingUp, Users } from 'lucide-react';

const CategorySection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Premium Quality Products
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-600 bg-clip-text text-transparent mb-6 leading-relaxed pb-2">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find everything you need for your street food business, from fresh produce to beverages. 
            <span className="text-green-600 font-semibold"> Quality guaranteed, prices unbeatable!</span>
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">10,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">640+ Premium Products</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {[{
            title: "Fruits",
            icon: Apple,
            image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=2",
            items: "150+ items",
            color: "bg-gradient-to-tr from-red-200 via-red-100 to-pink-100 text-red-600",
            badge: "Fresh Daily",
            discount: "20% OFF"
          }, {
            title: "Vegetables",
            icon: Leaf,
            image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=2",
            items: "200+ items",
            color: "bg-gradient-to-tr from-green-200 via-green-100 to-emerald-100 text-green-600",
            badge: "Organic",
            discount: "15% OFF"
          }, {
            title: "Dairy",
            icon: Milk,
            image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=2",
            items: "80+ items",
            color: "bg-gradient-to-tr from-blue-200 via-blue-100 to-cyan-100 text-blue-600",
            badge: "Pure",
            discount: "10% OFF"
          }, {
            title: "Snacks",
            icon: Cookie,
            image: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=2",
            items: "120+ items",
            color: "bg-gradient-to-tr from-yellow-200 via-yellow-100 to-orange-100 text-yellow-700",
            badge: "Crispy",
            discount: "25% OFF"
          }, {
            title: "Beverages",
            icon: Coffee,
            image: "https://images.pexels.com/photos/544961/pexels-photo-544961.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=2",
            items: "90+ items",
            color: "bg-gradient-to-tr from-purple-200 via-purple-100 to-pink-100 text-purple-600",
            badge: "Refreshing",
            discount: "30% OFF"
          }].map((category, index) => (
            <div key={index} className="group cursor-pointer text-center transform transition-all duration-500 hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 transform group-hover:scale-105 mb-6 bg-white/40 backdrop-blur-lg border border-white/50 group-hover:border-green-400/60 group-hover:shadow-green-200/50">
                
                {/* Discount Badge */}
                <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  {category.discount}
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  {category.badge}
                </div>
                
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110 rounded-t-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-3xl" />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-300">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/80 ${category.color} group-hover:ring-8 group-hover:ring-white/60 transition-all duration-300`}>
                      <category.icon className="w-10 h-10 drop-shadow-2xl" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-sm rounded-b-3xl">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium mb-4 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {category.items}
                  </p>
                  
                  {/* Animated Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1 mb-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out"></div>
                  </div>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-xl transition-all duration-300 w-full focus:outline-none focus:ring-4 focus:ring-green-300 group-hover:shadow-2xl group-hover:shadow-green-200/50 transform group-hover:scale-105 relative overflow-hidden">
                <span className="relative z-10">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
