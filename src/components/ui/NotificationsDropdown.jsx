import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, X, Loader2, PackageCheck, PackageX, Package, Info } from 'lucide-react';
import { notificationsAPI } from '../../api/axios';
import { Link } from 'react-router-dom';

export default function NotificationsDropdown({ isAdmin = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationsAPI.getAll({ limit: 20 });
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when dropdown opens
    useEffect(() => {
        fetchNotifications();
        // Refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev => 
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await notificationsAPI.delete(id);
            const wasUnread = notifications.find(n => n._id === id && !n.read);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'pickup_accepted':
                return <Package className="w-4 h-4 text-blue-400" />;
            case 'pickup_completed':
                return <PackageCheck className="w-4 h-4 text-emerald-400" />;
            case 'pickup_rejected':
                return <PackageX className="w-4 h-4 text-red-400" />;
            default:
                return <Info className="w-4 h-4 text-zinc-400" />;
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const accentColor = isAdmin ? 'red' : 'primary';

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full transition-colors ${
                    isOpen 
                        ? `bg-${accentColor === 'red' ? 'red-500/20' : 'primary/20'} text-${accentColor === 'red' ? 'red-400' : 'primary'}` 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 ${isAdmin ? 'bg-red-500' : 'bg-primary'} text-white text-xs font-bold rounded-full flex items-center justify-center`}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl shadow-black/20 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className={`text-xs font-medium ${isAdmin ? 'text-red-400 hover:text-red-300' : 'text-primary hover:text-primary/80'} transition-colors flex items-center gap-1`}
                                    >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
                                </div>
                            ) : notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`group flex items-start gap-3 px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors ${
                                            !notification.read ? (isAdmin ? 'bg-red-500/5' : 'bg-primary/5') : ''
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            !notification.read ? (isAdmin ? 'bg-red-500/20' : 'bg-primary/20') : 'bg-zinc-800'
                                        }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-zinc-400'}`}>
                                                    {notification.title}
                                                </p>
                                                <span className="text-xs text-zinc-500 flex-shrink-0">
                                                    {formatTime(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            {notification.link && (
                                                <Link
                                                    to={notification.link}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`text-xs ${isAdmin ? 'text-red-400 hover:text-red-300' : 'text-primary hover:text-primary/80'} mt-1 inline-block`}
                                                >
                                                    View details →
                                                </Link>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.read && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                    className="p-1.5 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(notification._id, e)}
                                                className="p-1.5 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                                        <Bell className="w-6 h-6 text-zinc-600" />
                                    </div>
                                    <p className="text-sm text-zinc-500">No notifications yet</p>
                                    <p className="text-xs text-zinc-600 mt-1">We'll notify you when something happens</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
