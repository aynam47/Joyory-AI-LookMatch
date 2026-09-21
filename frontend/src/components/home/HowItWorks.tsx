export function HowItWorks() {
  const steps = [
    { title: 'Describe', desc: 'Tell our AI what you\'re looking for or upload a reference image.', icon: '💬' },
    { title: 'Analyze', desc: 'Joyory AI understands your skin tone, type, and preferences.', icon: '🧠' },
    { title: 'Match', desc: 'Get personalized product recommendations instantly.', icon: '✨' },
  ]
  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9707a] mb-2">AI LookMatch™</p>
        <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] text-[#2c2225] mb-16">How it works</h2>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-[#e8d8d8] to-transparent" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative flex flex-col items-center">
              <div className="w-24 h-24 bg-[#fdf8f4] rounded-full flex items-center justify-center text-3xl mb-6 shadow-sm border border-[#f7e8e8] z-10">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#2c2225] mb-3">{i + 1}. {s.title}</h3>
              <p className="text-[#5a4a4e] text-sm leading-relaxed max-w-[250px]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
