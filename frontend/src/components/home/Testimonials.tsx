export function Testimonials() {
  const reviews = [
    { name: 'Priya S.', text: 'The AI LookMatch recommended a foundation that actually matches my undertone perfectly. I am obsessed!', item: 'Luminous Liquid Foundation' },
    { name: 'Aisha K.', text: 'Finally, skincare that works for my concerns. The ingredients breakdown gave me so much confidence.', item: 'Vitamin C Brightening Serum' },
    { name: 'Meera R.', text: 'I just uploaded a photo of a look I loved, and Joyory found the exact lipstick shade. Magic!', item: 'Velvet Matte Lipstick' }
  ]
  return (
    <section className="py-24 bg-[#faf7f5]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-center text-[#2c2225] mb-16">Loved by thousands</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(r => (
            <div key={r.name} className="bg-white p-8 rounded-2xl shadow-sm border border-[#fdf8f4]">
              <div className="flex text-[#c9a96e] mb-4 text-sm">
                {'★'.repeat(5)}
              </div>
              <p className="text-[#5a4a4e] text-sm leading-relaxed mb-6 italic">"{r.text}"</p>
              <div>
                <p className="font-bold text-[#2c2225] text-sm">{r.name}</p>
                <p className="text-xs text-[#9a8287] mt-1">Purchased {r.item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
