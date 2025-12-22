import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Users, Leaf, Save, Loader2, RefreshCw, CheckCircle, BarChart3 } from 'lucide-react';
import { siteSettingsAPI } from '../../api/axios';

export default function HomepageSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await siteSettingsAPI.get();
            setSettings(response.data);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            await siteSettingsAPI.updateImpactStats(settings.impactStats);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateStat = (statKey, field, value) => {
        setSettings(prev => ({
            ...prev,
            impactStats: {
                ...prev.impactStats,
                [statKey]: {
                    ...prev.impactStats[statKey],
                    [field]: value
                }
            }
        }));
    };

    const statConfigs = [
        { key: 'tonsProcessed', label: 'Tons Processed', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { key: 'globalUptime', label: 'Global Uptime', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { key: 'collectionPoints', label: 'Collection Points', icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { key: 'carbonOffset', label: 'Carbon Offset', icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Homepage Settings</h1>
                    <p className="text-zinc-400">Manage the stats displayed on the landing page</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchSettings}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saved ? (
                            <CheckCircle className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Impact Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Impact Statistics</h2>
                        <p className="text-sm text-zinc-500">These values appear in the "Measurable Results" section</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {statConfigs.map((config) => {
                        const Icon = config.icon;
                        const stat = settings?.impactStats?.[config.key] || {};
                        
                        return (
                            <div key={config.key} className="bg-zinc-800/50 rounded-xl p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${config.color}`} />
                                    </div>
                                    <span className="font-medium text-white">{config.label}</span>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                                            Display Value
                                        </label>
                                        <input
                                            type="text"
                                            value={stat.value || ''}
                                            onChange={(e) => updateStat(config.key, 'value', e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-lg font-bold focus:outline-none focus:border-red-400/50"
                                            placeholder="e.g. 50,240"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">
                                            Subtext
                                        </label>
                                        <input
                                            type="text"
                                            value={stat.subtext || ''}
                                            onChange={(e) => updateStat(config.key, 'subtext', e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-300 text-sm focus:outline-none focus:border-red-400/50"
                                            placeholder="e.g. +12% this month"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-500">
                        💡 <strong>Tip:</strong> Changes will be visible on the homepage immediately after saving.
                        Last updated: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
