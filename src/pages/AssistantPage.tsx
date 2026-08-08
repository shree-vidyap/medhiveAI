import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { startSpeechToText, stopSpeechToText, speakText, stopSpeaking } from '../utils/speech';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  Bot, 
  User, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChat } = useApp();
  const { t, i18n } = useTranslation();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopSpeechToText();
      stopSpeaking();
    };
  }, []);

  const suggestedQuestions = [
    t('assistant.q1', 'Explain my result'),
    t('assistant.q2', 'What should I do next?'),
    t('assistant.q3', 'Find nearby healthcare'),
    t('assistant.q4', 'How do referrals work?'),
  ];

  const handleVoiceToggle = () => {
    if (isListening) {
      stopSpeechToText();
      setIsListening(false);
    } else {
      setIsListening(true);
      const activeLang = i18n.language || 'en';

      startSpeechToText(
        activeLang,
        (text, _isFinal) => {
          setInput((prev) => (prev ? `${prev} ${text}` : text));
        },
        (_err) => {
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleSpeakResponse = (id: string, text: string) => {
    if (activeSpeakingId === id) {
      stopSpeaking();
      setActiveSpeakingId(null);
    } else {
      setActiveSpeakingId(id);
      const activeLang = i18n.language || 'en';
      speakText(text, activeLang, () => setActiveSpeakingId(null));
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (isListening) {
      stopSpeechToText();
      setIsListening(false);
    }

    setInput('');
    setIsTyping(true);

    sendChatMessage(text);

    setTimeout(() => {
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            {t('assistant.title', 'Medihivi AI Assistant')}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {t('assistant.subtitle', 'Instant help with medical reports, symptom evaluation, and facility recommendations')}
          </p>
        </div>

        <button
          onClick={clearChat}
          className="text-xs font-bold text-slate-400 hover:text-slate-200 bg-[#131C1E] px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-3 h-3" />
          <span>{t('assistant.clearChat', 'Clear Chat')}</span>
        </button>
      </div>

      {/* Suggested Question Chips */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>{t('assistant.suggestedTitle', 'Suggested Questions')}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="bg-[#131C1E] hover:bg-slate-800 text-teal-300 hover:text-teal-200 border border-slate-800 hover:border-teal-500/40 text-xs px-3.5 py-2 rounded-xl font-medium transition cursor-pointer"
            >
              💬 "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bento-card p-4 sm:p-6 min-h-[380px] max-h-[500px] overflow-y-auto space-y-4 flex flex-col">
        {chatMessages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const isSpeakingThis = activeSpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? 'self-start' : 'self-end flex-row-reverse'} max-w-[85%]`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAssistant
                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed font-medium space-y-2 relative group ${
                  isAssistant
                    ? 'bg-[#0B0F0E] text-slate-200 border border-slate-800'
                    : 'bg-teal-600 text-slate-950 font-semibold'
                }`}
              >
                <p>{msg.text}</p>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <p
                    className={`text-[9px] font-mono ${
                      isAssistant ? 'text-slate-500' : 'text-teal-950/70'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                  {/* Read Aloud button for Assistant responses */}
                  {isAssistant && (
                    <button
                      type="button"
                      onClick={() => handleSpeakResponse(msg.id, msg.text)}
                      className="text-teal-400 hover:text-teal-200 transition cursor-pointer"
                      title="Read aloud"
                    >
                      {isSpeakingThis ? (
                        <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-teal-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-teal-400 font-medium self-start bg-[#0B0F0E] px-4 py-2 rounded-xl border border-slate-800 animate-pulse">
            <Bot className="w-4 h-4" />
            <span>{t('assistant.typing', 'Medihivi Assistant is typing response...')}</span>
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={`p-3.5 rounded-2xl border text-xs font-bold transition cursor-pointer shrink-0 ${
            isListening
              ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
              : 'bg-[#131C1E] text-teal-300 border-slate-800 hover:border-teal-500/40'
          }`}
          title="Voice input"
        >
          {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-teal-400" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('assistant.placeholder', 'Ask Medihivi Assistant about symptoms, referrals, or health schemes...')}
          className="flex-1 bg-[#131C1E] border border-slate-800 rounded-2xl px-4 py-3.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/80 transition"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-lg shadow-teal-600/20 flex items-center gap-2 cursor-pointer transition shrink-0"
        >
          <span>{t('assistant.send', 'Send')}</span>
          <Send className="w-4 h-4 text-slate-950" />
        </button>
      </form>
    </div>
  );
};
