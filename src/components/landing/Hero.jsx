import React, { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate, animate } from 'framer-motion';
import { ArrowRight, Truck, MapPin, Activity, Leaf, Recycle, Trash2, Factory } from 'lucide-react';

export default function Hero() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section
            id="mission"
            className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden bg-background group"
            onMouseMove={handleMouseMove}
        >

            {/* Mouse Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(34, 197, 94, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Background Effects */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                {/* Floating Background Icons - Balanced Hierarchy (2 Left, 2 Right) */}

                {/* Left Side */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-[10%] text-primary/20 pointer-events-auto"
                    whileHover={{ scale: 1.2, opacity: 1, color: '#22c55e', transition: { duration: 0.2 } }}
                >
                    <Leaf className="w-24 h-24" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 left-[15%] text-zinc-800 pointer-events-auto"
                    whileHover={{ scale: 1.2, opacity: 1, color: '#ffffff', transition: { duration: 0.2 } }}
                >
                    <Truck className="w-16 h-16" />
                </motion.div>

                {/* Right Side */}
                <motion.div
                    animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-1/3 right-[10%] text-primary/20 pointer-events-auto"
                    whileHover={{ scale: 1.2, opacity: 1, color: '#22c55e', transition: { duration: 0.2 } }}
                >
                    <Recycle className="w-28 h-28" />
                </motion.div>
                <motion.div
                    animate={{ rotate: [0, 10, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="absolute bottom-1/4 right-[18%] text-zinc-800 pointer-events-auto"
                    whileHover={{ scale: 1.2, opacity: 1, color: '#ffffff', transition: { duration: 0.2 } }}
                >
                    <Factory className="w-20 h-20" />
                </motion.div>
            </div>

            {/* Main Content - Strictly Centered */}
            <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8 flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block"
                >
                    <span className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm text-xs font-mono text-zinc-400 flex items-center gap-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        WASTE MANAGEMENT SYSTEM
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-[0.9] relative"
                >
                    {/* Text Glow Effect */}
                    <span className="absolute -inset-2 bg-primary/20 blur-2xl opacity-0 md:opacity-50 rounded-full pointer-events-none" />

                    SMART WASTE <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-white to-zinc-500 animate-gradient-x bg-[length:200%_auto]">
                        MANAGEMENT
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Comprehensive solution for collection, transportation, disposal, and segregation of waste products.
                    <br className="hidden md:block" />
                    Effective management for a cleaner environment.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 w-full"
                >
                    <button className="group relative px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:text-emerald-300">
                        Start Collection
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 text-lg font-medium transition-all rounded-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700 hover:scale-105">
                        View Services
                    </button>
                </motion.div>
            </div>

            {/* Bottom Ticker - Clean & Aligned */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0, duration: 0.5 }}
                className="absolute bottom-0 left-0 right-0 h-14 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-900 flex items-center overflow-hidden z-20"
            >
                <div className="flex gap-16 animate-[scroll_30s_linear_infinite] whitespace-nowrap px-4">
                    {[...Array(5)].map((_, i) => (
                        <React.Fragment key={i}>
                            <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-3">
                                <Activity className="w-4 h-4 text-primary" />
                                Collection Status: <span className="text-white">Active</span>
                            </span>
                            <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-3">
                                <Truck className="w-4 h-4 text-primary" />
                                Transportation: <span className="text-white">On Schedule</span>
                            </span>
                            <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-primary" />
                                Disposal Units: <span className="text-white">Operational</span>
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>
        </section >
    );
}
