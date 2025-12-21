import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1200); // 1.2s total duration

        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001530]">
                    <div className="relative flex items-center justify-center h-16 w-16">

                        {/* Container for Concise Arrows */}
                        <div className="flex space-x-1 animate-fade-out-arrows">
                            {/* Arrow 1 */}
                            <svg className="w-6 h-6 text-gray-600 animate-pulse-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                            </svg>
                            {/* Arrow 2 */}
                            <svg className="w-6 h-6 text-gray-600 animate-pulse-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                            </svg>
                            {/* Arrow 3 */}
                            <svg className="w-6 h-6 text-gray-600 animate-pulse-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>

                        {/* Checkmark (Appears after arrows) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-[#00BAF2] drop-shadow-[0_0_10px_rgba(0,186,242,0.8)] opacity-0 animate-scale-in-check"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                    </div>

                    <style>{`
                        /* Concise Pulse Animation */
                        @keyframes pulse-glow {
                            0%, 100% { color: #4B5563; opacity: 0.5; }
                            50% { color: #00BAF2; opacity: 1; filter: drop-shadow(0 0 5px #00BAF2); }
                        }
                        .animate-pulse-1 { animation: pulse-glow 0.6s ease-in-out infinite; }
                        .animate-pulse-2 { animation: pulse-glow 0.6s ease-in-out 0.15s infinite; }
                        .animate-pulse-3 { animation: pulse-glow 0.6s ease-in-out 0.3s infinite; }

                        /* Fade out arrows */
                        @keyframes fade-out {
                            to { opacity: 0; transform: scale(0.8); }
                        }
                        .animate-fade-out-arrows { animation: fade-out 0.2s ease-out 0.8s forwards; }

                        /* Checkmark Appearance */
                        @keyframes scale-in {
                            0% { opacity: 0; transform: scale(0); }
                            70% { opacity: 1; transform: scale(1.2); }
                            100% { opacity: 1; transform: scale(1); }
                        }
                        .animate-scale-in-check { animation: scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.9s forwards; }
                    `}</style>
                </div>
            )}
            <div className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
                {children}
            </div>
        </>
    );
};

export default PageTransition;
