import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';

export default function Settings() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-zinc-400">Manage your account preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-3xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            Profile Information
                        </h2>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Alex Johnson</h3>
                                <p className="text-zinc-500 text-sm">Eco Warrior • Level 5</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input type="text" defaultValue="Alex Johnson" className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input type="email" defaultValue="alex@example.com" className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input type="tel" defaultValue="+1 (555) 000-0000" className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input type="text" defaultValue="San Francisco, CA" className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Preferences Section */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            Notifications
                        </h2>

                        <div className="space-y-4">
                            {[
                                { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                                { id: 'push', label: 'Push Notifications', desc: 'Real-time alerts on your device' },
                                { id: 'sms', label: 'SMS Alerts', desc: 'Text messages for pickup status' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/50 transition-colors">
                                    <div>
                                        <div className="font-medium text-white text-sm">{item.label}</div>
                                        <div className="text-xs text-zinc-500">{item.desc}</div>
                                    </div>
                                    <button
                                        onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-primary' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.id] ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Security
                        </h2>
                        <button className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium mb-3">
                            Change Password
                        </button>
                        <button className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                            Delete Account
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
