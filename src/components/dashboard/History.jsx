import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Weight, Clock, ArrowUpRight, Loader2, Trash2, X, Recycle, Leaf, Zap, AlertTriangle, CheckCircle, XCircle, Package } from 'lucide-react';
import { pickupsAPI } from '../../api/axios';
import { createPortal } from 'react-dom';

export default function History() {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPickup, setSelectedPickup] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, [filter, page]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await pickupsAPI.getAll({ 
                status: filter === 'all' ? undefined : filter,
                page,
                limit: 10
            });
            setPickups(response.data.pickups);
            setTotalPages(response.data.pages);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelPickup = async (id) => {
        if (!confirm('Are you sure you want to cancel this pickup?')) return;
        
        try {
            await pickupsAPI.cancel(id);
            fetchHistory(); // Refresh list
        } catch (err) {
            console.error('Failed to cancel pickup:', err);
            alert('Failed to cancel pickup. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'pending': 
            case 'scheduled': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatWasteType = (type) => {
        const types = {
            recyclable: 'Recyclable',
            organic: 'Organic',
            ewaste: 'E-Waste',
            hazardous: 'Hazardous'
        };
        return types[type] || type;
    };

    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Collection History</h1>
                    <p className="text-zinc-400">Track your past contributions</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-1 flex gap-1">
                    {['all', 'completed', 'pending'].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === f 
                                    ? 'bg-zinc-800 text-white' 
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
                    </div>
                ) : pickups.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {pickups.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
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
                                                <h3 className="font-bold text-white text-lg">{formatWasteType(item.wasteType)} Collection</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                                    {formatStatus(item.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-zinc-500 font-mono">{item.pickupId}</p>
                                        </div>
                                    </div>

                                    {/* Middle: Details */}
                                    <div className="flex flex-wrap gap-6 md:gap-12">
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">{formatDate(item.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <Weight className="w-4 h-4" />
                                            <span className="text-sm">
                                                {item.actualWeight || item.estimatedWeight || 0} kg
                                                {item.status === 'completed' && item.ecoPointsEarned > 0 && (
                                                    <span className="text-emerald-400 ml-2">+{item.ecoPointsEarned} pts</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-400">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm truncate max-w-[150px]">{item.address}</span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2">
                                        {(item.status === 'pending' || item.status === 'scheduled') && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleCancelPickup(item._id); }}
                                                className="w-10 h-10 rounded-full border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all"
                                                title="Cancel Pickup"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => setSelectedPickup(item)}
                                            className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black hover:border-white transition-all"
                                            title="View Details"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Admin Notes - Show if available */}
                                {item.adminNotes && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800">
                                        <div className="flex items-start gap-3 bg-zinc-800/50 rounded-xl p-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs text-primary font-bold">!</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Note from EcoSync Team</p>
                                                <p className="text-sm text-zinc-300">{item.adminNotes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No pickups yet</h3>
                        <p className="text-zinc-500">
                            {filter === 'all' 
                                ? "Schedule your first pickup to get started!" 
                                : `No ${filter} pickups found.`}
                        </p>
                        {filter === 'all' && (
                            <button 
                                onClick={() => window.location.href = '/dashboard/schedule'}
                                className="mt-4 px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                            >
                                Schedule Pickup
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-zinc-500 text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Pickup Detail Modal */}
            {createPortal(
                <AnimatePresence>
                    {selectedPickup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedPickup(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Pickup Details</h2>
                                        <p className="text-sm text-zinc-500 font-mono">{selectedPickup.pickupId}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPickup(null)}
                                        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-4">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedPickup.status)}`}>
                                        {selectedPickup.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                                        {selectedPickup.status === 'cancelled' && <XCircle className="w-4 h-4" />}
                                        {selectedPickup.status === 'pending' && <Clock className="w-4 h-4" />}
                                        {selectedPickup.status === 'in-progress' && <Package className="w-4 h-4" />}
                                        {formatStatus(selectedPickup.status)}
                                    </span>
                                </div>

                                {/* Pickup Info */}
                                <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Pickup Information</p>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            {selectedPickup.wasteType === 'recyclable' && <Recycle className="w-4 h-4 text-blue-400 mt-0.5" />}
                                            {selectedPickup.wasteType === 'organic' && <Leaf className="w-4 h-4 text-green-400 mt-0.5" />}
                                            {selectedPickup.wasteType === 'ewaste' && <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />}
                                            {selectedPickup.wasteType === 'hazardous' && <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />}
                                            <div>
                                                <p className="text-sm text-white font-medium">{formatWasteType(selectedPickup.wasteType)}</p>
                                                <p className="text-xs text-zinc-500">Waste Type</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">{formatDate(selectedPickup.date)}</p>
                                                <p className="text-xs text-zinc-500">Scheduled Date</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">{selectedPickup.time}</p>
                                                <p className="text-xs text-zinc-500">Scheduled Time</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">{selectedPickup.address}</p>
                                                <p className="text-xs text-zinc-500">Pickup Address</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Weight className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">
                                                    {selectedPickup.actualWeight || selectedPickup.estimatedWeight || 0} kg
                                                    {selectedPickup.status === 'completed' && selectedPickup.ecoPointsEarned > 0 && (
                                                        <span className="text-emerald-400 ml-2">+{selectedPickup.ecoPointsEarned} eco points</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-zinc-500">Weight</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Notes */}
                                {selectedPickup.notes && (
                                    <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Your Notes</p>
                                        <p className="text-sm text-zinc-300">{selectedPickup.notes}</p>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                {selectedPickup.adminNotes && (
                                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs text-primary font-bold">!</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-primary/80 uppercase tracking-wider mb-1">Note from EcoSync Team</p>
                                                <p className="text-sm text-zinc-300">{selectedPickup.adminNotes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Timestamps */}
                                <div className="text-xs text-zinc-600 space-y-1">
                                    <p>Created: {new Date(selectedPickup.createdAt).toLocaleString()}</p>
                                    {selectedPickup.completedAt && (
                                        <p>Completed: {new Date(selectedPickup.completedAt).toLocaleString()}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedPickup(null)}
                                    className="w-full mt-6 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                                >
                                    Close
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
