import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Recycle, Leaf, Award, ArrowUpRight, Clock, Truck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { pickupsAPI } from '../../api/axios';

const StatCard = ({ icon: Icon, label, value, trend, color, loading }) => (
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
            {loading ? (
                <div className="h-9 mt-1 flex items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                </div>
            ) : (
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            )}
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>{trend}</span>
                <span className="text-zinc-500">vs last month</span>
            </div>
        </div>
    </motion.div>
);

const ActivityItem = ({ type, date, status }) => {
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        const dayMs = 24 * 60 * 60 * 1000;
        
        if (diff < dayMs) {
            return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        } else if (diff < 2 * dayMs) {
            return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
        } else {
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="font-medium text-white">{type} Collection</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(date)}</span>
                    </div>
                </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 
                status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-zinc-400'
            }`}>
                {status}
            </span>
        </div>
    );
};

export default function Overview() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await pickupsAPI.getStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatNextPickup = () => {
        if (!stats?.nextPickup) return null;
        const d = new Date(stats.nextPickup.date);
        return {
            date: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
            time: stats.nextPickup.time,
            type: stats.nextPickup.type
        };
    };

    const nextPickup = formatNextPickup();

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-zinc-400 mt-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}! Here's your waste management summary.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Recycle}
                    label="Total Recycled"
                    value={loading ? '...' : `${(stats?.totalRecycled || 0).toLocaleString()} kg`}
                    trend={stats?.recycledTrend || '+0%'}
                    color="text-emerald-500"
                    loading={loading}
                />
                <StatCard
                    icon={Leaf}
                    label="Carbon Offset"
                    value={loading ? '...' : `${(stats?.carbonOffset || 0).toLocaleString()} kg`}
                    trend="+8%"
                    color="text-blue-500"
                    loading={loading}
                />
                <StatCard
                    icon={Award}
                    label="Eco Points"
                    value={loading ? '...' : (stats?.ecoPoints || 0).toLocaleString()}
                    trend={`Level ${stats?.level || 1}`}
                    color="text-amber-500"
                    loading={loading}
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
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
                            </div>
                        ) : stats?.recentPickups?.length > 0 ? (
                            stats.recentPickups.map((pickup, index) => (
                                <ActivityItem 
                                    key={index} 
                                    type={pickup.type} 
                                    date={pickup.date} 
                                    status={pickup.status} 
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-zinc-500">
                                <p>No recent collections yet.</p>
                                <p className="text-sm mt-1">Schedule your first pickup to get started!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Next Scheduled Pickup */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-4">Next Scheduled Pickup</h2>
                    <div className="flex-1 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center justify-center p-6 text-center space-y-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] duration-[1500ms]" />
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 z-10">
                            <Truck className="w-8 h-8 text-primary" />
                        </div>
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                        ) : nextPickup ? (
                            <div className="z-10">
                                <p className="text-zinc-400 text-sm">{nextPickup.date}, {nextPickup.time}</p>
                                <p className="text-white font-medium mt-1">{nextPickup.type} Waste Collection</p>
                            </div>
                        ) : (
                            <div className="z-10">
                                <p className="text-zinc-400 text-sm">No upcoming pickups</p>
                                <p className="text-white font-medium mt-1">Schedule a pickup below</p>
                            </div>
                        )}
                        <button 
                            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors z-10 mt-auto"
                            onClick={() => window.location.href = '/dashboard/schedule'}
                        >
                            {nextPickup ? 'Track Driver' : 'Schedule Pickup'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
