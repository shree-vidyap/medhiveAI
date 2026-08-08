import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { sendChatMessage } from '../services/api';
import { Bot, MessageSquare, Mic, MicOff, Send, Sparkles, Volume2, X } from 'lucide-react';

interface RuralCareAssistantChatbotProps {
  currentLanguage: Language;
}

export const RuralCareAssistantChatbot: React.FC<RuralCareAssistantChatbotProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text:
        currentLanguage === 'kn'
          ? 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಮೆಡಿಹಿವಿ ಎಐ ಸಹಾಯಕ. ಆರೋಗ್ಯ ತಪಾಸಣೆ, ಆಸ್ಪತ್ರೆ ರೆಫರಲ್ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಏನು ತಿಳಿಯಬೇಕು?'
          : currentLanguage === 'hi'
          ? 'नमस्ते! मैं मेडीहिवी एआई सहायक हूँ। स्वास्थ्य जांच, अस्पताल रेफरल या सरकारी योजनाओं के बारे में आप क्या जानना चाहते हैं?'
          : 'Hello! I am your MediHivi AI Assistant. How can I assist you with triage, hospital referrals, or healthcare schemes today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await sendChatMessage(userMsg.text, messages, currentLanguage);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'kn' ? 'kn-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="ruralcare-chatbot-wrapper" className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 transition transform hover:scale-105 border border-teal-500/40 cursor-pointer"
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="text-xs font-extrabold">{t.assistantChat}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
        </button>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl w-[360px] sm:w-[400px] h-[520px] shadow-2xl flex flex-col justify-between overflow-hidden text-slate-900 animate-scale-up">
          {/* Header */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl border border-teal-200">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                  MediHivi Assistant
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Multi-Lingual Healthcare AI Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-xs ${
                    msg.sender === 'user'
                      ? 'bg-teal-600 text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleSpeechSpeak(msg.text)}
                      className="mt-2 text-[10px] text-teal-700 font-bold hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Voice</span>
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 font-medium">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                <Bot className="w-4 h-4 animate-spin text-teal-600" />
                <span>MediHivi AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Suggestions */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-600 whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setInputText('Nearest PHC facility?')}
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              Nearest PHC?
            </button>
            <button
              onClick={() => setInputText('How to apply for Ayushman Bharat?')}
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              Ayushman Bharat scheme?
            </button>
            <button
              onClick={() => setInputText('Request 108 Emergency ambulance')}
              className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              Request 108 Ambulance
            </button>
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask MediHivi Assistant..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
