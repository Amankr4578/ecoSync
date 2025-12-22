import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Mail, Bell, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState({
        email: true,
        newUsers: true,
        newPickups: true,
        completedPickups: false
    });

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Admin Settings</h1>
                <p className="text-zinc-400">Manage your admin account</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-3xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-400" />
                            Admin Profile
                        </h2>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-red-400/30 overflow-hidden">
                                <img 
                                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Admin'}`} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{user?.name || 'Admin'}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20">
                                        Administrator
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-sm mt-2">{user?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input 
                                        type="text" 
                                        value={user?.name || ''}
                                        readOnly
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white cursor-not-allowed opacity-60" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input 
                                        type="email" 
                                        value={user?.email || ''}
                                        readOnly
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white cursor-not-allowed opacity-60" 
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-zinc-500 mt-4">
                            * To update admin profile, please contact the system administrator.
                        </p>
                    </motion.div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-red-400" />
                            Notifications
                        </h2>

                        <div className="space-y-4">
                            {[
                                { id: 'email', label: 'Email Notifications', desc: 'Receive alerts via email' },
                                { id: 'newUsers', label: 'New User Signups', desc: 'Alert when new users register' },
                                { id: 'newPickups', label: 'New Pickups', desc: 'Alert when pickups are scheduled' },
                                { id: 'completedPickups', label: 'Completed Pickups', desc: 'Alert when pickups complete' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/50 transition-colors">
                                    <div>
                                        <div className="font-medium text-white text-sm">{item.label}</div>
                                        <div className="text-xs text-zinc-500">{item.desc}</div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-red-500' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.id] ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                        
                        <div className="space-y-3">
                            <a 
                                href="/admin/users"
                                className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                Manage Users
                            </a>
                            <a 
                                href="/admin/pickups"
                                className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            >
                                Manage Pickups
                            </a>
                        </div>
                    </motion.div>

                    {/* Logout */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h2 className="text-lg font-bold text-white mb-4">Session</h2>
                        <button 
                            onClick={handleLogout}
                            className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
