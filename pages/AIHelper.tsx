import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { generateAIResponse } from '../services/geminiService';
import { I18N } from '../constants';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { OrthodoxLifeLogo } from '../components/OrthodoxLifeLogo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export const AIHelper: React.FC = () => {
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const lang = user?.language || 'en';
  const t = (key: string) => I18N[key][lang] || I18N[key]['en'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await generateAIResponse(userMsg.text, user.language, user.countryTradition);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'ai',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#FAF5F0]">
      {/* Header */}
      <div className="p-4 border-b border-[#DDB892]/20 bg-white/80 backdrop-blur z-10 shadow-sm pt-safe">
        <h1 className="font-serif font-bold text-xl text-[#2E2A27] flex items-center gap-3">
           <OrthodoxLifeLogo size={28} />
           {t('tab_ai')}
        </h1>
        <p className="text-xs text-[#6D645C] mt-1 ml-10 leading-snug opacity-80">{t('ai_disclaimer')}</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#B08968] opacity-50 space-y-4">
             <OrthodoxLifeLogo size={64} />
             <p className="max-w-xs font-serif text-lg">"Ask and it will be given to you; seek and you will find."</p>
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-base font-serif leading-relaxed shadow-sm
              ${msg.sender === 'user' 
                ? 'bg-[#B08968] text-white rounded-br-none' 
                : 'bg-white border border-[#DDB892]/20 text-[#2E2A27] rounded-bl-none'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white border border-[#DDB892]/20 text-[#6D645C] px-5 py-3 rounded-full text-sm font-medium animate-pulse shadow-sm">
               Consulting...
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-[#DDB892]/20 pb-safe">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('type_message')}
            className="flex-1 bg-[#FAF5F0] border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#B08968] outline-none text-[#2E2A27] placeholder:text-[#DDB892]"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#2E2A27] text-white p-4 rounded-2xl disabled:opacity-50 hover:bg-[#4a4440] transition-colors shadow-lg active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};