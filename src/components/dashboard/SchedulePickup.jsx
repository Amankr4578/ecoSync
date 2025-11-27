import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Weight, FileText, ArrowRight, Truck, Leaf, Recycle, Zap, Trash2 } from 'lucide-react';

export default function SchedulePickup() {
    const [wasteType, setWasteType] = useState('recyclable');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ wasteType, date, time, address, weight, notes });
    };

    const wasteTypes = [
        { id: 'recyclable', label: 'Recyclable', icon: Recycle, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { id: 'organic', label: 'Organic', icon: Leaf, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
        { id: 'ewaste', label: 'E-Waste', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
        { id: 'hazardous', label: 'Hazardous', icon: Trash2, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Schedule Pickup</h1>
                    <p className="text-zinc-400">Request a waste collection service</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Waste Type Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Waste Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {wasteTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setWasteType(type.id)}
                                            className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 ${wasteType === type.id
                                                    ? `${type.bg} ${type.border} ring-1 ring-inset ring-white/10`
                                                    : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'
                                                }`}
                                        >
                                            <type.icon className={`w-6 h-6 ${wasteType === type.id ? type.color : 'text-zinc-500'}`} />
                                            <span className={`text-sm font-medium ${wasteType === type.id ? 'text-white' : 'text-zinc-500'}`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700"
                                        />
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Time</label>
                                    <div className="relative group">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Weight */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Estimated Weight (kg)</label>
                                <div className="relative group">
                                    <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="e.g. 5"
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Pickup Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter full address..."
                                        rows={3}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700 resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Confirm Pickup Request
                                <ArrowRight className="w-5 h-5" />
                            </button>

                        </form>
                    </motion.div>
                </div>

                {/* Info / Summary Card */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Standard Pickup</h3>
                                <p className="text-xs text-emerald-400/80">Available 9 AM - 6 PM</p>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Our team will arrive within a 2-hour window of your scheduled time. Please ensure waste is properly segregated.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-500" />
                            Guidelines
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5" />
                                Separate recyclables from organic waste.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5" />
                                Ensure hazardous materials are sealed.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5" />
                                Max weight per bag: 15kg.
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
