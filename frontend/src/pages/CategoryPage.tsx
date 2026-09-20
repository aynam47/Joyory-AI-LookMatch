import { useParams } from 'react-router-dom';
import { ALL_PRODUCTS, Product } from '../data';
import { useState } from 'react';

export default function CategoryPage({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const { categoryName } = useParams<{ categoryName: string }>();
  // Capitalize category name for display
  const title = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : '';
  
  const products = ALL_PRODUCTS.filter(p => p.category.toLowerCase() === categoryName?.toLowerCase());

  return (
    <div className="bg-[#fdf8f4] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#2c2225] mb-4 text-center">
          {title}
        </h1>
        <p className="text-center text-[#9a8287] mb-12">Discover our collection of {title.toLowerCase()} products</p>
        
        {products.length === 0 ? (
          <p className="text-center text-[#9a8287]">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-[#c9707a] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      Sale
                    </div>
                  )}
                  <button 
                    onClick={() => onAddToCart(product.id)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-white/90 backdrop-blur text-[#2c2225] font-semibold py-2.5 rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#c9707a] hover:text-white"
                  >
                    Add to Cart
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#c9707a] uppercase tracking-wider mb-1">{product.brand}</p>
                  <h3 className="text-[#2c2225] font-medium mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[#2c2225] font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#9a8287] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
