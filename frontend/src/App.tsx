import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Product } from './types'

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
  const [cartCount, setCartCount] = useState(0)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products", err))
  }, [])

  const handleAddToCart = (id: number) => {
    setCartCount(c => c + 1)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#faf7f5] font-['Inter'] flex flex-col selection:bg-[#c9707a] selection:text-white">
        {/* Pass navigate via render prop or inner component if needed, but here we can just use a wrapper */}
        <Routes>
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <NavbarWrapper cartCount={cartCount} />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home products={products} onAddToCart={handleAddToCart} />} />
                  <Route path="/ai-lookmatch" element={<AILookMatchPage onAddToCart={handleAddToCart} />} />
                  <Route path="/:category" element={<CategoryPage products={products} onAddToCart={handleAddToCart} />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
        <VoiceChat />
        <Toast show={showToast} />
      </div>
    </Router>
  )
}

function NavbarWrapper({ cartCount }: { cartCount: number }) {
  const navigate = useNavigate()
  return <Navbar cartCount={cartCount} onAiClick={() => navigate('/ai-lookmatch')} />
}
