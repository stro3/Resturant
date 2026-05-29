'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => 'SESS-' + Math.random().toString(36).substr(2, 9));
  const [name, setName] = useState('Guest');
  const [started, setStarted] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setName(JSON.parse(user).name || 'Guest');
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (overrideMsg?: string) => {
    const msg = (overrideMsg || input).trim();
    if (!msg || sending) return;
    setInput('');
    setSending(true);
    setMessages(prev => [...prev, { sender: 'customer', name, message: msg, created_at: new Date().toISOString() }]);

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, sender: 'customer', name, message: msg })
      });
      if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
      const data = await res.json();
      if (data.bot_reply) {
        setMessages(prev => [...prev, data.bot_reply]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        sender: 'support', name: 'System',
        message: 'Sorry, something went wrong. Please try again.',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50">
        {open ? <FiX className="text-xl" /> : <FiMessageSquare className="text-xl" />}
        {!open && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100"
            style={{ maxHeight: '500px' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <FiMessageSquare className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Gastronome Support</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-300 rounded-full" />
                    <span className="text-white/80 text-xs">Online now</span>
                  </div>
                </div>
              </div>
            </div>

            {!started ? (
              /* Start Screen */
              <div className="p-6 text-center">
                <p className="text-gray-800 font-medium mb-2">Welcome to Gastronome!</p>
                <p className="text-gray-500 text-sm mb-4">Ask about our menu, hours, reservations, or anything else.</p>
                <button onClick={() => { setStarted(true); setMessages([]); }}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium">
                  Start Chat
                </button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm mt-8">
                      <p>Say hello to get started!</p>
                      <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        {['What are your hours?', 'Show me the menu', 'Book a table'].map(q => (
                          <button key={q} onClick={() => sendMessage(q)}
                            className="px-3 py-1.5 bg-white text-gray-600 text-xs rounded-full border hover:bg-amber-50 hover:border-amber-300">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((msg: any, i: number) => (
                    <div key={i} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender === 'customer'
                          ? 'bg-amber-500 text-white rounded-br-md'
                          : 'bg-white text-gray-800 shadow-sm rounded-bl-md border'
                      }`}>
                        {msg.sender !== 'customer' && (
                          <p className="text-xs text-amber-600 font-medium mb-0.5">{msg.name}</p>
                        )}
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white">
                  <div className="flex gap-2">
                    <input value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 text-gray-800 disabled:opacity-50" />
                    <button onClick={() => sendMessage()} disabled={sending}
                      className="w-10 h-10 bg-amber-500 text-white rounded-xl hover:bg-amber-600 flex items-center justify-center flex-shrink-0 disabled:opacity-50">
                      {sending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSend />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
