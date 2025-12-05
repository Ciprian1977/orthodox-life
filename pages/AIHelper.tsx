
import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useI18n } from '../contexts/I18nContext';
import { generateAIResponse } from '../services/geminiService';
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
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col h-[calc(100vh-85px)] bg-bg">
      {/* Header */}
      <div className="p-4 border-b border-border bg-bg/80 backdrop-blur z-10 shadow-sm pt-safe">
        <h1 className="font-serif font-bold text-xl text-text flex items-center gap-3">
           <OrthodoxLifeLogo size={28} className="text-primary" />
           {t('ui.askAi.title')}
        </h1>
        {/* Subtitle specifically requested */}
        <p className="text-sm text-text-muted mt-1 ml-10 leading-snug font-serif italic">{t('ui.askAi.subtitle')}</p>
        <p className="text-xs text-text-muted mt-2 ml-10 leading-snug opacity-80">{t('ui.askAi.disclaimer')}</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-primary opacity-50 space-y-4">
             <OrthodoxLifeLogo size={64} className="text-primary" />
             <p className="max-w-xs font-serif text-lg">"{t('ui.askAi.empty')}"</p>
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} fade-enter`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-base font-serif leading-relaxed shadow-sm
              ${msg.sender === 'user' 
                ? 'bg-primary text-bg rounded-br-none' 
                : 'bg-card border border-border text-text rounded-bl-none'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-card border border-border text-text-muted px-5 py-3 rounded-full text-sm font-medium animate-pulse shadow-sm">
               {t('ui.askAi.consulting')}
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border pb-safe">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ui.askAi.placeholder')}
            className="flex-1 bg-bg border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none text-text placeholder:text-text-muted"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-text text-bg p-4 rounded-2xl disabled:opacity-50 hover:opacity-90 transition-colors shadow-lg active-press"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
