import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from '../layout/Navbar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(220,38,38,0.15),transparent_50%)]" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(220,38,38,0.1),transparent_50%)]" />
            <div className="fixed inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.5))]" />
            
            {/* Grid Pattern */}
            <div className="fixed inset-0 opacity-[0.02]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            <Navbar />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 pt-28 pb-12 px-6 max-w-7xl mx-auto"
            >
                <Outlet />
            </motion.main>
        </div>
    );
}
