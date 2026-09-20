import { useState, useMemo, useEffect, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
interface Product {
  id: number
  name: string
  brand: string
  category: string
  price: number
  shade?: string
  color_family?: string
  undertone?: string
  finish?: string
  texture?: string
  coverage?: string
  skin_types?: string[]
  features?: string[]
  image: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────
const ALL_FEATURES = [
  'long lasting', 'hydrating', 'vegan', 'plumping', 'lightweight',
  'oil control', '24h wear', 'cruelty-free', 'waterproof', 'lengthening',
  'smudge-proof', 'hyaluronic acid', 'fragrance-free', 'spf 50', 'no white cast'
]

const CATEGORIES = [
  { name: 'Skincare', icon: '✨', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=400&fit=crop&auto=format', count: 142 },
  { name: 'Makeup', icon: '💄', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=400&fit=crop&auto=format', count: 98 },
  { name: 'Haircare', icon: '🌿', image: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=300&h=400&fit=crop&auto=format', count: 73 },
  { name: 'Fragrance', icon: '🌸', image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=300&h=400&fit=crop&auto=format', count: 56 },
]

// ── Helpers ────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

function formatPrice(p: number) {
  return `₹${p.toLocaleString('en-IN')}`
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ cartCount, onAiClick }: { cartCount: number; onAiClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Offers']

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#2c2225] text-[#f7e8e8] text-center text-xs py-2 tracking-widest font-medium uppercase">
        Free shipping on orders above ₹999 &nbsp;·&nbsp; Use code <strong>JOYORY15</strong> for 15% off
      </div>

      <nav className="sticky top-0 z-50 bg-[#fdf8f4]/95 backdrop-blur-md border-b border-[#e8d8d8]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl font-['Playfair_Display'] font-bold text-[#2c2225] tracking-tight">
              Joy<span className="text-[#c9707a]">ory</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l} href="#" className="text-sm font-medium text-[#2c2225]/70 hover:text-[#c9707a] transition-colors duration-200">
                {l}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* AI LookMatch CTA */}
            <button
              onClick={onAiClick}
              className="hidden sm:flex items-center gap-1.5 bg-[#c9707a] hover:bg-[#a84f59] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI LookMatch
            </button>

            <button className="relative p-2 text-[#2c2225]/70 hover:text-[#c9707a] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            <button className="relative p-2 text-[#2c2225]/70 hover:text-[#c9707a] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#c9707a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="md:hidden p-2 text-[#2c2225]/70" onClick={() => setMenuOpen(o => !o)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#e8d8d8] bg-[#fdf8f4] px-4 py-4 flex flex-col gap-4">
            {navLinks.map(l => (
              <a key={l} href="#" className="text-sm font-medium text-[#2c2225]/70 hover:text-[#c9707a]">{l}</a>
            ))}
            <button onClick={onAiClick} className="flex items-center gap-1.5 bg-[#c9707a] text-white text-xs font-semibold px-3 py-2 rounded-full w-fit">
              ✨ AI LookMatch
            </button>
          </div>
        )}
      </nav>
    </>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero({ onAiClick }: { onAiClick: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#fdf8f4]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-4">New Season Collection</p>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl xl:text-7xl font-bold text-[#2c2225] leading-tight mb-6">
            Beauty that<br />
            <em className="text-[#c9707a] not-italic">matches</em> you
          </h1>
          <p className="text-[#9a8287] text-lg leading-relaxed mb-8 max-w-md">
            Discover curated skincare and makeup with ingredients tailored to your skin's needs. Now powered by AI ingredient matching.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#products" className="bg-[#2c2225] text-[#fdf8f4] font-semibold px-8 py-3.5 rounded-full hover:bg-[#c9707a] transition-colors duration-300 text-sm">
              Shop Now
            </a>
            <button
              onClick={onAiClick}
              className="border-2 border-[#c9707a] text-[#c9707a] font-semibold px-8 py-3.5 rounded-full hover:bg-[#c9707a] hover:text-white transition-all duration-300 text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Try AI LookMatch
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-[#e8d8d8]">
            {[['50K+', 'Happy Customers'], ['2000+', 'Products'], ['100%', 'Cruelty Free']].map(([val, label]) => (
              <div key={label}>
                <p className="font-['Playfair_Display'] text-2xl font-bold text-[#2c2225]">{val}</p>
                <p className="text-xs text-[#9a8287] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 md:order-2 relative">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-[#f7e8e8]">
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&h=900&fit=crop&auto=format"
              alt="Beauty products collection"
              className="w-full h-full object-cover"
            />
            {/* Floating card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#f7e8e8] flex items-center justify-center text-xl">✨</div>
                <div>
                  <p className="text-xs font-semibold text-[#c9707a] uppercase tracking-wide">AI LookMatch™</p>
                  <p className="text-sm font-medium text-[#2c2225]">Find your perfect ingredient match</p>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-[#f7e8e8] -z-10"/>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#c9a96e]/20 -z-10"/>
        </div>
      </div>
    </section>
  )
}

// ── Categories ─────────────────────────────────────────────────────────────
function Categories() {
  return (
    <section className="py-16 bg-[#fdf8f4]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">Browse</p>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#2c2225]">Shop by Category</h2>
          </div>
          <a href="#" className="text-sm text-[#c9707a] font-medium hover:underline hidden sm:block">View all →</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <a key={cat.name} href="#" className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#f7e8e8] cursor-pointer">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c2225]/70 via-transparent to-transparent"/>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-['Playfair_Display'] font-semibold text-lg">{cat.name}</p>
                <p className="text-xs text-white/70">{cat.count} products</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Product Card ───────────────────────────────────────────────────────────
function ProductCard({ product, matchScore, matchReasons, onAddToCart }: {
  product: Pick<Product, 'id'|'name'|'brand'|'price'|'image'|'features'|'shade'|'finish'> | Product
  matchScore?: number
  matchReasons?: string[]
  onAddToCart: (id: number) => void
}) {
  const [wishlist, setWishlist] = useState(false)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="relative aspect-square bg-[#f7e8e8] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#c9707a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            {product.badge}
          </span>
        )}
        {matchScore !== undefined && (
          <div className="absolute top-3 right-3 bg-[#2c2225] text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3 text-[#c9a96e]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            {matchScore}% match
          </div>
        )}
        <button
          onClick={() => setWishlist(w => !w)}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className={`w-4 h-4 ${wishlist ? 'text-[#c9707a] fill-[#c9707a]' : 'text-[#9a8287]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
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

        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] text-[#9a8287] mb-1.5">Why it matches:</p>
            <div className="flex flex-col gap-1">
              {matchReasons.slice(0, 3).map((reason, idx) => (
                <span key={idx} className="text-[9px] bg-[#f7e8e8] text-[#c9707a] px-1.5 py-0.5 rounded-sm font-medium">{reason}</span>
              ))}
            </div>
          </div>
        )}

        {!matchReasons && product.features && product.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map(feat => (
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

// ── AI LookMatch Section ───────────────────────────────────────────────────
function AILookMatch({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [textInput, setTextInput] = useState('')
  const [textError, setTextError] = useState('')
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'chips' | 'text'>('chips')
  const [matchedResults, setMatchedResults] = useState<any[]>([])

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    )
    setSearched(false)
  }

  const clearAll = () => {
    setSelectedFeatures([])
    setTextInput('')
    setTextError('')
    setSearched(false)
    setMatchedResults([])
  }

  const handleMatch = async () => {
    if (activeTab === 'chips' && selectedFeatures.length === 0) return
    if (activeTab === 'text' && !textInput.trim()) {
      setTextError('Please enter a description.')
      return
    }

    setLoading(true)
    setTextError('')
    setSearched(false)
    
    try {
      let attributes = {}
      if (activeTab === 'text') {
        const res = await fetch('/api/ai/product-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textInput })
        })
        if (!res.ok) throw new Error('Failed to analyze text')
        attributes = await res.json()
      } else {
        attributes = { features: selectedFeatures }
      }

      const matchRes = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attributes)
      })
      if (!matchRes.ok) throw new Error('Failed to find matches')
      
      const data = await matchRes.json()
      setMatchedResults(data.matches || [])
      setSearched(true)
    } catch (err) {
      console.error(err)
      setTextError('Something went wrong finding matches. Ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="lookmatch" className="py-20 bg-[#2c2225]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#c9707a]/20 text-[#f7e8e8] text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-widest">
            <svg className="w-3.5 h-3.5 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Joyory AI LookMatch™
          </div>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#fdf8f4] mb-4">
            Match by <em className="text-[#c9707a] not-italic">Look or Features</em>
          </h2>
          <p className="text-[#9a8287] text-lg max-w-xl mx-auto">
            Select the features you want or describe your desired look in natural language. Our AI instantly surfaces every product matching your requirements.
          </p>
        </div>

        {/* Ingredient Selector */}
        <div className="bg-[#3a2e31] rounded-3xl p-6 md:p-10 mb-8">

          {/* Tab switcher */}
          <div className="flex items-center gap-1 bg-[#2c2225] p-1 rounded-full w-fit mb-7">
            {(['chips', 'text'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setTextError('') }}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === tab ? 'bg-[#c9707a] text-white' : 'text-[#9a8287] hover:text-[#f7e8e8]'
                }`}
              >
                {tab === 'chips' ? (
                  <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>Quick Select</>
                ) : (
                  <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>Describe Look</>
                )}
              </button>
            ))}
          </div>

          {/* ── Quick Select chips ── */}
          {activeTab === 'chips' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[#f7e8e8] font-semibold text-sm">Select your features</h3>
                {selectedFeatures.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-[#9a8287] hover:text-[#c9707a] transition-colors">
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {ALL_FEATURES.map(feat => {
                  const active = selectedFeatures.includes(feat)
                  return (
                    <button
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                        active
                          ? 'bg-[#c9707a] border-[#c9707a] text-white scale-105'
                          : 'bg-transparent border-[#5a4a4e] text-[#9a8287] hover:border-[#c9707a] hover:text-[#c9707a]'
                      }`}
                    >
                      {active && <span className="mr-1">✓</span>}{feat}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* ── Text input ── */}
          {activeTab === 'text' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[#f7e8e8] font-semibold text-sm">Describe what you are looking for</h3>
                {textInput && (
                  <button onClick={clearAll} className="text-xs text-[#9a8287] hover:text-[#c9707a] transition-colors">
                    Clear all
                  </button>
                )}
              </div>

              <p className="text-[#9a8287] text-xs mb-3">
                Tell us about your skin type, desired finish, or specific needs — e.g. <span className="text-[#c9a96e]">I want a matte lipstick that is long lasting</span>
              </p>

              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={e => { setTextInput(e.target.value); setTextError('') }}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleMatch() }}
                  placeholder="Describe your desired product..."
                  rows={5}
                  className="w-full bg-[#2c2225] text-[#f7e8e8] placeholder:text-[#5a4a4e] text-sm px-5 py-4 rounded-2xl border border-[#5a4a4e] focus:outline-none focus:border-[#c9707a] resize-none leading-relaxed transition-colors duration-200"
                />
              </div>

              {/* Error message */}
              {textError && (
                <div className="mt-3 flex items-start gap-2 bg-[#c9707a]/10 border border-[#c9707a]/30 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-[#c9707a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-[#c9707a] text-xs leading-relaxed">{textError}</p>
                </div>
              )}
            </div>
          )}

          {/* Selected pills summary (always visible when something is selected) */}
          {activeTab === 'chips' && selectedFeatures.length > 0 && (
            <div className="mt-7 pt-6 border-t border-[#5a4a4e]">
              <p className="text-[#9a8287] text-xs mb-3 uppercase tracking-widest font-semibold">
                {selectedFeatures.length} feature{selectedFeatures.length > 1 ? 's' : ''} queued for matching
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFeatures.map(feat => (
                  <span key={feat} className="flex items-center gap-1.5 bg-[#c9707a]/20 text-[#f7e8e8] text-xs px-3 py-1.5 rounded-full">
                    {feat}
                    <button
                      onClick={() => { setSelectedFeatures(prev => prev.filter(f => f !== feat)); setSearched(false) }}
                      className="text-[#c9707a] hover:text-white transition-colors leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-[#5a4a4e]">
            <p className="text-[#9a8287] text-sm">
              {activeTab === 'chips' && selectedFeatures.length === 0
                ? 'No features selected yet'
                : activeTab === 'text' && !textInput
                ? 'Describe your look above'
                : <span>Ready to match!</span>
              }
            </p>
            <button
              onClick={handleMatch}
              disabled={(activeTab === 'chips' && selectedFeatures.length === 0) || (activeTab === 'text' && !textInput) || loading}
              className="flex items-center gap-2 bg-[#c9707a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full hover:bg-[#a84f59] transition-colors duration-200 text-sm"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Matching…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Find My Matches
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-[#f7e8e8] font-['Playfair_Display'] text-2xl font-bold">
                {matchedResults.length > 0 ? `${matchedResults.length} products matched` : 'No matches found'}
              </h3>
              {matchedResults.length > 0 && <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>}
            </div>

            {matchedResults.length === 0 ? (
              <div className="text-center py-12 text-[#9a8287]">
                <p className="text-4xl mb-4">🔍</p>
                <p>We couldn't find an exact match for those criteria. Try different features.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {matchedResults.map((match: any) => (
                  <ProductCard
                    key={match.id}
                    product={match}
                    matchScore={Math.round(match.score)}
                    matchReasons={match.reasons}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ── Featured Products ──────────────────────────────────────────────────────
function FeaturedProducts({ products, onAddToCart }: { products: Product[]; onAddToCart: (id: number) => void }) {
  const [activeTab, setActiveTab] = useState('All')
  
  // Extract unique categories dynamically, capitalize first letter
  const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
    .map(c => c.charAt(0).toUpperCase() + c.slice(1))
  const tabs = ['All', ...uniqueCategories]

  const filtered = activeTab === 'All' ? products : products.filter(p => p.category.toLowerCase() === activeTab.toLowerCase())

  return (
    <section id="products" className="py-20 bg-[#fdf8f4]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">Collection</p>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#2c2225]">Featured Products</h2>
          </div>

          <div className="flex items-center gap-1 bg-[#f7e8e8] p-1 rounded-full">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab ? 'bg-[#2c2225] text-white' : 'text-[#9a8287] hover:text-[#2c2225]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart}/>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#" className="inline-flex items-center gap-2 border-2 border-[#2c2225] text-[#2c2225] font-semibold px-8 py-3 rounded-full hover:bg-[#2c2225] hover:text-white transition-all duration-200 text-sm">
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

// ── How It Works ───────────────────────────────────────────────────────────
function HowItWorks({ onAiClick }: { onAiClick: () => void }) {
  const steps = [
    { n: '01', icon: '🧪', title: 'Pick your ingredients', desc: 'Select any skincare actives you love or want to try — from Retinol to Niacinamide.' },
    { n: '02', icon: '🤖', title: 'AI scans the catalog', desc: 'Our ingredient-matching engine searches across thousands of formulas in seconds.' },
    { n: '03', icon: '✨', title: 'Get your matches', desc: 'Products are ranked by ingredient overlap so you find the best fit instantly.' },
  ]

  return (
    <section className="py-20 bg-[#f7e8e8]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">How it works</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#2c2225]">Meet AI LookMatch™</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map(s => (
            <div key={s.n} className="bg-white rounded-3xl p-8 relative">
              <span className="absolute top-6 right-6 font-['Playfair_Display'] text-4xl font-bold text-[#e8d8d8]">{s.n}</span>
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="font-['Playfair_Display'] font-semibold text-xl text-[#2c2225] mb-3">{s.title}</h3>
              <p className="text-[#9a8287] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onAiClick}
            className="inline-flex items-center gap-2 bg-[#c9707a] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#a84f59] transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Try AI LookMatch Now
          </button>
        </div>
      </div>
    </section>
  )
}

// ── Banner ─────────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <section className="py-16 bg-[#fdf8f4]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="rounded-3xl overflow-hidden relative bg-[#2c2225] flex flex-col md:flex-row items-center">
          <div className="flex-1 p-10 md:p-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9a96e] mb-3">Limited time</p>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-[#fdf8f4] mb-4">
              Get 20% off your<br/>first order
            </h2>
            <p className="text-[#9a8287] mb-8 max-w-sm">Sign up for the Joyory newsletter and be the first to discover new launches and exclusive deals.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md" onSubmit={e => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3 rounded-full bg-[#3a2e31] text-[#f7e8e8] placeholder:text-[#5a4a4e] text-sm border border-[#5a4a4e] focus:outline-none focus:border-[#c9707a]"
              />
              <button type="submit" className="bg-[#c9707a] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#a84f59] transition-colors text-sm whitespace-nowrap">
                Claim Offer
              </button>
            </form>
          </div>
          <div className="w-full md:w-80 h-56 md:h-auto md:self-stretch overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1631214524020-3c69888b8f4a?w=600&h=500&fit=crop&auto=format"
              alt="Beauty offer"
              className="w-full h-full object-cover opacity-60 md:opacity-100"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name: 'Priya S.', rating: 5, text: 'AI LookMatch found me a moisturizer with Ceramides + Niacinamide in under 10 seconds. My skin has never been happier!', product: 'Glow Surge Moisturizer' },
    { name: 'Nandita R.', rating: 5, text: 'I always check ingredients before buying. This feature saves me so much time. Found my perfect Vitamin C serum instantly.', product: 'Vitamin C Brightening Serum' },
    { name: 'Tara K.', rating: 4, text: 'Such a smart tool. Selected 3 ingredients and got 8 perfectly matched products. Game changer for ingredient nerds like me!', product: 'Centella Calm Serum' },
  ]

  return (
    <section className="py-20 bg-[#f7e8e8]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">Reviews</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#2c2225]">What our customers say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(r => (
            <div key={r.name} className="bg-white rounded-3xl p-8">
              <StarRating rating={r.rating}/>
              <p className="text-[#2c2225] text-sm leading-relaxed mt-4 mb-6 font-['Playfair_Display'] italic">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#f7e8e8]">
                <div className="w-9 h-9 rounded-full bg-[#c9707a]/20 flex items-center justify-center text-[#c9707a] font-bold text-sm">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2c2225]">{r.name}</p>
                  <p className="text-xs text-[#9a8287]">{r.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#2c2225] text-[#9a8287]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="font-['Playfair_Display'] text-2xl font-bold text-[#f7e8e8]">
              Joy<span className="text-[#c9707a]">ory</span>
            </span>
            <p className="text-sm mt-4 leading-relaxed">India's favourite beauty destination. Skincare, makeup, and more — curated for every skin story.</p>
            <div className="flex gap-4 mt-6">
              {['instagram', 'twitter', 'youtube'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-full border border-[#5a4a4e] flex items-center justify-center hover:border-[#c9707a] hover:text-[#c9707a] transition-colors text-xs capitalize">
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop', links: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'New Arrivals', 'Bestsellers'] },
            { title: 'Help', links: ['Track Order', 'Returns', 'FAQs', 'Contact Us', 'Shipping Info'] },
            { title: 'Company', links: ['About Joyory', 'Careers', 'Press', 'Sustainability', 'AI LookMatch™'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[#f7e8e8] font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-sm hover:text-[#c9707a] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#3a2e31] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 Joyory. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map(l => (
              <a key={l} href="#" className="hover:text-[#c9707a] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Cart Toast ─────────────────────────────────────────────────────────────
function Toast({ show }: { show: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-[#2c2225] text-[#f7e8e8] text-sm font-medium px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
      </svg>
      Added to cart!
    </div>
  )
}

// ── Voice Chat ─────────────────────────────────────────────────────────────
interface Transcript {
  id: number
  text: string
  interim: boolean
  ts: string
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

function VoiceChat() {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [interimText, setInterimText] = useState('')
  const [supported, setSupported] = useState(true)
  const [copied, setCopied] = useState<number | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(0)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-IN'

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        if (result.isFinal) {
          const text = result[0].transcript.trim()
          if (text) {
            counterRef.current += 1
            const now = new Date()
            const ts = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            setTranscripts(prev => [...prev, { id: counterRef.current, text, interim: false, ts }])
          }
          setInterimText('')
        } else {
          interim += result[0].transcript
        }
      }
      setInterimText(interim)
    }

    rec.onerror = () => setListening(false)
    rec.onend = () => { if (listening) rec.start() }
    recognitionRef.current = rec
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcripts, interimText])

  const toggleListening = () => {
    const rec = recognitionRef.current
    if (!rec) return
    if (listening) {
      rec.stop()
      setListening(false)
      setInterimText('')
    } else {
      rec.start()
      setListening(true)
    }
  }

  const copyText = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => {
    const all = transcripts.map(t => t.text).join(' ')
    navigator.clipboard.writeText(all)
  }

  const clearAll = () => {
    setTranscripts([])
    setInterimText('')
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#c9707a] text-white shadow-xl flex items-center justify-center hover:bg-[#a84f59] transition-colors duration-200 group"
        aria-label="Voice chat"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 116 0v4a3 3 0 11-6 0z"/>
          </svg>
        )}
        {!open && listening && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse"/>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-[340px] sm:w-[400px] bg-[#2c2225] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#5a4a4e]"
          style={{ maxHeight: '70vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#3a2e31]">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${listening ? 'bg-[#c9707a] animate-pulse' : 'bg-[#3a2e31]'}`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 116 0v4a3 3 0 11-6 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-[#f7e8e8] text-sm font-semibold font-['Playfair_Display']">Voice to Text</p>
                <p className="text-[10px] text-[#9a8287]">{listening ? 'Listening…' : 'Ready'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {transcripts.length > 0 && (
                <>
                  <button onClick={copyAll} title="Copy all text" className="p-1.5 text-[#9a8287] hover:text-[#c9a96e] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10"/>
                    </svg>
                  </button>
                  <button onClick={clearAll} title="Clear" className="p-1.5 text-[#9a8287] hover:text-[#c9707a] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Waveform visualizer */}
          {listening && (
            <div className="flex items-center justify-center gap-1 py-3 bg-[#3a2e31]">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-[#c9707a]"
                  style={{
                    height: `${8 + Math.random() * 20}px`,
                    animation: `wave ${0.5 + Math.random() * 0.8}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Transcript area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 200 }}>
            {!supported && (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">🚫</p>
                <p className="text-[#9a8287] text-sm">Speech recognition isn't supported in this browser. Please use Chrome or Edge.</p>
              </div>
            )}

            {supported && transcripts.length === 0 && !interimText && (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#3a2e31] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#9a8287]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 116 0v4a3 3 0 11-6 0z"/>
                  </svg>
                </div>
                <p className="text-[#f7e8e8] text-sm font-medium mb-1">Start speaking</p>
                <p className="text-[#9a8287] text-xs">Your words will appear here in real-time</p>
              </div>
            )}

            {transcripts.map(t => (
              <div key={t.id} className="group flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-[#c9707a]/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#c9707a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="bg-[#3a2e31] rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-[#f7e8e8] text-sm leading-relaxed">{t.text}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-1">
                    <span className="text-[10px] text-[#5a4a4e]">{t.ts}</span>
                    <button
                      onClick={() => copyText(t.id, t.text)}
                      className="text-[10px] text-[#5a4a4e] hover:text-[#c9a96e] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {copied === t.id ? '✓ copied' : 'copy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Interim text */}
            {interimText && (
              <div className="flex gap-3 items-start opacity-60">
                <div className="w-7 h-7 rounded-full bg-[#c9707a]/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#c9707a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="bg-[#3a2e31] rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                  <p className="text-[#9a8287] text-sm italic leading-relaxed">{interimText}
                    <span className="inline-block w-1 h-4 bg-[#c9707a] ml-1 animate-pulse align-middle"/>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer: mic button */}
          <div className="px-5 py-4 border-t border-[#3a2e31] flex items-center gap-4">
            <button
              onClick={toggleListening}
              disabled={!supported}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
                listening
                  ? 'bg-[#c9707a] text-white hover:bg-[#a84f59]'
                  : 'bg-[#f7e8e8] text-[#2c2225] hover:bg-[#e8d8d8]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {listening ? (
                <>
                  <span className="w-3 h-3 rounded-sm bg-white"/>
                  Stop Recording
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 116 0v4a3 3 0 11-6 0z"/>
                  </svg>
                  Start Recording
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wave {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}

// ── App Root ───────────────────────────────────────────────────────────────
export default function App() {
  const [cartCount, setCartCount] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products:', err))
  }, [])

  const addToCart = (_id: number) => {
    setCartCount(c => c + 1)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const scrollToLookMatch = () => {
    document.getElementById('lookmatch')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <Navbar cartCount={cartCount} onAiClick={scrollToLookMatch}/>
      <Hero onAiClick={scrollToLookMatch}/>
      <Categories/>
      <FeaturedProducts products={products} onAddToCart={addToCart}/>
      <HowItWorks onAiClick={scrollToLookMatch}/>
      <AILookMatch onAddToCart={addToCart}/>
      <PromoBanner/>
      <Testimonials/>
      <Footer/>
      <Toast show={showToast}/>
      <VoiceChat/>
    </div>
  )
}
