import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export function AIChatWidget() {
  const { language } = useAppContext();
  const isBn = language === 'bn';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: input };
    const chatHistory = messages.map(m => ({ role: m.role, text: m.text }));
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history: chatHistory })
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Server error');
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (err: any) {
      console.error("AI Chat error:", err);
      
      // Check if client-side fallback is available via VITE_GEMINI_API_KEY
      const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (clientKey) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: clientKey });
          const formattedHistory = chatHistory.map(m => ({
            role: m.role === 'ai' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));
          const chat = ai.chats.create({
            model: "gemini-3.6-flash",
            config: {
              systemInstruction: "You are a highly helpful and enthusiastic AI fashion assistant for Zopono Tailor. Zopono Tailor is an ultra-luxury, lightning-fast, and premium custom tailoring brand in Bangladesh. You MUST primarily answer in Bengali (বাংলা), though occasional English is fine. Always promote Zopono Tailor's premium quality, perfect fit guarantee, elegant designs, and excellent customer service. Be polite, friendly, and concise. Highlight that we do custom tailoring for Men, Women, and Kids with the finest materials.",
            },
            history: formattedHistory
          });
          const res = await chat.sendMessage({ message: userMessage.text });
          setMessages(prev => [...prev, { role: 'ai', text: res.text }]);
          return;
        } catch (clientErr: any) {
          console.error("Client fallback error:", clientErr);
        }
      }

      const isKeyError = err?.message?.includes('GEMINI_API_KEY') || err?.message?.includes('configured');
      if (isKeyError) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: isBn 
            ? 'Gemini API Key সেট করা নেই। Vercel এ Environment Variable এ GEMINI_API_KEY অথবা VITE_GEMINI_API_KEY যুক্ত করুন।' 
            : 'Gemini API Key is missing. Please add GEMINI_API_KEY or VITE_GEMINI_API_KEY in Vercel Environment Variables.' 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: isBn 
            ? 'দুঃখিত, সংযোগ করতে সমস্যা হচ্ছে। Vercel এ GEMINI_API_KEY যোগ করতে ভুলবেন না।' 
            : 'Sorry, I am having trouble connecting right now. Make sure GEMINI_API_KEY is configured in Vercel.' 
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[84px] right-6 z-50 p-3 bg-[#6A4C6D] text-white rounded-full shadow-lg shadow-[#6A4C6D]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="AI Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[280px] sm:w-[320px] h-[420px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E6E1D8]">
          <div className="bg-gradient-to-r from-[#6A4C6D] to-[#8C6B8F] p-3.5 text-white flex justify-between items-center shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-[#FAF8F5]" />
              </div>
              <span className="font-serif font-bold text-sm tracking-wide">{isBn ? 'এআই সহযোগী' : 'AI Assistant'}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#FAF8F5]/50">
            {messages.length === 0 && (
              <div className="text-center mt-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs border border-[#E6E1D8]">
                  <Bot className="w-6 h-6 text-[#6A4C6D]" />
                </div>
                <div className="text-[#6A4C6D] text-xs font-medium px-4 leading-relaxed">
                  {isBn ? 'আপনার স্টাইলিং বা প্রোডাক্ট সম্পর্কে যেকোনো প্রশ্ন করুন।' : 'Ask me anything about styling, measurements, or our products.'}
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#6A4C6D] text-white rounded-br-sm shadow-sm' : 'bg-white border border-[#E6E1D8] text-slate-700 rounded-bl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-2.5 rounded-2xl bg-white border border-[#E6E1D8] text-slate-700 rounded-bl-sm shadow-sm">
                  <span className="animate-pulse flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#6A4C6D]/40 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-[#6A4C6D]/60 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-[#6A4C6D]/80 rounded-full"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-2.5 bg-white border-t border-[#E6E1D8] flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isBn ? 'মেসেজ লিখুন...' : 'Type a message...'}
              className="flex-1 bg-[#FAF8F5] border border-[#E6E1D8] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#6A4C6D] focus:ring-1 focus:ring-[#6A4C6D] transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#6A4C6D] text-white rounded-full shadow-sm hover:bg-[#583f5b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
