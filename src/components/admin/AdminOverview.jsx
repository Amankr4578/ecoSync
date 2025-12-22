import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Truck, Recycle, TrendingUp, Clock, CheckCircle, XCircle, Loader2, ArrowUpRight } from 'lucide-react';
import { adminAPI } from '../../api/axios';

const StatCard = ({ icon: Icon, label, value, subValue, color, loading }) => (
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
                <>
                    <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
                    {subValue && (
                        <p className="text-xs text-zinc-500 mt-2">{subValue}</p>
                    )}
                </>
            )}
        </div>
    </motion.div>
);

const ActivityItem = ({ pickup }) => {
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-400/10';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10';
            case 'in-progress': return 'text-blue-400 bg-blue-400/10';
            case 'cancelled': return 'text-red-400 bg-red-400/10';
            default: return 'text-zinc-400 bg-zinc-400/10';
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-red-400" />
                </div>
                <div>
                    <p className="font-medium text-white">{pickup.user?.name || 'Unknown User'}</p>
                    <p className="text-xs text-zinc-500">{pickup.wasteType} • {pickup.pickupId}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-500">{formatDate(pickup.createdAt)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                    {pickup.status}
                </span>
            </div>
        </div>
    );
};

const UserItem = ({ user }) => (
    <div className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-xl transition-colors">
        <div className="flex items-center gap-3">
            <img 
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-10 h-10 rounded-full bg-zinc-800"
            />
            <div>
                <p className="font-medium text-white text-sm">{user.name}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-sm text-primary font-medium">{user.ecoPoints || 0} pts</p>
            <p className="text-xs text-zinc-500">Level {user.level || 1}</p>
        </div>
    </div>
);

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getStats();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-zinc-400 mt-2">System overview and management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={loading ? '...' : stats?.users?.total || 0}
                    subValue={`+${stats?.users?.newThisMonth || 0} this month`}
                    color="text-blue-500"
                    loading={loading}
                />
                <StatCard
                    icon={Truck}
                    label="Total Pickups"
                    value={loading ? '...' : stats?.pickups?.total || 0}
                    subValue={`${stats?.pickups?.pending || 0} pending`}
                    color="text-amber-500"
                    loading={loading}
                />
                <StatCard
                    icon={Recycle}
                    label="Waste Recycled"
                    value={loading ? '...' : `${(stats?.totals?.wasteRecycled || 0).toLocaleString()} kg`}
                    subValue={`${(stats?.totals?.carbonOffset || 0).toFixed(1)} kg CO₂ offset`}
                    color="text-emerald-500"
                    loading={loading}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Eco Points Awarded"
                    value={loading ? '...' : (stats?.totals?.ecoPointsAwarded || 0).toLocaleString()}
                    subValue="Total points in system"
                    color="text-purple-500"
                    loading={loading}
                />
            </div>

            {/* Pickup Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{stats?.pickups?.pending || 0}</p>
                        <p className="text-xs text-zinc-500">Pending</p>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{stats?.pickups?.inProgress || 0}</p>
                        <p className="text-xs text-zinc-500">In Progress</p>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{stats?.pickups?.completed || 0}</p>
                        <p className="text-xs text-zinc-500">Completed</p>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{stats?.pickups?.cancelled || 0}</p>
                        <p className="text-xs text-zinc-500">Cancelled</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Pickups */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Recent Pickups</h2>
                        <a href="/admin/pickups" className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div>
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
                            </div>
                        ) : stats?.recentPickups?.length > 0 ? (
                            stats.recentPickups.slice(0, 5).map((pickup) => (
                                <ActivityItem key={pickup._id} pickup={pickup} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-zinc-500">
                                <p>No pickups yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">New Users</h2>
                        <a href="/admin/users" className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="p-4 space-y-2">
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
                            </div>
                        ) : stats?.recentUsers?.length > 0 ? (
                            stats.recentUsers.map((user) => (
                                <UserItem key={user._id} user={user} />
                            ))
                        ) : (
                            <div className="p-8 text-center text-zinc-500">
                                <p>No users yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
