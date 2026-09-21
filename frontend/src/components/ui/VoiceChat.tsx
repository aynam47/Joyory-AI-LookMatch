import { useState, useEffect, useRef } from 'react'

interface Transcript {
  id: number
  text: string
  interim: boolean
  ts: string
}

export function VoiceChat() {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [interimText, setInterimText] = useState('')
  const [supported, setSupported] = useState(true)
  const [copied, setCopied] = useState<number | null>(null)
  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(0)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { setSupported(false); return }

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-IN'

    rec.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        if (result.isFinal) {
          const text = result[0].transcript.trim()
          if (text) {
            counterRef.current += 1
            const now = new Date()
            const ts = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            setTranscripts(prev => [...prev, { id: counterRef.current, text, interim: false, ts }])
          }
          setInterimText('')
        } else {
          interim += result[0].transcript
        }
      }
      setInterimText(interim)
    }

    rec.onerror = () => setListening(false)
    rec.onend = () => { if (listening) rec.start() }
    recognitionRef.current = rec
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcripts, interimText])

  const toggleListening = () => {
    const rec = recognitionRef.current
    if (!rec) return
    if (listening) {
      rec.stop()
      setListening(false)
      setInterimText('')
    } else {
      rec.start()
      setListening(true)
    }
  }

  const copyText = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = () => {
    const all = transcripts.map(t => t.text).join(' ')
    navigator.clipboard.writeText(all)
  }

  const clearAll = () => {
    setTranscripts([])
    setInterimText('')
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#c9707a] text-white shadow-xl flex items-center justify-center hover:bg-[#a84f59] transition-colors duration-200 group"
        aria-label="Voice chat"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 116 0v4a3 3 0 11-6 0z" />
          </svg>
        )}
        {!open && listening && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 w-[340px] sm:w-[400px] bg-[#2c2225] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#5a4a4e]"
          style={{ maxHeight: '70vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#3a2e31]">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${listening ? 'bg-[#c9707a] animate-pulse' : 'bg-[#3a2e31]'}`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 116 0v4a3 3 0 11-6 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#f7e8e8] text-sm font-semibold font-['Playfair_Display']">Voice to Text</p>
                <p className="text-[10px] text-[#9a8287]">{listening ? 'Listening…' : 'Ready'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {transcripts.length > 0 && (
                <>
                  <button onClick={copyAll} title="Copy all text" className="p-1.5 text-[#9a8287] hover:text-[#c9a96e] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10" />
                    </svg>
                  </button>
                  <button onClick={clearAll} title="Clear" className="p-1.5 text-[#9a8287] hover:text-[#c9707a] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Waveform visualizer */}
          {listening && (
            <div className="flex items-center justify-center gap-1 py-3 bg-[#3a2e31]">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-[#c9707a]"
                  style={{
                    height: `${8 + Math.random() * 20}px`,
                    animation: `wave ${0.5 + Math.random() * 0.8}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Transcript area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: 200 }}>
            {!supported && (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">🚫</p>
                <p className="text-[#9a8287] text-sm">Speech recognition isn't supported in this browser. Please use Chrome or Edge.</p>
              </div>
            )}

            {supported && transcripts.length === 0 && !interimText && (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#3a2e31] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#9a8287]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 116 0v4a3 3 0 11-6 0z" />
                  </svg>
                </div>
                <p className="text-[#f7e8e8] text-sm font-medium mb-1">Start speaking</p>
                <p className="text-[#9a8287] text-xs">Your words will appear here in real-time</p>
              </div>
            )}

            {transcripts.map(t => (
              <div key={t.id} className="group flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-[#c9707a]/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#c9707a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="bg-[#3a2e31] rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-[#f7e8e8] text-sm leading-relaxed">{t.text}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 ml-1">
                    <span className="text-[10px] text-[#5a4a4e]">{t.ts}</span>
                    <button
                      onClick={() => copyText(t.id, t.text)}
                      className="text-[10px] text-[#5a4a4e] hover:text-[#c9a96e] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {copied === t.id ? '✓ copied' : 'copy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Interim text */}
            {interimText && (
              <div className="flex gap-3 items-start opacity-60">
                <div className="w-7 h-7 rounded-full bg-[#c9707a]/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-[#c9707a]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-[#3a2e31] rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
                  <p className="text-[#9a8287] text-sm italic leading-relaxed">{interimText}
                    <span className="inline-block w-1 h-4 bg-[#c9707a] ml-1 animate-pulse align-middle" />
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#3a2e31]">
            <button
              onClick={toggleListening}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${listening ? 'bg-[#3a2e31] text-[#9a8287] hover:bg-[#4a3e41]' : 'bg-[#c9707a] text-white hover:bg-[#a84f59]'}`}
            >
              {listening ? 'Stop Listening' : 'Start Listening'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
