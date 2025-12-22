import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Trash2, X, Loader2, ChevronLeft, ChevronRight, Truck, Calendar, MapPin, Weight, CheckCircle, Clock, Filter, Recycle, Leaf, Cpu, AlertTriangle, List } from 'lucide-react';
import { adminAPI } from '../../api/axios';
import { createPortal } from 'react-dom';
import StyledSelect from '../ui/StyledSelect';

export default function PickupManagement() {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    
    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPickup, setEditingPickup] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    
    // Delete confirmation
    const [deletingPickup, setDeletingPickup] = useState(null);

    useEffect(() => {
        fetchPickups();
    }, [page, statusFilter, typeFilter]);

    const fetchPickups = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getPickups({
                page,
                limit: 10,
                status: statusFilter,
                wasteType: typeFilter
            });
            setPickups(response.data.pickups);
            setTotalPages(response.data.pages);
            setTotal(response.data.total);
        } catch (err) {
            console.error('Failed to fetch pickups:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pickup) => {
        setEditingPickup(pickup);
        setEditForm({
            status: pickup.status,
            adminNotes: pickup.adminNotes || ''
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            await adminAPI.updatePickup(editingPickup._id, editForm);
            setShowEditModal(false);
            fetchPickups();
        } catch (err) {
            console.error('Failed to update pickup:', err);
            alert('Failed to update pickup');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (pickupId) => {
        try {
            await adminAPI.deletePickup(pickupId);
            setDeletingPickup(null);
            fetchPickups();
        } catch (err) {
            console.error('Failed to delete pickup:', err);
            alert('Failed to delete pickup');
        }
    };

    const handleQuickStatusUpdate = async (pickup, newStatus) => {
        try {
            await adminAPI.updatePickup(pickup._id, { status: newStatus });
            fetchPickups();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
            'in-progress': 'bg-blue-400/10 text-blue-400 border-blue-400/20',
            completed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
            cancelled: 'bg-red-400/10 text-red-400 border-red-400/20'
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
                {status}
            </span>
        );
    };

    const getWasteTypeBadge = (type) => {
        const styles = {
            recyclable: 'text-blue-400',
            organic: 'text-green-400',
            ewaste: 'text-yellow-400',
            hazardous: 'text-red-400'
        };
        return <span className={`text-sm font-medium ${styles[type] || 'text-zinc-400'}`}>{type}</span>;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const statusOptions = [
        { value: '', label: 'All Status', icon: List },
        { value: 'pending', label: 'Pending', icon: Clock },
        { value: 'in-progress', label: 'In Progress', icon: Truck },
        { value: 'completed', label: 'Completed', icon: CheckCircle },
        { value: 'cancelled', label: 'Cancelled', icon: X }
    ];

    const typeOptions = [
        { value: '', label: 'All Types', icon: Filter },
        { value: 'recyclable', label: 'Recyclable', icon: Recycle },
        { value: 'organic', label: 'Organic', icon: Leaf },
        { value: 'ewaste', label: 'E-Waste', icon: Cpu },
        { value: 'hazardous', label: 'Hazardous', icon: AlertTriangle }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Pickup Management</h1>
                    <p className="text-zinc-400">{total} total pickups</p>
                </div>
                <div className="flex items-center gap-3">
                    <StyledSelect
                        value={statusFilter}
                        onChange={(val) => { setStatusFilter(val); setPage(1); }}
                        options={statusOptions}
                        placeholder="All Status"
                        icon={Clock}
                        className="w-44"
                    />
                    <StyledSelect
                        value={typeFilter}
                        onChange={(val) => { setTypeFilter(val); setPage(1); }}
                        options={typeOptions}
                        placeholder="All Types"
                        icon={Recycle}
                        className="w-44"
                    />
                </div>
            </div>

            {/* Pickups Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Pickup</th>
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-zinc-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : pickups.length > 0 ? (
                                pickups.map((pickup) => (
                                    <tr key={pickup._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-mono text-sm text-white">{pickup.pickupId}</p>
                                                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {pickup.address?.substring(0, 30)}...
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={pickup.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pickup.user?.name || 'User'}`}
                                                    alt={pickup.user?.name}
                                                    className="w-8 h-8 rounded-full bg-zinc-800"
                                                />
                                                <div>
                                                    <p className="text-sm text-white">{pickup.user?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-zinc-500">{pickup.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{getWasteTypeBadge(pickup.wasteType)}</td>
                                        <td className="p-4">{getStatusBadge(pickup.status)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(pickup.date)}
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-1">{pickup.time}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {pickup.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleQuickStatusUpdate(pickup, 'in-progress')}
                                                        title="Mark In Progress"
                                                        className="p-2 rounded-lg hover:bg-blue-500/10 text-zinc-400 hover:text-blue-400 transition-colors"
                                                    >
                                                        <Truck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {pickup.status === 'in-progress' && (
                                                    <button
                                                        onClick={() => handleQuickStatusUpdate(pickup, 'completed')}
                                                        title="Mark Completed"
                                                        className="p-2 rounded-lg hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 transition-colors"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(pickup)}
                                                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingPickup(pickup)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-zinc-500">
                                        No pickups found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-zinc-800">
                        <p className="text-sm text-zinc-500">
                            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-zinc-400 px-2">{page} / {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            {createPortal(
                <AnimatePresence>
                    {showEditModal && editingPickup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowEditModal(false)}
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
                                        <p className="text-sm text-zinc-500 font-mono">{editingPickup.pickupId}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* User Info */}
                                <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Customer</p>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={editingPickup.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editingPickup.user?.name}`}
                                            alt={editingPickup.user?.name}
                                            className="w-12 h-12 rounded-full bg-zinc-700"
                                        />
                                        <div>
                                            <p className="font-medium text-white">{editingPickup.user?.name}</p>
                                            <p className="text-sm text-zinc-500">{editingPickup.user?.email}</p>
                                            {editingPickup.user?.phone && (
                                                <p className="text-sm text-zinc-500">{editingPickup.user?.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup Details */}
                                <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Pickup Information</p>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">{formatDate(editingPickup.date)}</p>
                                                <p className="text-xs text-zinc-500">Scheduled Date</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">{editingPickup.time}</p>
                                                <p className="text-xs text-zinc-500">Scheduled Time</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">{editingPickup.address}</p>
                                                <p className="text-xs text-zinc-500">Pickup Address</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Weight className="w-4 h-4 text-zinc-500 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-white">{editingPickup.estimatedWeight || 0} kg</p>
                                                <p className="text-xs text-zinc-500">Estimated Weight</p>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-zinc-700">
                                            <p className="text-xs text-zinc-500 mb-1">Waste Type</p>
                                            {getWasteTypeBadge(editingPickup.wasteType)}
                                        </div>
                                        <div className="pt-2 border-t border-zinc-700">
                                            <p className="text-xs text-zinc-500 mb-1">Current Status</p>
                                            {getStatusBadge(editingPickup.status)}
                                        </div>
                                        {editingPickup.notes && (
                                            <div className="pt-2 border-t border-zinc-700">
                                                <p className="text-xs text-zinc-500 mb-1">Customer Notes</p>
                                                <p className="text-sm text-zinc-300">{editingPickup.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                <div className="space-y-4">
                                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Admin Actions</p>
                                    
                                    {/* Quick Status Buttons */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {editingPickup.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => setEditForm({ ...editForm, status: 'in-progress' })}
                                                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                                        editForm.status === 'in-progress' 
                                                            ? 'bg-blue-500 border-blue-500 text-white' 
                                                            : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                                                    }`}
                                                >
                                                    <Truck className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => setEditForm({ ...editForm, status: 'cancelled' })}
                                                    className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                                        editForm.status === 'cancelled' 
                                                            ? 'bg-red-500 border-red-500 text-white' 
                                                            : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                                    }`}
                                                >
                                                    <X className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {editingPickup.status === 'in-progress' && (
                                            <button
                                                onClick={() => setEditForm({ ...editForm, status: 'completed' })}
                                                className={`col-span-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                                    editForm.status === 'completed' 
                                                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                                                        : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                                                }`}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Mark as Completed
                                            </button>
                                        )}
                                    </div>

                                    {/* Admin Notes */}
                                    <div>
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Admin Notes</label>
                                        <textarea
                                            value={editForm.adminNotes}
                                            onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                                            rows={3}
                                            placeholder="Add notes for the customer (visible on their pickup history)..."
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:border-red-400/50 focus:outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                {editForm.status === 'completed' && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mt-4 flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        <div className="text-sm text-emerald-400">
                                            <p className="font-medium">Completing Pickup</p>
                                            <p className="text-emerald-400/70 text-xs mt-1">
                                                Eco points will be awarded based on estimated weight ({editingPickup.estimatedWeight || 0} kg).
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {editForm.status === 'cancelled' && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4 flex items-start gap-3">
                                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        <div className="text-sm text-red-400">
                                            <p className="font-medium">Rejecting Pickup</p>
                                            <p className="text-red-400/70 text-xs mt-1">
                                                Please add a note explaining why the pickup was rejected.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={saving || (editForm.status === editingPickup.status && editForm.adminNotes === (editingPickup.adminNotes || ''))}
                                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {createPortal(
                <AnimatePresence>
                    {deletingPickup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setDeletingPickup(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full text-center"
                            >
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-8 h-8 text-red-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Delete Pickup?</h2>
                                <p className="text-zinc-400 text-sm mb-6">
                                    Are you sure you want to delete pickup <strong className="text-white">{deletingPickup.pickupId}</strong>?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeletingPickup(null)}
                                        className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deletingPickup._id)}
                                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
