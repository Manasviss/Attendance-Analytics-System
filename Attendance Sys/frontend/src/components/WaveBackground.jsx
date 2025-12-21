import React from 'react';
import { motion } from 'framer-motion';

const WaveBackground = () => {
    return (
        <div className="absolute bottom-0 left-0 w-full h-[50vh] overflow-hidden leading-none z-0 pointer-events-none">
            <svg
                className="relative block w-[200%] h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
            >
                {/* Wave 1 - Line Style */}
                <motion.path
                    d="M0,60 C150,90 450,30 600,60 C750,90 1050,30 1200,60 L1200,120 L0,120 Z"
                    fill="none"
                    stroke="#002E6E"
                    strokeWidth="1"
                    className="opacity-20"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                {/* Wave 2 - Line Style */}
                <motion.path
                    d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40"
                    fill="none"
                    stroke="#00BAF2"
                    strokeWidth="2"
                    className="opacity-30"
                    style={{ x: "-25%" }}
                    animate={{ x: ["-25%", "-75%"] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                {/* Wave 3 - Line Style */}
                <motion.path
                    d="M0,80 C300,120 600,40 900,80 C1200,120 1500,40 1800,80"
                    fill="none"
                    stroke="#002E6E"
                    strokeWidth="1.5"
                    className="opacity-20"
                    style={{ x: "0%" }}
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                {/* Wave 4 - Line Style */}
                <motion.path
                    d="M0,20 C250,60 500,0 750,20 C1000,60 1250,0 1500,20"
                    fill="none"
                    stroke="#00BAF2"
                    strokeWidth="1"
                    className="opacity-20"
                    style={{ x: "-10%" }}
                    animate={{ x: ["-10%", "-60%"] }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </svg>
        </div>
    );
};

export default WaveBackground;
