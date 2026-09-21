import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Navbar({ cartCount, onAiClick }: { cartCount: number; onAiClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Offers']

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#2c2225] text-[#f7e8e8] text-center text-xs py-2 tracking-widest font-medium uppercase">
        Free shipping on orders above ₹999 &nbsp;·&nbsp; Use code <strong>JOYORY15</strong> for 15% off
      </div>

      <nav className="sticky top-0 z-50 bg-[#faf7f5]/70 backdrop-blur-xl shadow-sm border-b border-white/20 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-['Playfair_Display'] font-bold text-[#2c2225] tracking-tight">
              Joy<span className="text-[#c9707a]">ory</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <Link key={l} to={`/${l.toLowerCase()}`} className="text-sm font-medium text-[#2c2225]/70 hover:text-[#c9707a] transition-colors duration-200">
                {l}
              </Link>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link to="/cart" className="relative p-2 text-[#2c2225]/70 hover:text-[#c9707a] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#c9707a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden p-2 text-[#2c2225]/70" onClick={() => setMenuOpen(o => !o)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#e8d8d8] bg-[#fdf8f4] px-4 py-4 flex flex-col gap-4">
            {navLinks.map(l => (
              <Link key={l} to={`/${l.toLowerCase()}`} className="text-sm font-medium text-[#2c2225]/70 hover:text-[#c9707a]" onClick={() => setMenuOpen(false)}>{l}</Link>
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
