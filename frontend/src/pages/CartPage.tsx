import { CartItem } from '../types'
import { Link } from 'react-router-dom'

interface CartPageProps {
  cartItems: CartItem[]
  onUpdateQuantity: (productId: number, newQuantity: number) => void
  onRemoveItem: (productId: number) => void
}

export default function CartPage({ cartItems, onUpdateQuantity, onRemoveItem }: CartPageProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 1500 ? 0 : 150
  const total = subtotal + shipping

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-20 min-h-[70vh]">
      <h1 className="text-3xl md:text-5xl font-bold font-['Playfair_Display'] text-[#2c2225] mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#e8dcd8]">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#2c2225] mb-4">Your cart is empty</h2>
          <p className="text-[#9a8287] mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="inline-block bg-[#c9707a] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b85f6a] transition-colors shadow-md hover:shadow-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-[#e8dcd8]">
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-[#faf7f5] rounded-2xl overflow-hidden border border-[#fdf8f4]">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-semibold text-[#c9707a] uppercase tracking-wider mb-1">{item.product.brand}</p>
                      <h3 className="text-lg font-bold text-[#2c2225] truncate">{item.product.name}</h3>
                      {item.product.shade && (
                        <p className="text-sm text-[#9a8287] mt-1">Shade: {item.product.shade}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-[#9a8287] hover:text-red-500 transition-colors p-2"
                      title="Remove Item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#e8dcd8] rounded-full overflow-hidden">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="px-4 py-2 text-[#5a4a4e] hover:bg-[#faf7f5] transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium text-[#2c2225] min-w-[3rem] text-center bg-[#faf7f5] border-x border-[#e8dcd8]">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-4 py-2 text-[#5a4a4e] hover:bg-[#faf7f5] transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg font-bold text-[#2c2225]">₹{item.product.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8dcd8] sticky top-24">
              <h2 className="text-2xl font-bold font-['Playfair_Display'] text-[#2c2225] mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-[15px] mb-6">
                <div className="flex justify-between text-[#5a4a4e]">
                  <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="font-medium text-[#2c2225]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#5a4a4e]">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="font-medium text-[#2c2225]">₹{shipping}</span>
                  )}
                </div>
              </div>
              
              <div className="border-t border-[#e8dcd8] pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-[#2c2225]">Total</span>
                  <span className="text-3xl font-bold text-[#c9707a]">₹{total}</span>
                </div>
                <p className="text-xs text-[#9a8287] text-right mt-2">Inclusive of all taxes</p>
              </div>
              
              <button className="w-full bg-[#2c2225] text-white py-4 rounded-full font-semibold text-lg hover:bg-[#1a1415] hover:shadow-xl transition-all flex items-center justify-center gap-2">
                Proceed to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
