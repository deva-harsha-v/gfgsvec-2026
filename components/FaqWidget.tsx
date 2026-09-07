'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { FAQ_TOPICS, findMatchingFaqAnswer, RecruitmentStatusData, FaqTopic } from '@/lib/faq-content';

interface ChatMessage {
  id: string;
  sender: 'gee' | 'user';
  text: string;
  questionTitle?: string;
  timestamp: string;
}

export default function FaqWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<RecruitmentStatusData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'gee',
      text: "Hi! I'm **Gee**, your GFG SVEC assistant. How can I help you today?",
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoadingStatus(true);
    fetch('/api/recruitment-status')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoadingStatus(false);
      })
      .catch((err) => {
        console.error('Error fetching recruitment status for Gee:', err);
        setLoadingStatus(false);
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleTopicClick = (topic: FaqTopic) => {
    const userMsg: ChatMessage = {
      id: Date.now() + '-user',
      sender: 'user',
      text: topic.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const answerText = topic.getAnswer(status);
    const geeMsg: ChatMessage = {
      id: Date.now() + '-gee',
      sender: 'gee',
      text: answerText,
      questionTitle: topic.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, geeMsg]);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now() + '-user',
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const match = findMatchingFaqAnswer(trimmed, status);

    const geeMsg: ChatMessage = {
      id: Date.now() + '-gee',
      sender: 'gee',
      text: match.answer,
      questionTitle: match.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, geeMsg]);
    setInputValue('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[calc(100vw-2rem)] sm:w-96 max-h-[540px] h-[520px] bg-[#141820] border border-[#1e2632] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#0c0e12] border-b border-[#1e2632] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#00b964] to-[#00e575] p-[1.5px] shadow-lg shadow-[#00b964]/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0c0e12] rounded-[14px] flex items-center justify-center">
                  <span className="font-mono text-[#00b964] font-black text-sm tracking-tighter">G</span>
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#00b964] border-2 border-[#0c0e12] rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-bold text-[#f1f5f9]">Gee</h4>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#00b964]/10 text-[#00b964] font-semibold border border-[#00b964]/20">
                    Assistant
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8] flex items-center space-x-1">
                  <span>GFG SVEC FAQ Helper</span>
                  {status?.hasActiveCycle && status?.isOpen && (
                    <span className="inline-flex items-center text-[10px] text-[#00b964] font-medium">
                      • Hiring Active
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl bg-[#1e2632]/50 hover:bg-[#1e2632] text-[#94a3b8] hover:text-[#f1f5f9] flex items-center justify-center transition-colors"
              aria-label="Close FAQ Widget"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Topic Chips */}
          <div className="bg-[#0c0e12]/60 border-b border-[#1e2632]/60 px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {FAQ_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#1e2632]/70 hover:bg-[#00b964]/20 border border-[#1e2632] hover:border-[#00b964]/40 text-[#cbd5e1] hover:text-[#00e575] text-[11px] font-medium transition-all"
              >
                {topic.chipLabel}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00b964] text-[#0c0e12] font-semibold rounded-br-xs'
                      : 'bg-[#1e2632]/80 border border-[#1e2632] text-[#e2e8f0] rounded-bl-xs shadow-sm'
                  }`}
                >
                  {msg.questionTitle && (
                    <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#00b964] mb-1">
                      {msg.questionTitle}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-[#64748b] mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#0c0e12] border-t border-[#1e2632] flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question (e.g. deadline, roles)..."
              className="flex-1 bg-[#141820] border border-[#1e2632] focus:border-[#00b964] rounded-xl px-3.5 py-2 text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-[#00b964] hover:bg-[#00d070] disabled:opacity-40 disabled:hover:bg-[#00b964] text-[#0c0e12] font-bold flex items-center justify-center transition-all shadow-md shadow-[#00b964]/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Circular Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-13 h-13 rounded-full bg-[#00b964] hover:bg-[#00d070] text-[#0c0e12] shadow-xl shadow-[#00b964]/25 border-2 border-[#0c0e12] flex items-center justify-center transition-all duration-300 transform hover:scale-105 group"
        aria-label="Open Gee FAQ Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0c0e12] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0c0e12]" />
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
