export function Hero({ onAiClick }: { onAiClick: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#faf7f5] h-[90vh] min-h-[600px] flex items-center">
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1600&q=80&fit=crop&auto=format"
          alt="Beauty collection"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f5] via-[#faf7f5]/80 to-transparent" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 w-full">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 bg-[#c9707a]/10 text-[#c9707a] text-xs font-bold tracking-widest uppercase rounded-full mb-6">
            New Arrival
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-['Playfair_Display'] text-[#2c2225] leading-[1.1] mb-6">
            Discover Your<br />
            <span className="text-[#c9707a] italic">Perfect</span> Match
          </h1>
          <p className="text-[#5a4a4e] text-lg sm:text-xl mb-10 leading-relaxed font-medium">
            India's most loved beauty destination. Experience personalized recommendations powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-[#2c2225] hover:bg-[#1a1416] text-[#f7e8e8] px-8 py-4 rounded-full font-semibold transition-all duration-300">
              Shop Collection
            </button>
            <button
              onClick={onAiClick}
              className="w-full sm:w-auto bg-white hover:bg-[#fcfafa] text-[#2c2225] px-8 py-4 rounded-full font-semibold border border-[#e8d8d8] shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5 text-[#c9707a] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Try AI LookMatch
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
