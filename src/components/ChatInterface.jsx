import { useState, useRef, useEffect } from 'react';
import MessageBubble from './Chat/MessageBubble';
import ChatInput from './Chat/ChatInput';
import SuggestionCards from './Chat/SuggestionCards';
import { sendMessageToBackend } from '../services/gemini';
import { motion } from 'framer-motion';
import { Sparkles, Bot, ExternalLink } from 'lucide-react';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { role: 'model', content: "👋 Hi! I'm **Molindu's AI Assistant**. I can tell you about my projects, technical skills, and experience in **Machine Learning** and **Computer Vision**.\n\nTry asking:\n- \"Show me your Computer Vision projects\"\n- \"What deep learning frameworks do you use?\"\n- \"Tell me about your medical imaging work\"" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const { text: responseText, suggestions, videos } = await sendMessageToBackend(text, messages);

            setMessages(prev => [...prev, {
                role: 'model',
                content: responseText,
                suggestions: suggestions,
                videos: videos
            }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "⚠️ Sorry, I encountered an error. Please ensure the backend is running." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent text-gray-100">
            {/* Header - Responsive */}
            <header className="flex-shrink-0 border-b border-gray-800/30 bg-transparent sticky top-0 z-50 safe-area-top">
                <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles size={16} className="text-white sm:hidden" />
                            <Sparkles size={18} className="text-white hidden sm:block" />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-semibold tracking-tight">
                                Molindu<span className="text-violet-400">.ai</span>
                            </h1>
                            <p className="text-[10px] sm:text-xs text-gray-500">Portfolio Assistant</p>
                        </div>
                    </a>

                    {/* Classic Portfolio Link */}
                    <a
                        href="https://molindu-achintha.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 transition-all text-xs sm:text-sm text-gray-300 hover:text-white"
                    >
                        <span className="hidden sm:inline">Classic View</span>
                        <span className="sm:hidden">Portfolio</span>
                        <ExternalLink size={14} />
                    </a>
                </div>
            </header>

            {/* Messages Area - Scrollable */}
            <main className="flex-1 overflow-y-auto overscroll-contain">
                <div className="min-h-full pb-4">
                    {messages.map((msg, idx) => (
                        <MessageBubble key={idx} message={msg} onSuggestionClick={handleSend} />
                    ))}

                    {messages.length === 1 && !isTyping && (
                        <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-4 sm:pb-8">
                            <SuggestionCards onSelect={handleSend} />
                        </div>
                    )}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full py-4 sm:py-6 bg-transparent"
                        >
                            <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6">
                                <div className="flex gap-3 sm:gap-6">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded mt-1 bg-teal-600/20 flex items-center justify-center text-teal-400">
                                        <Bot size={14} className="sm:hidden" />
                                        <Bot size={16} className="hidden sm:block" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] sm:text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Assistant</div>
                                        <div className="text-teal-400 font-mono text-sm">
                                            <span className="animate-pulse">▋</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area - Fixed at bottom */}
            <footer className="flex-shrink-0 border-t border-gray-800/30 bg-[#0a0a0f]/80 backdrop-blur-sm safe-area-bottom">
                <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <ChatInput onSend={handleSend} disabled={isTyping} />
                </div>
            </footer>
        </div>
    );
};

export default ChatInterface;
