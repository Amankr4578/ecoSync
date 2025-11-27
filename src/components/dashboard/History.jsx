import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Weight, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';

export default function History() {
    const historyData = [
        { id: '#ECO-2024-001', date: 'Oct 24, 2024', type: 'Recyclable', weight: '5.2 kg', status: 'Completed', address: '123 Green St, Eco City' },
        { id: '#ECO-2024-002', date: 'Oct 20, 2024', type: 'Organic', weight: '3.1 kg', status: 'Completed', address: '123 Green St, Eco City' },
        { id: '#ECO-2024-003', date: 'Oct 15, 2024', type: 'E-Waste', weight: '1.5 kg', status: 'Cancelled', address: '123 Green St, Eco City' },
        { id: '#ECO-2024-004', date: 'Oct 10, 2024', type: 'Recyclable', weight: '8.4 kg', status: 'Completed', address: '123 Green St, Eco City' },
        { id: '#ECO-2024-005', date: 'Oct 05, 2024', type: 'Hazardous', weight: '0.5 kg', status: 'Completed', address: '123 Green St, Eco City' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Collection History</h1>
                    <p className="text-zinc-400">Track your past contributions</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 flex gap-1">
                    <button className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm font-medium">All</button>
                    <button className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white text-sm font-medium transition-colors">Completed</button>
                    <button className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white text-sm font-medium transition-colors">Pending</button>
                </div>
            </div>

            <div className="grid gap-4">
                {historyData.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 p-6 rounded-3xl hover:bg-zinc-900/80 hover:border-zinc-700 transition-all"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                            {/* Left: ID & Type */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-white text-lg">{item.type} Collection</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 font-mono">{item.id}</p>
                                </div>
                            </div>

                            {/* Middle: Details */}
                            <div className="flex flex-wrap gap-6 md:gap-12">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">{item.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Weight className="w-4 h-4" />
                                    <span className="text-sm">{item.weight}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm truncate max-w-[150px]">{item.address}</span>
                                </div>
                            </div>

                            {/* Right: Action */}
                            <button className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black hover:border-white transition-all">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
