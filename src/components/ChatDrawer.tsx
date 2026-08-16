import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  ShoppingBag, 
  Bot, 
  User, 
  ArrowLeft, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ChatThread } from '../types';

export default function ChatDrawer() {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    threads, 
    activeThreadId, 
    setActiveThreadId, 
    messages, 
    sendMessage, 
    markThreadAsRead, 
    deleteThread,
    formatPrice,
    contactInfo
  } = useStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showThreadListMobile, setShowThreadListMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const activeMessages = activeThread ? (messages[activeThread.id] || []) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [isChatOpen, activeMessages.length, activeThreadId]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending || !activeThread) return;

    const text = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      await sendMessage(activeThread.id, text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!activeThread) return;
    sendMessage(activeThread.id, prompt);
  };

  const selectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    markThreadAsRead(threadId);
    setShowThreadListMobile(false);
  };

  if (!isChatOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsChatOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full border-l border-brand-primary/10"
          >
            {/* Top Navigation Bar */}
            <div className="bg-brand-primary text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                {/* Mobile Back to Threads */}
                {activeThread && (
                  <button
                    onClick={() => setShowThreadListMobile(true)}
                    className="md:hidden p-1 text-white/80 hover:text-white"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center font-bold">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-wide flex items-center space-x-1.5">
                      <span>KamerStyle Messaging</span>
                      <span className="text-[9px] bg-green-500/20 text-green-300 px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                        Live
                      </span>
                    </h3>
                    <p className="text-[10px] text-brand-bg/70">
                      In-App Chat & Gemini AI Fashion Support
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  title="Close Chat"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Chat Layout: Split Pane (Threads List | Active Conversation) */}
            <div className="flex-1 flex overflow-hidden bg-brand-bg/30">
              {/* Left Column: Threads List (hidden on mobile when viewing active thread) */}
              <div className={`w-full md:w-64 border-r border-brand-primary/10 bg-white flex flex-col ${
                showThreadListMobile ? 'block' : 'hidden md:flex'
              }`}>
                <div className="p-3 border-b border-brand-primary/10 bg-brand-bg/50">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-primary/60">
                    Conversations ({threads.length})
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-brand-primary/5">
                  {threads.map((thread) => {
                    const isSelected = activeThreadId === thread.id;
                    const isAi = thread.type === 'ai_support';
                    const isAdmin = thread.type === 'admin_support';

                    return (
                      <button
                        key={thread.id}
                        onClick={() => selectThread(thread.id)}
                        className={`w-full text-left p-3.5 flex items-start space-x-3 transition-colors cursor-pointer relative ${
                          isSelected ? 'bg-brand-accent/15 border-l-4 border-brand-primary' : 'hover:bg-brand-bg/60'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          {isAi ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-brand-primary flex items-center justify-center shadow-xs">
                              <Sparkles size={18} />
                            </div>
                          ) : isAdmin ? (
                            <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-serif font-bold">
                              ST
                            </div>
                          ) : thread.productImage ? (
                            <img
                              src={thread.productImage}
                              alt={thread.participantName}
                              className="w-10 h-10 rounded-full object-cover border border-brand-primary/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                              {thread.participantName.charAt(0)}
                            </div>
                          )}

                          {thread.unreadCount && thread.unreadCount > 0 ? (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                              {thread.unreadCount}
                            </span>
                          ) : null}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="text-xs font-bold text-brand-primary truncate">
                              {thread.participantName}
                            </h4>
                            <span className="text-[9px] text-brand-primary/40 flex-shrink-0 ml-1">
                              {thread.lastTimestamp || 'Active'}
                            </span>
                          </div>

                          {thread.productName && (
                            <span className="text-[10px] text-brand-accent font-semibold truncate block">
                              👗 {thread.productName}
                            </span>
                          )}

                          <p className="text-[11px] text-brand-primary/60 truncate">
                            {thread.lastMessage || 'No messages yet'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Concierge Shortcut */}
                <div className="p-3 bg-brand-bg/80 border-t border-brand-primary/10">
                  <button
                    onClick={() => selectThread('thread_ai_support')}
                    className="w-full bg-brand-primary text-brand-bg py-2 px-3 rounded-lg text-[11px] uppercase tracking-wider font-bold hover:bg-brand-accent hover:text-brand-primary transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Ask AI Concierge</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Active Conversation (hidden on mobile if thread list is active) */}
              <div className={`flex-1 flex flex-col bg-white ${
                showThreadListMobile ? 'hidden md:flex' : 'flex'
              }`}>
                {activeThread ? (
                  <>
                    {/* Active Thread Header */}
                    <div className="p-3.5 border-b border-brand-primary/10 bg-brand-bg/40 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        {activeThread.type === 'ai_support' ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-brand-primary flex items-center justify-center shadow-xs">
                            <Sparkles size={20} />
                          </div>
                        ) : activeThread.type === 'admin_support' ? (
                          <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-serif font-bold text-sm">
                            ST
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-sm">
                            {activeThread.participantName.charAt(0)}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="font-bold text-xs text-brand-primary">
                              {activeThread.participantName}
                            </h3>
                            {activeThread.type === 'ai_support' ? (
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                                Gemini AI
                              </span>
                            ) : (
                              <span className="text-[9px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-bold flex items-center">
                                <ShieldCheck size={10} className="mr-0.5" /> Verified
                              </span>
                            )}
                          </div>

                          <p className="text-[10px] text-brand-primary/60">
                            {activeThread.type === 'ai_support'
                              ? 'Instant Cameroonian Dressing & Platform Assistant'
                              : activeThread.participantLocation || 'Cameroon Designer'}
                          </p>
                        </div>
                      </div>

                      {/* Direct WhatsApp / Call Shortcut if Seller or Admin */}
                      <div className="flex items-center space-x-2">
                        {activeThread.participantPhone && (
                          <a
                            href={`https://wa.me/${activeThread.participantPhone.replace(/[^0-9]/g, '')}?text=Hello!%20I%20am%20chatting%20with%20you%20on%20KamerStyle.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                            title="Continue to WhatsApp"
                          >
                            <MessageCircle size={14} className="fill-current" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </a>
                        )}

                        {activeThread.id !== 'thread_ai_support' && activeThread.id !== 'thread_admin_support' && (
                          <button
                            onClick={() => deleteThread(activeThread.id)}
                            className="p-2 text-brand-primary/40 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete thread"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Attached Product Snapshot Banner (if applicable) */}
                    {activeThread.productName && activeThread.productImage && (
                      <div className="p-2.5 bg-brand-primary/5 border-b border-brand-primary/10 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={activeThread.productImage}
                            alt={activeThread.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-brand-primary/10"
                          />
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-brand-primary/50 block">Inquiring About:</span>
                            <h5 className="font-serif font-bold text-xs text-brand-primary truncate max-w-[220px]">
                              {activeThread.productName}
                            </h5>
                          </div>
                        </div>
                        {activeThread.productPrice && (
                          <span className="text-xs font-serif font-bold text-brand-primary px-2 py-1 bg-white rounded border border-brand-primary/10">
                            {formatPrice(activeThread.productPrice)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Stream */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-bg/20">
                      {activeMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-brand-primary/50">
                          <MessageCircle size={32} className="opacity-30" />
                          <p className="text-xs">Start a conversation with {activeThread.participantName}.</p>
                        </div>
                      ) : (
                        activeMessages.map((msg) => {
                          const isUser = msg.senderRole === 'buyer';
                          const isAi = msg.senderRole === 'ai';

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                            >
                              <div className="flex items-center space-x-1.5 mb-1 px-1">
                                <span className="text-[10px] font-bold text-brand-primary/60">
                                  {isUser ? 'You' : msg.senderName}
                                </span>
                                <span className="text-[9px] text-brand-primary/40">
                                  {msg.timestamp}
                                </span>
                              </div>

                              <div
                                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                                  isUser
                                    ? 'bg-brand-primary text-white rounded-br-xs'
                                    : isAi
                                    ? 'bg-white border border-amber-200 text-brand-primary rounded-bl-xs'
                                    : 'bg-white border border-brand-primary/10 text-brand-primary rounded-bl-xs'
                                }`}
                              >
                                {isAi && (
                                  <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-700 mb-1 border-b border-amber-100 pb-1">
                                    <Sparkles size={11} />
                                    <span>KamerStyle AI Concierge</span>
                                  </div>
                                )}

                                <p className="whitespace-pre-line">{msg.text}</p>
                              </div>
                            </div>
                          );
                        })
                      )}

                      {isSending && (
                        <div className="flex items-center space-x-2 text-xs text-brand-primary/60 italic p-2">
                          <Sparkles size={14} className="animate-spin text-amber-500" />
                          <span>Typing response...</span>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="px-3 pt-2 pb-1 bg-white border-t border-brand-primary/10 flex space-x-2 overflow-x-auto no-scrollbar">
                      {activeThread.type === 'ai_support' ? (
                        <>
                          <button
                            onClick={() => handleQuickPrompt("How do I order authentic Bamenda Toghu?")}
                            className="whitespace-nowrap bg-brand-bg hover:bg-brand-accent/20 text-brand-primary px-2.5 py-1 rounded-full text-[10px] font-semibold border border-brand-primary/10 transition-colors cursor-pointer"
                          >
                            👑 Toghu Ordering
                          </button>
                          <button
                            onClick={() => handleQuickPrompt("What are the nationwide delivery options across Cameroon?")}
                            className="whitespace-nowrap bg-brand-bg hover:bg-brand-accent/20 text-brand-primary px-2.5 py-1 rounded-full text-[10px] font-semibold border border-brand-primary/10 transition-colors cursor-pointer"
                          >
                            🚚 Cameroon Delivery
                          </button>
                          <button
                            onClick={() => handleQuickPrompt("How does MTN MoMo and Orange Money Escrow protection work?")}
                            className="whitespace-nowrap bg-brand-bg hover:bg-brand-accent/20 text-brand-primary px-2.5 py-1 rounded-full text-[10px] font-semibold border border-brand-primary/10 transition-colors cursor-pointer"
                          >
                            🛡️ Escrow Protection
                          </button>
                          <button
                            onClick={() => handleQuickPrompt("How can I list my own clothes or accessories to sell on KamerStyle?")}
                            className="whitespace-nowrap bg-brand-bg hover:bg-brand-accent/20 text-brand-primary px-2.5 py-1 rounded-full text-[10px] font-semibold border border-brand-primary/10 transition-colors cursor-pointer"
                          >
                            👗 Selling Guide
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleQuickPrompt("Hello! Is this dressing currently available?")}
                            className="whitespace-nowrap bg-brand-bg hover:bg-brand-accent/20 text-brand-primary px-2.5 py-1 rounded-full text-[10px] font-semibold border border-brand-primary/10 transition-colors cursor-pointer"
                          >
                            ✨ Check Availability
                          </button>
                          <button
                            onClick={() => handleQuickPrompt("Can you tailor this to my custom measurements?")}
                            className="whitespace-nowrap bg-brand-bg hover:bg-brand-accent/20 text-brand-primary px-2.5 py-1 rounded-full text-[10px] font-semibold border border-brand-primary/10 transition-colors cursor-pointer"
                          >
                            ✂️ Custom Sizing
                          </button>
                          <button
                            onClick={() => handleQuickPrompt("What is the fastest delivery time to Douala / Yaoundé?")}
                            className="whitespace-nowrap bg-brand-bg hover:bg-brand-accent/20 text-brand-primary px-2.5 py-1 rounded-full text-[10px] font-semibold border border-brand-primary/10 transition-colors cursor-pointer"
                          >
                            📦 Courier Dispatch
                          </button>
                        </>
                      )}
                    </div>

                    {/* Chat Input Bar */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-brand-primary/10 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`Type a message to ${activeThread.participantName}...`}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        className="flex-1 bg-brand-bg/60 border border-brand-primary/15 rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none focus:border-brand-accent"
                      />

                      <button
                        type="submit"
                        disabled={!inputMessage.trim() || isSending}
                        className="bg-brand-primary disabled:opacity-40 text-brand-bg p-2.5 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all cursor-pointer flex-shrink-0"
                        title="Send Message"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-brand-primary/60">
                    <MessageCircle size={36} className="mb-2 opacity-40" />
                    <p className="text-sm">Select a conversation or ask AI Support.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
