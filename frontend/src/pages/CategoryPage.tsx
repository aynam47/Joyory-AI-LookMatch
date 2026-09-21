import { useParams } from 'react-router-dom'
import { Product } from '../types'
import { ProductCard } from '../components/ui/ProductCard'

export default function CategoryPage({ products, onAddToCart }: { products: Product[]; onAddToCart: (id: number) => void }) {
  const { category } = useParams<{ category: string }>()
  
  // Filter products by category (case-insensitive)
  const categoryProducts = products.filter(p => p.category.toLowerCase() === category?.toLowerCase())
  
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-20">
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">Shop</p>
        <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] text-[#2c2225] mb-4">
          {categoryName}
        </h1>
        <p className="text-[#5a4a4e]">
          Discover our curated collection of {categoryName.toLowerCase()} products.
        </p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categoryProducts.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#fdf8f4]">
          <span className="text-4xl mb-4 block">✨</span>
          <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#2c2225] mb-2">No products found</h3>
          <p className="text-[#9a8287]">We couldn't find any products in this category.</p>
        </div>
      )}
    </div>
  )
}
