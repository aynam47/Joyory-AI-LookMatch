import { CATEGORIES } from '../../data/mockData'

export function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">Shop by</p>
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-[#2c2225]">Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-[4/5] md:aspect-[3/4] bg-[#f7e8e8]">
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c2225]/80 via-[#2c2225]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center">
                <span className="text-3xl mb-3">{cat.icon}</span>
                <h3 className="text-white font-semibold text-lg tracking-wide">{cat.name}</h3>
                <p className="text-[#f7e8e8]/80 text-xs mt-1 font-medium">{cat.count} products</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
