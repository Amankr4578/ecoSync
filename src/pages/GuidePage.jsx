import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { categories, wasteItems } from '../data/wasteItems';

const ItemCard = ({ item, category, Icon }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onMouseMove={handleMouseMove}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-900/80 transition-colors overflow-hidden"
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            350px circle at ${mouseX}px ${mouseY}px,
                            rgba(255, 255, 255, 0.1),
                            transparent 80%
                        )
                    `,
                }}
            />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.bg} ${category.color}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${category.bg} ${category.color} border ${category.border}`}>
                        {category.label}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.instruction}</p>
            </div>
        </motion.div>
    );
};

export default function GuidePage() {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

    const filteredItems = wasteItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 relative overflow-hidden">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
                    >
                        Waste <span className="text-primary">Segregation</span> Guide
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10"
                    >
                        Not sure where to throw it? Search our database or browse by category to ensure responsible disposal.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative max-w-2xl mx-auto group"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
                        <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-2 flex items-center gap-4 transition-colors group-focus-within:border-primary/50">
                            <Search className="w-6 h-6 text-zinc-500 ml-4" />
                            <input
                                type="text"
                                placeholder="Search for items (e.g., 'pizza box', 'battery')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-600 h-12 text-lg"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                            ? 'bg-white text-black'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                            }`}
                    >
                        All Items
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === cat.id
                                ? `${cat.bg} ${cat.color} border ${cat.border}`
                                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </motion.div>

                {/* Results Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => {
                            const category = categories.find(c => c.id === item.category);
                            return (
                                <ItemCard
                                    key={item.name}
                                    item={item}
                                    category={category}
                                    Icon={category.icon}
                                />
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                            <Search className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                        <p className="text-zinc-500">Try searching for something else or browse by category.</p>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
