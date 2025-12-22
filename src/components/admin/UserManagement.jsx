import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Edit2, Trash2, X, Loader2, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin, Award, Shield, Users, UserCog } from 'lucide-react';
import { adminAPI } from '../../api/axios';
import { createPortal } from 'react-dom';
import StyledSelect from '../ui/StyledSelect';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    
    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    
    // Delete confirmation
    const [deletingUser, setDeletingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [page, search, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUsers({
                page,
                limit: 10,
                search,
                role: roleFilter
            });
            setUsers(response.data.users);
            setTotalPages(response.data.pages);
            setTotal(response.data.total);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            location: user.location || '',
            role: user.role,
            ecoPoints: user.ecoPoints || 0,
            level: user.level || 1
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        setSaving(true);
        try {
            await adminAPI.updateUser(editingUser._id, editForm);
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            console.error('Failed to update user:', err);
            alert('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await adminAPI.deleteUser(userId);
            setDeletingUser(null);
            fetchUsers();
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20">Admin</span>;
        }
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-400/10 text-zinc-400 border border-zinc-400/20">User</span>;
    };

    const roleOptions = [
        { value: '', label: 'All Roles', icon: Users },
        { value: 'user', label: 'Users', icon: User },
        { value: 'admin', label: 'Admins', icon: UserCog }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-zinc-400">{total} total users</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={handleSearch}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-red-400/50 focus:outline-none focus:ring-2 focus:ring-red-400/10 w-64 transition-all"
                        />
                    </div>
                    <StyledSelect
                        value={roleFilter}
                        onChange={(val) => { setRoleFilter(val); setPage(1); }}
                        options={roleOptions}
                        placeholder="All Roles"
                        icon={Shield}
                        className="w-40"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Role</th>
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Stats</th>
                                <th className="text-left p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Joined</th>
                                <th className="text-right p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-zinc-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full bg-zinc-800"
                                                />
                                                <div>
                                                    <p className="font-medium text-white">{user.name}</p>
                                                    <p className="text-sm text-zinc-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{getRoleBadge(user.role)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{user.ecoPoints || 0} pts</p>
                                                    <p className="text-xs text-zinc-500">Level {user.level || 1}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-zinc-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingUser(user)}
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
                                    <td colSpan="5" className="p-8 text-center text-zinc-500">
                                        No users found
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

            {/* Edit Modal */}
            {createPortal(
                <AnimatePresence>
                    {showEditModal && editingUser && (
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
                                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Edit User</h2>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-red-400/50 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-red-400/50 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="tel"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-red-400/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    value={editForm.location}
                                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-red-400/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <select
                                                value={editForm.role}
                                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-red-400/50 focus:outline-none appearance-none"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Eco Points</label>
                                            <div className="relative">
                                                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input
                                                    type="number"
                                                    value={editForm.ecoPoints}
                                                    onChange={(e) => setEditForm({ ...editForm, ecoPoints: parseInt(e.target.value) || 0 })}
                                                    className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-red-400/50 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">Level</label>
                                            <input
                                                type="number"
                                                value={editForm.level}
                                                onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) || 1 })}
                                                min="1"
                                                className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:border-red-400/50 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={saving}
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
                    {deletingUser && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setDeletingUser(null)}
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
                                <h2 className="text-xl font-bold text-white mb-2">Delete User?</h2>
                                <p className="text-zinc-400 text-sm mb-6">
                                    Are you sure you want to delete <strong className="text-white">{deletingUser.name}</strong>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeletingUser(null)}
                                        className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deletingUser._id)}
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
