import { useState } from 'react'
import { Product } from '../../types'
import { formatPrice } from '../../utils/formatters'

export function ProductCard({ product, matchScore, matchReasons, matchUnmatched, onAddToCart }: {
  product: Pick<Product, 'id' | 'name' | 'brand' | 'price' | 'image' | 'features' | 'shade' | 'finish' | 'badge' | 'originalPrice' | 'savings_percentage' | 'shared_ingredients'> | Product
  matchScore?: number
  matchReasons?: string[]
  matchUnmatched?: string[]
  onAddToCart: (id: number) => void
}) {
  const [wishlist, setWishlist] = useState(false)

  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-white/60">
      <div className="relative aspect-square bg-[#f7e8e8] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#c9707a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex flex-col gap-1 z-10 shadow-sm">
            {product.badge}
          </span>
        )}
        {product.savings_percentage && product.savings_percentage > 0 && (
          <span className={`absolute ${product.badge ? 'top-10' : 'top-3'} left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1 z-10`}>
            💸 Save {product.savings_percentage}%
          </span>
        )}
        {matchScore !== undefined && (
          <div className="absolute top-3 right-3 bg-[#2c2225] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3 text-[#c9a96e]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {matchScore}% match
          </div>
        )}
        <button
          onClick={() => setWishlist(w => !w)}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className={`w-4 h-4 ${wishlist ? 'text-[#c9707a] fill-[#c9707a]' : 'text-[#9a8287]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#c9a96e] mb-1">{product.brand}</p>
        <h3 className="font-['Playfair_Display'] font-semibold text-sm text-[#2c2225] mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-1.5 mb-2 text-xs text-[#9a8287]">
          {product.shade && <span>Shade: {product.shade}</span>}
          {product.finish && <span>• {product.finish}</span>}
        </div>

        {/* Shared Actives */}
        {product.shared_ingredients && product.shared_ingredients.length > 0 && (
          <div className="mb-2.5 bg-[#fdf8f4] border border-[#c9a96e]/30 rounded-lg p-2">
            <p className="text-[9px] font-bold text-[#8c6b2d] uppercase tracking-wide mb-1 flex items-center gap-1">
              <span>🌿</span> Shared Actives with Reference:
            </p>
            <div className="flex flex-wrap gap-1">
              {product.shared_ingredients.map((ing: string, idx: number) => (
                <span key={idx} className="text-[9px] bg-[#c9a96e]/20 text-[#6f531e] font-semibold px-1.5 py-0.5 rounded">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {((matchReasons && matchReasons.length > 0) || (matchUnmatched && matchUnmatched.length > 0)) && (
          <div className="mb-3 space-y-2">
            {matchReasons && matchReasons.length > 0 && (
              <div>
                <p className="text-[10px] text-[#9a8287] mb-1.5">What matches:</p>
                <div className="flex flex-col gap-1">
                  {matchReasons.slice(0, 3).map((reason, idx) => (
                    <span key={idx} className="text-[9px] bg-[#e6f4ea] text-[#1e8e3e] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {matchUnmatched && matchUnmatched.length > 0 && (
              <div>
                <p className="text-[10px] text-[#9a8287] mb-1.5">What's missing:</p>
                <div className="flex flex-col gap-1">
                  {matchUnmatched.slice(0, 3).map((reason, idx) => (
                    <span key={idx} className="text-[9px] bg-[#fce8e6] text-[#d93025] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!matchReasons && product.features && product.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feat: string) => (
                <span key={feat} className="text-[9px] bg-[#f7e8e8] text-[#9a8287] px-1.5 py-0.5 rounded-full">{feat}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto mb-3">
          <span className="font-bold text-[#2c2225]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs line-through text-[#9a8287]">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product.id)}
          className="w-full bg-[#2c2225] text-[#fdf8f4] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#c9707a] transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
