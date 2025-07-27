const ProductCard = ({ product }) => {
  return (
    <div className="max-w-xs mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">${product.pricePerUnit} per {product.unit}</span>
          <span className="text-sm text-gray-600">Available: {product.quantityAvailable}</span>
        </div>
        <div className="mt-2">
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
