export function Footer() {
  return (
    <footer className="bg-[#2c2225] text-[#9a8287]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="font-['Playfair_Display'] text-2xl font-bold text-[#f7e8e8]">
              Joy<span className="text-[#c9707a]">ory</span>
            </span>
            <p className="text-sm mt-4 leading-relaxed">India's favourite beauty destination. Skincare, makeup, and more — curated for every skin story.</p>
            <div className="flex gap-4 mt-6">
              {['instagram', 'twitter', 'youtube'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-full border border-[#5a4a4e] flex items-center justify-center hover:border-[#c9707a] hover:text-[#c9707a] transition-colors text-xs capitalize">
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop', links: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'New Arrivals', 'Bestsellers'] },
            { title: 'Help', links: ['Track Order', 'Returns', 'FAQs', 'Contact Us', 'Shipping Info'] },
            { title: 'Company', links: ['About Joyory', 'Careers', 'Press', 'Sustainability', 'AI LookMatch™'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[#f7e8e8] font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-sm hover:text-[#c9707a] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#3a2e31] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 Joyory. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map(l => (
              <a key={l} href="#" className="hover:text-[#c9707a] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
