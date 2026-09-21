export function Toast({ show }: { show: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-[#2c2225] text-[#f7e8e8] text-sm font-medium px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Added to cart!
    </div>
  )
}
