export function PromoBanner() {
  return (
    <section className="py-12 bg-[#c9707a] text-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex w-16 h-16 rounded-full bg-white/20 items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🎁</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-['Playfair_Display'] mb-1">Get 15% off your first order</h3>
            <p className="text-white/80 text-sm">Sign up for our newsletter and receive exclusive beauty tips and offers.</p>
          </div>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 md:w-64 px-4 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-colors text-sm"
          />
          <button className="px-6 py-3 bg-white text-[#c9707a] rounded-full font-bold text-sm hover:bg-[#fdf8f4] transition-colors whitespace-nowrap shadow-md">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}
