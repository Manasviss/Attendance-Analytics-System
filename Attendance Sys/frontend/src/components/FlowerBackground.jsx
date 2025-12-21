import React from 'react';
import { motion } from 'framer-motion';

const FlowerBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <svg
                className="absolute -right-20 -top-20 w-96 h-96 opacity-10"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "100px", originY: "100px" }}
                >
                    {/* Petals / Geometric Flower Pattern */}
                    {[...Array(8)].map((_, i) => (
                        <motion.path
                            key={i}
                            d="M100,100 Q130,50 100,20 Q70,50 100,100"
                            fill="none"
                            stroke="#00BAF2"
                            strokeWidth="1"
                            transform={`rotate(${i * 45} 100 100)`}
                        />
                    ))}
                    {[...Array(8)].map((_, i) => (
                        <motion.path
                            key={`inner-${i}`}
                            d="M100,100 Q115,70 100,60 Q85,70 100,100"
                            fill="none"
                            stroke="#00BAF2"
                            strokeWidth="0.5"
                            transform={`rotate(${i * 45 + 22.5} 100 100)`}
                        />
                    ))}
                    <circle cx="100" cy="100" r="15" stroke="#00BAF2" strokeWidth="0.5" fill="none" />
                </motion.g>
            </svg>

            {/* Bottom Flower/Mandala */}
            <svg
                className="absolute -left-20 -bottom-20 w-80 h-80 opacity-5"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.g
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "100px", originY: "100px" }}
                >
                    {[...Array(12)].map((_, i) => (
                        <motion.path
                            key={i}
                            d="M100,100 C120,80 150,80 150,100 C150,120 120,120 100,100"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1"
                            transform={`rotate(${i * 30} 100 100)`}
                        />
                    ))}
                </motion.g>
            </svg>
        </div>
    );
};

export default FlowerBackground;
