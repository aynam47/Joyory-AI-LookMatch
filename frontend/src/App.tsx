import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Product, CartItem } from './types'

// Layout Components
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'

// Home Components
import { Hero } from './components/home/Hero'
import { Categories } from './components/home/Categories'
import { FeaturedProducts } from './components/home/FeaturedProducts'
import { HowItWorks } from './components/home/HowItWorks'
import { PromoBanner } from './components/home/PromoBanner'
import { Testimonials } from './components/home/Testimonials'

// UI Components
import { Toast } from './components/ui/Toast'
import { VoiceChat } from './components/ui/VoiceChat'

// Pages
import AILookMatchPage from './pages/AILookMatchPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'

function Home({ products, onAddToCart }: { products: Product[]; onAddToCart: (id: number) => void }) {
  const navigate = useNavigate()

  return (
    <>
      <Hero onAiClick={() => navigate('/ai-lookmatch')} />
      <Categories />
      <FeaturedProducts products={products} onAddToCart={onAddToCart} />
      <HowItWorks />
      <PromoBanner />
      <Testimonials />
    </>
  )
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products", err))
  }, [])

  const handleAddToCart = (id: number, navigate: (path: string) => void) => {
    const product = products.find(p => p.id === id)
    if (!product) return

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === id)
      if (existing) {
        return prev.map(item => item.product.id === id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { product, quantity: 1 }]
    })
    
    navigate('/cart')
  }

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <Router>
      <div className="min-h-screen bg-[#faf7f5] font-['Inter'] flex flex-col selection:bg-[#c9707a] selection:text-white">
        <Routes>
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <NavbarWrapper cartCount={cartCount} />
              <main className="flex-1">
                <RoutesWrapper 
                  products={products} 
                  cartItems={cartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              </main>
              <Footer />
            </div>
          } />
        </Routes>
        <VoiceChat />
      </div>
    </Router>
  )
}

function RoutesWrapper({ 
  products, 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveItem 
}: any) {
  const navigate = useNavigate()
  return (
    <Routes>
      <Route path="/" element={<Home products={products} onAddToCart={(id) => onAddToCart(id, navigate)} />} />
      <Route path="/ai-lookmatch" element={<AILookMatchPage onAddToCart={(id) => onAddToCart(id, navigate)} />} />
      <Route path="/cart" element={<CartPage cartItems={cartItems} onUpdateQuantity={onUpdateQuantity} onRemoveItem={onRemoveItem} />} />
      <Route path="/:category" element={<CategoryPage products={products} onAddToCart={(id) => onAddToCart(id, navigate)} />} />
    </Routes>
  )
}

function NavbarWrapper({ cartCount }: { cartCount: number }) {
  const navigate = useNavigate()
  return <Navbar cartCount={cartCount} onAiClick={() => navigate('/ai-lookmatch')} />
}

