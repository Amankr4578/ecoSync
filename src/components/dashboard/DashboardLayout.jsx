import React from 'react';
import Navbar from '../layout/Navbar';
import { motion } from 'framer-motion';
import { Leaf, Recycle } from 'lucide-react';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />

                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-[5%] text-zinc-900/50"
                >
                    <Leaf className="w-64 h-64" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-[5%] text-zinc-900/50"
                >
                    <Recycle className="w-80 h-80" />
                </motion.div>
            </div>

            <Navbar />

            <main className="relative z-10 pt-32 pb-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
