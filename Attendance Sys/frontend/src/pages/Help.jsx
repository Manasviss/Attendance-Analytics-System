import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processMessage } from '../utils/chatLogic';

const FloatingShape = ({ type, color, size, top, left, delay, duration }) => {
    const variants = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            transition: {
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }
        }
    };

    const shapes = {
        circle: <circle cx="50" cy="50" r="40" />,
        triangle: <polygon points="50,15 90,85 10,85" />,
        square: <rect x="15" y="15" width="70" height="70" rx="10" />,
        cross: <path d="M 35 35 L 35 15 L 65 15 L 65 35 L 85 35 L 85 65 L 65 65 L 65 85 L 35 85 L 35 65 L 15 65 L 15 35 Z" />,
        squiggle: <path d="M 10 50 Q 25 20 50 50 T 90 50" fill="none" strokeWidth="12" strokeLinecap="round" />
    };

    return (
        <motion.div
            variants={variants}
            animate="animate"
            className={`absolute z-0 opacity-20 pointer-events-none ${color}`}
            style={{ top, left, width: size, height: size }}
        >
            <svg viewBox="0 0 100 100" fill="currentColor" stroke="currentColor" strokeWidth={type === 'squiggle' ? '0' : '0'}>
                {shapes[type]}
            </svg>
        </motion.div>
    );
};

const Help = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', text: 'Hi there! I am your Assistant. How can I help you today?' }
    ]);

    const faqs = [
        {
            question: "How do I mark attendance?",
            answer: "Go to the Dashboard or Attendance Sheet page. Select the class and subject, then mark students as Present or Absent."
        },
        {
            question: "How can I apply for leave?",
            answer: "Navigate to the 'Leave Application' page from the sidebar. Fill out the form with the reason and dates, then submit."
        },
        {
            question: "Where can I see my attendance reports?",
            answer: "Click on 'Reports' in the sidebar. You can view detailed attendance statistics and download reports."
        },
        {
            question: "How do I switch the color theme?",
            answer: "Look for the theme toggle button (sun/moon icon) in the sidebar. Clicking it switches between different color modes like Light, Dark (Soft Paper), and others."
        },
        {
            question: "Can I view the class timetable?",
            answer: "Yes, navigate to the 'Timetable' section to see the weekly schedule of classes and labs."
        },
        {
            question: "How do I check recent announcements?",
            answer: "Go to the 'Announcements' page. You can drag the timeline to explore different events, and hover over the dots to see them magnify."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const userMsg = chatMessage;
        setChatHistory([...chatHistory, { sender: 'user', text: userMsg }]);
        setChatMessage('');

        // Simulate typing delay and bot response
        setTimeout(() => {
            const botResponse = processMessage(userMsg);
            setChatHistory(prev => [...prev, { sender: 'bot', text: botResponse }]);
        }, 1000);
    };

    // Enhanced configuration with more items for a denser, livelier background
    const backgroundShapes = [
        // Original set
        { type: 'circle', color: 'text-blue-400', size: '120px', top: '5%', left: '5%', delay: 0, duration: 6 },
        { type: 'triangle', color: 'text-yellow-400', size: '80px', top: '15%', left: '85%', delay: 2, duration: 7 },
        { type: 'square', color: 'text-green-400', size: '60px', top: '45%', left: '10%', delay: 1, duration: 8 },
        { type: 'cross', color: 'text-red-400', size: '50px', top: '60%', left: '90%', delay: 3, duration: 5 },
        { type: 'squiggle', color: 'text-blue-300', size: '100px', top: '80%', left: '20%', delay: 1.5, duration: 6 },
        { type: 'circle', color: 'text-yellow-200', size: '40px', top: '10%', left: '50%', delay: 4, duration: 9 },
        { type: 'triangle', color: 'text-red-300', size: '90px', top: '75%', left: '55%', delay: 0.5, duration: 7 },
        { type: 'square', color: 'text-green-200', size: '70px', top: '30%', left: '75%', delay: 2.5, duration: 6 },

        // NEW items for more density and "Google-like" clutter
        { type: 'circle', color: 'text-red-100', size: '180px', top: '25%', left: '-5%', delay: 1, duration: 12 }, // Large subtle blob
        { type: 'cross', color: 'text-blue-200', size: '40px', top: '5%', left: '30%', delay: 5, duration: 4 },
        { type: 'squiggle', color: 'text-green-300', size: '80px', top: '90%', left: '80%', delay: 2, duration: 8 },
        { type: 'triangle', color: 'text-yellow-100', size: '140px', top: '40%', left: '95%', delay: 3, duration: 10 }, // Large subtle blob
        { type: 'square', color: 'text-blue-500', size: '20px', top: '12%', left: '60%', delay: 0.2, duration: 3 }, // Tiny particle
        { type: 'circle', color: 'text-red-400', size: '15px', top: '85%', left: '10%', delay: 1.2, duration: 4 }, // Tiny particle
        { type: 'cross', color: 'text-green-500', size: '35px', top: '35%', left: '20%', delay: 2.8, duration: 5 },
        { type: 'triangle', color: 'text-yellow-500', size: '25px', top: '65%', left: '40%', delay: 4, duration: 6 },
        { type: 'squiggle', color: 'text-red-200', size: '60px', top: '5%', left: '70%', delay: 1, duration: 7 },
        { type: 'square', color: 'text-blue-200', size: '90px', top: '95%', left: '40%', delay: 3, duration: 8 },
        { type: 'circle', color: 'text-green-100', size: '200px', top: '-10%', left: '40%', delay: 0, duration: 15 }, // Giant top blob
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-50/50">
            {/* Subtle Dot Grid Pattern for Texture */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Lively Animated Background Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {backgroundShapes.map((shape, i) => (
                    <FloatingShape key={i} {...shape} />
                ))}
            </div>

            <div className="p-6 max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl mb-12 relative border border-white/50"
                >
                    <div className="bg-google-blue p-8 text-white flex items-center justify-between relative overflow-hidden rounded-t-3xl">
                        <div className="relative z-10 w-full md:w-2/3">
                            <h1 className="text-4xl font-bold mb-3 tracking-tight">How can we help?</h1>
                            <p className="text-blue-100 mb-8 text-lg">Search for help, browse FAQs, or contact support.</p>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Describe your issue..."
                                    className="w-full p-4 pl-6 rounded-full text-gray-800 focus:outline-none shadow-lg transition-shadow group-hover:shadow-xl"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="absolute right-2 top-2 p-2 bg-blue-600 rounded-full text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        {/* Header Abstract Decor */}
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-10 transform skew-x-12 translate-x-20"></div>
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                        <div className="absolute -left-10 -top-20 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid gap-4">
                            {filteredFaqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300"
                                >
                                    <button
                                        className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    >
                                        <span className="font-semibold text-gray-700 text-lg">{faq.question}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-blue-100' : ''}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-5 pt-0 text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Email Support', icon: 'mail', color: 'blue', desc: 'Get in touch with our team' },
                        { title: 'Live Chat', icon: 'chat', color: 'green', desc: 'Chat with us instantly' },
                        { title: 'Documentation', icon: 'book', color: 'yellow', desc: 'Read detailed guides' }
                    ].map((item, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (item.icon === 'mail') setShowContactModal(true);
                                if (item.icon === 'chat') setShowChat(true);
                                if (item.icon === 'book') alert("Redirecting...");
                            }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-all"
                        >
                            <div className={`w-14 h-14 rounded-full bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center mb-4 text-2xl`}>
                                {item.icon === 'mail' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                                {item.icon === 'chat' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>}
                                {item.icon === 'book' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Contact Modal & Chat Widget (Preserved functionality) */}
            <AnimatePresence>
                {showContactModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-google-blue p-6 text-white flex justify-between items-center">
                                <h2 className="text-xl font-bold">Contact Support</h2>
                                <button onClick={() => setShowContactModal(false)} className="text-white hover:bg-white/20 rounded-full p-1 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form className="p-8 space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); setShowContactModal(false); }}>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                    <input type="text" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="How can we help?" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                    <textarea rows="4" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="Describe your issue..."></textarea>
                                </div>
                                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all">Send Message</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col"
                        style={{ height: '450px' }}
                    >
                        <div className="bg-google-green p-4 text-white flex justify-between items-center shadow-md z-10">
                            <div className="flex items-center space-x-3">
                                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-sm"></div>
                                <span className="font-bold tracking-wide">Assistant</span>
                            </div>
                            <button onClick={() => setShowChat(false)} className="text-white hover:bg-white/20 rounded-full p-1 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                className="flex-1 p-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400"
                                placeholder="Type a message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                            />
                            <button type="submit" className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-md transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Help;
