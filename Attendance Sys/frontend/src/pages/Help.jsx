import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processMessage } from '../utils/chatLogic';

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
            question: "How do I register my face for attendance?",
            answer: "Go to the 'Face Attendance' page. Follow the instructions to capture your face data for automated attendance."
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

    return (
        <div className="p-6 max-w-4xl mx-auto relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            >
                <div className="bg-google-blue p-8 text-white flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10 w-2/3">
                        <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
                        <p className="text-blue-100 mb-6">Search for answers or browse our frequently asked questions.</p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                className="w-full p-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-google-yellow shadow-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute right-4 top-4 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-google-yellow opacity-10 transform skew-x-12 translate-x-10"></div>
                    <div className="absolute right-20 bottom-0 h-32 w-32 bg-google-red opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute right-10 top-10 h-16 w-16 bg-google-green opacity-20 rounded-full blur-lg"></div>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {filteredFaqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <span className="font-medium text-gray-700">{faq.question}</span>
                                    <span className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <div className="p-4 bg-white text-gray-600 border-t border-gray-200 animate-fadeIn">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-md border-t-4 border-google-blue text-center cursor-pointer"
                    onClick={() => setShowContactModal(true)}
                >
                    <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 text-google-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
                    <p className="text-sm text-gray-500 mb-4">Get in touch with our support team.</p>
                    <button className="text-google-blue font-medium hover:underline">Contact Us</button>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-md border-t-4 border-google-green text-center cursor-pointer"
                    onClick={() => setShowChat(true)}
                >
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 text-google-green">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-500 mb-4">Chat with us for instant help.</p>
                    <button className="text-google-green font-medium hover:underline">Start Chat</button>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-md border-t-4 border-google-yellow text-center cursor-pointer"
                    onClick={() => alert("Redirecting to documentation portal...")}
                >
                    <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-google-yellow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Documentation</h3>
                    <p className="text-sm text-gray-500 mb-4">Read detailed guides and docs.</p>
                    <button className="text-google-yellow font-medium hover:underline">View Docs</button>
                </motion.div>
            </div>

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-google-blue p-6 text-white flex justify-between items-center">
                                <h2 className="text-xl font-bold">Contact Support</h2>
                                <button onClick={() => setShowContactModal(false)} className="text-white hover:text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); setShowContactModal(false); }}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent" placeholder="How can we help?" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent" placeholder="Describe your issue..."></textarea>
                                </div>
                                <button type="submit" className="w-full py-3 bg-google-blue text-white rounded-lg font-medium hover:bg-white hover:text-google-blue hover:border-google-blue hover:border-2 transition-all border-2 border-transparent">Send Message</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Live Chat Widget */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col"
                        style={{ height: '400px' }}
                    >
                        <div className="bg-google-green p-4 text-white flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="font-bold">Assistant</span>
                            </div>
                            <button onClick={() => setShowChat(false)} className="text-white hover:text-green-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-google-green text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-gray-100 flex space-x-2">
                            <input
                                type="text"
                                className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-google-green"
                                placeholder="Type a message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                            />
                            <button type="submit" className="p-2 bg-google-green text-white rounded-lg hover:bg-green-600">
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
