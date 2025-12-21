import { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const particles = [];
        const waveCount = 3;

        // Configuration
        const particleCount = 50;
        const colors = ['rgba(0, 186, 242, 0.5)', 'rgba(0, 46, 110, 0.3)', 'rgba(255, 255, 255, 0.2)'];

        const init = () => {
            canvas.width = width;
            canvas.height = height;

            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 1,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        const drawWave = (y, amplitude, frequency, phase, color) => {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x < width; x++) {
                ctx.lineTo(x, y + Math.sin(x * frequency + phase) * amplitude);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.fillStyle = color;
            ctx.fill();
        };

        const animate = (time) => {
            ctx.clearRect(0, 0, width, height);

            // Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#002E6E'); // Deep Blue
            gradient.addColorStop(1, '#005EA6'); // Lighter Blue
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw Particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
            });

            // Draw Waves
            const phase = time * 0.001;
            drawWave(height * 0.7, 30, 0.003, phase, 'rgba(0, 186, 242, 0.1)'); // Cyan wave
            drawWave(height * 0.75, 40, 0.002, phase + 2, 'rgba(0, 46, 110, 0.2)'); // Dark blue wave
            drawWave(height * 0.8, 20, 0.004, phase + 4, 'rgba(255, 255, 255, 0.05)'); // White subtle wave

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            init();
        };

        init();
        animate(0);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
        />
    );
};

export default AnimatedBackground;
