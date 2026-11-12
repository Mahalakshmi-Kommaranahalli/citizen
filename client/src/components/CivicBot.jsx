import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function CivicBot({ onOpenGrievance, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Namaste! I am NagarSeva Mitra, your 24/7 AI Civic Assistant. How may I assist you today?",
      options: [
        "🔍 Track a Grievance",
        "🚨 Report an Emergency Hazard",
        "⏱️ View Municipal SLA Timelines",
        "📋 How to file a complaint?"
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || input.trim();
    if (!text) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI Intent Recognition & Response logic
    setTimeout(async () => {
      let botResponse = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const lower = text.toLowerCase();

      // Check if user is asking to track a token (e.g. GRV-2026-XXXX)
      const tokenMatch = text.match(/GRV-\d{4}-\d{4}/i);
      if (tokenMatch) {
        const token = tokenMatch[0].toUpperCase();
        try {
          const res = await api.getGrievanceByToken(token);
          if (res.success && res.data) {
            const g = res.data;
            botResponse.text = `Found your grievance: "${g.title}" (${g.trackingToken}).`;
            botResponse.card = {
              type: 'grievance',
              data: g
            };
          } else {
            botResponse.text = `I searched the civic database for token ${token}, but could not locate it. Please verify your token number.`;
          }
        } catch (e) {
          botResponse.text = `Could not find grievance with token ${token}. Please check for typos.`;
        }
      } else if (lower.includes('track') || lower.includes('status')) {
        botResponse.text = "To track any complaint, simply type your Tracking Token (e.g. `GRV-2026-8910` or `GRV-2026-9204`) or paste it here.";
        botResponse.options = ["Track GRV-2026-8910", "Track GRV-2026-9204", "Track GRV-2026-6411"];
      } else if (lower.includes('sla') || lower.includes('timeline') || lower.includes('deadline') || lower.includes('how long')) {
        botResponse.text = "Here is our legally-binding Municipal SLA Redressal Charter:\n\n• 🚨 Critical Emergencies (Open Manhole, Live Wire, Water Main Burst): 4 to 12 Hours\n• ⚠️ High Priority (Potholes, Sewage Overflow, Blackouts): 24 to 48 Hours\n• 🧹 Standard Issues (Garbage Dumps, Street Cleaning): 24 to 72 Hours\n\nAny grievance exceeding 100% of its SLA automatically escalates to the Zonal Commissioner.";
        botResponse.options = ["🚨 Report an Emergency Hazard", "📋 File a Grievance Now"];
      } else if (lower.includes('emergency') || lower.includes('danger') || lower.includes('live wire') || lower.includes('manhole')) {
        botResponse.text = "⚠️ Emergency Safety Hazard Protocol Activated! Critical complaints receive priority 4-12 hour resolution with automatic dispatch alerts to the Zonal Commissioner.";
        botResponse.options = ["Open Grievance Form", "Call Toll-Free Helpline: 1800-NAGAR-SEVA"];
      } else if (lower.includes('file') || lower.includes('lodge') || lower.includes('complain') || lower.includes('report')) {
        botResponse.text = "You can lodge a complaint in 30 seconds using the 'Lodge New Grievance' tab above! You can drop a pin on our interactive city map, upload photo evidence, or report anonymously.";
        botResponse.options = ["View Municipal Map", "Track a Grievance"];
      } else {
        botResponse.text = `Thank you for contacting NagarSeva. I can help you lodge a complaint, track any active token, or review municipal SLA commitments. How can I help you?`;
        botResponse.options = [
          "🔍 Track GRV-2026-8910",
          "⏱️ Municipal SLA Timelines",
          "🚨 Emergency Hazard Protocol"
        ];
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center group"
        title="Chat with NagarSeva Civic AI Assistant"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in font-sans">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <span>NagarSeva Mitra</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                </h3>
                <p className="text-[10px] text-emerald-100/80">
                  AI Civic Concierge & SLA Tracker
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-emerald-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] space-y-2`}>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Grievance Card Embed */}
                  {msg.card?.type === 'grievance' && (
                    <div className="p-3 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-xl shadow-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-mono font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {msg.card.data.trackingToken}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase text-[9px]">
                          {msg.card.data.priority}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">
                        {msg.card.data.title}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {msg.card.data.departmentName} • {msg.card.data.wardName.split(' - ')[0]}
                      </p>
                      <button
                        onClick={() => {
                          onOpenGrievance(msg.card.data);
                          setIsOpen(false);
                        }}
                        className="mt-1 w-full py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <span>View Full Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Interactive Option Chips */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(opt)}
                          className="px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300 text-[11px] font-medium transition-colors text-slate-700 dark:text-slate-300"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px]">Mitra is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything or enter tracking token..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
