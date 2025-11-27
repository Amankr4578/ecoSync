import React from 'react';
import { motion } from 'framer-motion';
import { Recycle, Leaf, Award, ArrowUpRight, Clock, MapPin, Truck } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-zinc-400 text-sm font-medium">{label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>{trend}</span>
                <span className="text-zinc-500">vs last month</span>
            </div>
        </div>
    </motion.div>
);

const ActivityItem = ({ type, date, status }) => (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Recycle className="w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="font-medium text-white">{type}</p>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{date}</span>
                </div>
            </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
            status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-400'
            }`}>
            {status}
        </span>
    </div>
);

export default function Overview() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-zinc-400 mt-2">Welcome back, Alex! Here's your waste management summary.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Recycle}
                    label="Total Recycled"
                    value="1,240 kg"
                    trend="+12%"
                    color="text-emerald-500"
                />
                <StatCard
                    icon={Leaf}
                    label="Carbon Offset"
                    value="850 kg"
                    trend="+8%"
                    color="text-blue-500"
                />
                <StatCard
                    icon={Award}
                    label="Eco Points"
                    value="3,450"
                    trend="+240"
                    color="text-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Recent Collections</h2>
                        <button className="text-sm text-primary hover:text-emerald-400 transition-colors">View All</button>
                    </div>
                    <div>
                        <ActivityItem type="Plastic & Paper Collection" date="Today, 10:30 AM" status="Completed" />
                        <ActivityItem type="E-Waste Pickup" date="Yesterday, 2:15 PM" status="Completed" />
                        <ActivityItem type="Organic Waste" date="Nov 24, 9:00 AM" status="Pending" />
                        <ActivityItem type="General Waste" date="Nov 20, 11:45 AM" status="Completed" />
                    </div>
                </div>

                {/* Quick Action / Map Placeholder */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-4">Next Scheduled Pickup</h2>
                    <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center justify-center p-6 text-center space-y-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] duration-[1500ms]" />
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 z-10">
                            <Truck className="w-8 h-8 text-primary" />
                        </div>
                        <div className="z-10">
                            <p className="text-zinc-400 text-sm">Tomorrow, 09:00 AM</p>
                            <p className="text-white font-medium mt-1">Organic Waste Collection</p>
                        </div>
                        <button className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors z-10 mt-auto">
                            Track Driver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
