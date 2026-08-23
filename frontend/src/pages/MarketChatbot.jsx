import React, { useState, useRef, useEffect } from 'react';
import { PageWrapper, GlassCard } from '../components/common/UIComponents';
import { api } from '../services/api';

const SUGGESTIONS = [
  "What salary should I expect as a fresher Data Scientist in Bangalore?",
  "Which skills should I learn to become an ML Engineer?",
  "Compare salary of Data Analyst vs Data Scientist in India",
  "Which Indian city pays the most for software engineers?",
  "How do I negotiate my salary as a Data Engineer?",
  "What are the top companies hiring Data Scientists in India?",
];

export function MarketChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm CareerLens AI, your personal job market assistant!\n\nI have access to real data from **115,000+ job postings** across India and globally. Ask me anything about:\n- 💰 Salaries & compensation\n- 🔥 In-demand tech skills\n- 🏢 Top hiring companies\n- 🇮🇳 India market trends",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: res.result || res.error }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the market AI backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="🤖 Job Market AI Chatbot"
      subtitle="Ask anything about compensation, required skills, career transitions, and live market trends."
    >
      <div className="suggested-chips">
        {SUGGESTIONS.map((s, idx) => (
          <button key={idx} className="chip" onClick={() => handleSend(s)}>
            💬 {s}
          </button>
        ))}
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.role}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble assistant">
              <span className="animate-pulse">Analyzing 115,000+ job postings...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          className="chat-input-area"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Ask about salaries, skills, companies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            Send 🚀
          </button>
        </form>
      </div>

      <div className="flex justify-between items-center mt-md">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() =>
            setMessages([
              { role: 'assistant', content: 'Chat cleared! Ask me anything about the job market.' },
            ])
          }
        >
          🗑️ Clear Conversation
        </button>
        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
          Powered by Groq Llama 3.3 70B & 115,000+ Job Records
        </span>
      </div>
    </PageWrapper>
  );
}
