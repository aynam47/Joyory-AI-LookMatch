import { useState, useRef, useEffect } from 'react'
import { Product } from '../types'
import { ProductCard } from '../components/ui/ProductCard'

type Message = {
  id: string
  sender: 'ai' | 'user'
  text?: string
  image?: string // Object URL
  results?: any[]
  attributes?: any
}

export default function AILookMatchPage({ onAddToCart }: { onAddToCart: (id: number) => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi! What beauty product are you looking for? You can describe a look, upload an image, or use the microphone to talk to me.'
    }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const originalInputRef = useRef('')

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice input isn't available in this browser. You can type your request instead.")
      return
    }

    if (isListening) return; // Prevent multiple instances

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true

    recognition.onstart = () => {
      setIsListening(true)
      setError('')
      originalInputRef.current = input // Capture existing input before voice session starts
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = 0; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk
        } else {
          interimTranscript += transcriptChunk
        }
      }

      const newText = originalInputRef.current
        ? `${originalInputRef.current} ${finalTranscript}${interimTranscript}`
        : `${finalTranscript}${interimTranscript}`

      setInput(newText.trim())
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setError("Microphone permission denied.")
      } else if (event.error === 'no-speech') {
        setError("No speech detected. Please try again.")
      } else {
        setError("Couldn't hear that. Please try again.")
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid JPG, PNG, or WEBP image.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.')
      return
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''

    await processInput(undefined, file)
  }

  const handleSendText = () => {
    if (!input.trim() || loading) return
    processInput(input.trim())
  }

  const processInput = async (textMsg?: string, imageFile?: File) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textMsg,
      image: imageFile ? URL.createObjectURL(imageFile) : undefined
    }

    setMessages(prev => [...prev, userMsg])
    if (textMsg) setInput('')
    setLoading(true)
    setError('')

    try {
      let attributes = {}
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)
        const res = await fetch('/api/ai/image', {
          method: 'POST',
          body: formData
        })
        if (!res.ok) throw new Error("Couldn't analyze this image. Try a clearer product image.")
        attributes = await res.json()
      } else if (textMsg) {
        const res = await fetch('/api/ai/product-name', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textMsg })
        })
        if (!res.ok) throw new Error('Failed to analyze text.')
        attributes = await res.json()
      }

      const matchRes = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attributes)
      })

      if (!matchRes.ok) throw new Error('Failed to find matches.')
      const data = await matchRes.json()

      const aiMsg: Message = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: data.matches && data.matches.length > 0
          ? "I found these closest matches for you:"
          : "I couldn't find an exact match for those criteria.",
        results: data.matches || [],
        attributes: imageFile ? attributes : undefined
      }

      setMessages(prev => [...prev, aiMsg])

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong finding matches. Ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-[#faf7f5]">
      <section id="lookmatch" className="py-10 relative">
        {/* Soft background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d47f8a]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#f4d5d8]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/60 text-[#c9707a] text-xs font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-widest backdrop-blur-md border border-[#e8dcd8] shadow-sm">
              <svg className="w-3.5 h-3.5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Joyory AI Beauty Assistant
            </div>
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#241c1e] mb-4">
              Chat with <em className="text-[#c9707a] not-italic">Joyory AI</em>
            </h2>
            <p className="text-[#9a8287] text-lg max-w-xl mx-auto">
              Describe what you need, use your voice, or upload a photo to find the perfect beauty products instantly.
            </p>
          </div>

          {/* Chat Interface */}
          <div className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[700px] relative z-10">

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                  {/* Text Bubble */}
                  {(msg.text || msg.image) && (
                    <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-6 py-4 shadow-sm transition-all ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-[#c9707a] to-[#b85f6a] text-white rounded-br-sm'
                        : 'bg-white text-[#2c2225] border border-[#e8dcd8] rounded-bl-sm'
                      }`}>
                      {msg.image && (
                        <div className="bg-[#faf7f5] p-2 rounded-2xl mb-3 border border-white/20">
                          <img src={msg.image} alt="User upload" className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-sm" />
                        </div>
                      )}
                      {msg.text && <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                    </div>
                  )}

                  {/* Detected Attributes (for images) */}
                  {msg.attributes && (
                    <div className="mt-3 bg-[#faf7f5] border border-[#e8dcd8] rounded-2xl p-5 max-w-[85%] shadow-sm">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#c9707a] mb-3">Detected Image Characteristics</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {Object.entries(msg.attributes).map(([key, value]) => {
                          if (!value || key === 'budget' || (Array.isArray(value) && value.length === 0)) return null;
                          return (
                            <div key={key}>
                               <p className="text-[9px] text-[#9a8287] uppercase font-semibold">{key.replace('_', ' ')}</p>
                              <p className="text-[12px] text-[#2c2225] font-medium capitalize truncate">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Product Results */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                      {msg.results.map((match: any) => (
                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#e8dcd8]">
                            <ProductCard
                            key={match.id}
                            product={match}
                            matchScore={Math.round(match.score)}
                            matchReasons={match.reasons}
                            matchUnmatched={match.unmatched}
                            onAddToCart={onAddToCart}
                            />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-start">
                  <div className="bg-white text-[#9a8287] border border-[#e8dcd8] rounded-3xl rounded-bl-sm px-6 py-4 flex items-center gap-3 shadow-sm">
                    <svg className="w-5 h-5 animate-spin text-[#c9707a]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-[15px] font-medium">Analyzing your request...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-[#fff1f2] border-t border-[#ffe4e6] px-6 py-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Chat Input */}
            <div className="bg-white/80 backdrop-blur-xl border-t border-[#e8dcd8] p-4 md:p-6 flex items-end gap-3 rounded-b-[2.5rem]">

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleImageSelect}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="p-3.5 bg-white text-[#9a8287] hover:text-[#c9707a] hover:bg-[#faf7f5] rounded-full shadow-sm border border-[#e8dcd8] transition-all disabled:opacity-50 flex-shrink-0"
                title="Upload Product Image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              <div className="flex-1 bg-[#faf7f5] border border-[#e8dcd8] rounded-[2rem] flex items-center focus-within:bg-white focus-within:border-[#c9707a] focus-within:shadow-[0_0_0_4px_rgba(201,112,122,0.1)] transition-all overflow-hidden relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendText() }}
                  placeholder="Ask for a 'dewy foundation' or 'classic red lip'..."
                  disabled={loading}
                  className="w-full bg-transparent text-[#2c2225] placeholder:text-[#9a8287] text-[15px] px-6 py-4 focus:outline-none disabled:opacity-50"
                />

                {isListening && (
                  <div className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white px-2 py-1 rounded-full shadow-sm border border-[#ffe4e6]">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-red-500 text-[11px] font-semibold tracking-wide uppercase">Listening</span>
                  </div>
                )}

                <button
                  onClick={handleVoice}
                  disabled={loading}
                  className={`p-2.5 mx-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-50' : 'text-[#9a8287] hover:text-[#c9707a] hover:bg-[#f4ebe9]'
                    } disabled:opacity-50 flex-shrink-0`}
                  title="Use Voice"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleSendText}
                disabled={!input.trim() || loading}
                className="p-4 bg-[#c9707a] text-white rounded-full hover:bg-[#b85f6a] hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed flex-shrink-0"
                title="Send"
              >
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
