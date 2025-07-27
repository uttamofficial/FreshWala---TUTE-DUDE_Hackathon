// src/components/HeroSection.jsx
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated floating icons/particles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/5 w-16 h-16 bg-green-400/30 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl animate-pulse-slower" />
        <div className="absolute top-2/3 right-1/6 w-10 h-10 bg-green-300/20 rounded-full blur-xl animate-pulse" />
      </div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url("https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")'
        }}
      />
      {/* Glassmorphism overlay for text */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="inline-block bg-white/5 backdrop-blur-md rounded-3xl px-8 py-10 shadow-2xl border border-white/10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-lg">
            Your Online Marketplace for
            <span className="block bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-gradient-x" style={{ paddingBottom: '0.25em', lineHeight: 1.1, textShadow: '0 2px 8px rgba(34,197,94,0.25)' }}>Fresh Ingredients!</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow">
            Connect with trusted suppliers and get quality ingredients delivered fresh to fuel your street food business.
          </p>
          <button className="relative bg-gradient-to-tr from-green-400 via-green-500 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300">
            <span className="relative z-10">Browse Our Products</span>
            <span className="absolute inset-0 rounded-2xl border-2 border-green-300/60 animate-glow pointer-events-none" />
          </button>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-8 h-14 border-2 border-green-300 bg-white/10 rounded-full flex justify-center items-start shadow-lg">
          <div className="w-1.5 h-4 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 16px 4px #6ee7b7cc; }
          50% { box-shadow: 0 0 32px 8px #34d399cc; }
        }
        .animate-glow {
          animation: glow 2s infinite alternate;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        .animate-pulse-slower {
          animation: pulse-slower 7s infinite;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
