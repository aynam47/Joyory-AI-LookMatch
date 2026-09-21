import { useState } from 'react'
import { Product } from '../../types'
import { ProductCard } from '../ui/ProductCard'

export function FeaturedProducts({ products, onAddToCart }: { products: Product[]; onAddToCart: (id: number) => void }) {
  const [activeTab, setActiveTab] = useState('All')

  // Extract unique categories dynamically, capitalize first letter
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
    .map(c => c.charAt(0).toUpperCase() + c.slice(1))
  const tabs = ['All', ...uniqueCategories]

  const filtered = activeTab === 'All' ? products : products.filter(p => p.category.toLowerCase() === activeTab.toLowerCase())

  return (
    <section id="products" className="py-20 bg-[#fdf8f4]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">Collection</p>
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-[#2c2225]">Curated For You</h2>
          </div>
          <div className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-semibold transition-colors ${activeTab === t ? 'bg-[#2c2225] text-white' : 'bg-white text-[#5a4a4e] hover:bg-[#f7e8e8]'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {filtered.slice(0, 10).map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  )
}
