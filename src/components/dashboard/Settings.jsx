import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Mail, Phone, MapPin, Save, Camera, Loader2, CheckCircle, AlertCircle, X, Upload, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Avatar options using DiceBear API
const avatarStyles = ['avataaars', 'bottts', 'lorelei', 'micah', 'notionists', 'personas', 'pixel-art', 'thumbs'];
const avatarSeeds = ['Felix', 'Luna', 'Max', 'Sophie', 'Leo', 'Bella', 'Oscar', 'Maya', 'Charlie', 'Ruby', 'Milo', 'Lily'];

export default function Settings() {
    const { user, updateProfile, logout } = useAuth();
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || ''
    });
    
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    // Avatar picker state
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('avataaars');
    const [selectedSeed, setSelectedSeed] = useState('Felix');
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [customImage, setCustomImage] = useState(null);
    const [activeTab, setActiveTab] = useState('avatars'); // 'avatars' or 'upload'

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setSuccess('Profile updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('Image size should be less than 2MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarSelect = async () => {
        setAvatarLoading(true);
        
        let newAvatarUrl;
        if (activeTab === 'upload' && customImage) {
            newAvatarUrl = customImage;
        } else {
            newAvatarUrl = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodeURIComponent(selectedSeed)}`;
        }
        
        try {
            const result = await updateProfile({ avatar: newAvatarUrl });
            if (result.success) {
                setSuccess('Avatar updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
                setShowAvatarPicker(false);
                setCustomImage(null);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to update avatar. Please try again.');
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }
        alert('Account deletion is not implemented yet. Please contact support.');
    };

    const handleChangePassword = () => {
        alert('Password change is not implemented yet.');
    };

    const currentAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;
    const previewAvatar = activeTab === 'upload' && customImage 
        ? customImage 
        : `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodeURIComponent(selectedSeed)}`;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-zinc-400">Manage your account preferences</p>
                </div>
            </div>

            {/* Avatar Picker Modal - Using Portal to render at body level */}
            {createPortal(
                <AnimatePresence>
                    {showAvatarPicker && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setShowAvatarPicker(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Choose Your Avatar</h2>
                                    <button
                                        onClick={() => setShowAvatarPicker(false)}
                                        className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Preview */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-primary/30 overflow-hidden">
                                        <img src={previewAvatar} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2 mb-6">
                                    <button
                                        onClick={() => setActiveTab('avatars')}
                                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                            activeTab === 'avatars'
                                                ? 'bg-primary text-black'
                                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        <Image className="w-4 h-4" />
                                        Avatars
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('upload')}
                                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                            activeTab === 'upload'
                                                ? 'bg-primary text-black'
                                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </button>
                                </div>

                                {activeTab === 'avatars' ? (
                                    <>
                                        {/* Style Selection */}
                                        <div className="mb-6">
                                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">Style</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {avatarStyles.map((style) => (
                                                    <button
                                                        key={style}
                                                        onClick={() => setSelectedStyle(style)}
                                                        className={`p-2 rounded-xl border transition-all ${
                                                            selectedStyle === style
                                                                ? 'border-primary bg-primary/10'
                                                                : 'border-zinc-800 hover:border-zinc-700'
                                                        }`}
                                                    >
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/${style}/svg?seed=${selectedSeed}`}
                                                            alt={style}
                                                            className="w-full aspect-square rounded-lg"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Character Selection */}
                                        <div className="mb-6">
                                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 block">Character</label>
                                            <div className="grid grid-cols-6 gap-2">
                                                {avatarSeeds.map((seed) => (
                                                    <button
                                                        key={seed}
                                                        onClick={() => setSelectedSeed(seed)}
                                                        className={`p-1 rounded-xl border transition-all ${
                                                            selectedSeed === seed
                                                                ? 'border-primary bg-primary/10'
                                                                : 'border-zinc-800 hover:border-zinc-700'
                                                        }`}
                                                    >
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${seed}`}
                                                            alt={seed}
                                                            className="w-full aspect-square rounded-lg"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* Upload Section */
                                    <div className="mb-6">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        
                                        {customImage ? (
                                            <div className="space-y-4">
                                                <div className="relative aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden border-2 border-primary/30">
                                                    <img src={customImage} alt="Custom" className="w-full h-full object-cover" />
                                                </div>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium"
                                                >
                                                    Choose Different Image
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full py-12 rounded-xl border-2 border-dashed border-zinc-700 hover:border-primary/50 transition-colors flex flex-col items-center gap-3 text-zinc-400 hover:text-white"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium">Click to upload</p>
                                                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG up to 2MB</p>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowAvatarPicker(false);
                                            setCustomImage(null);
                                        }}
                                        className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAvatarSelect}
                                        disabled={avatarLoading || (activeTab === 'upload' && !customImage)}
                                        className="flex-1 py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {avatarLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Avatar'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

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

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6"
                                >
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        <p className="text-sm text-emerald-400">{success}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6"
                                >
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        <p className="text-sm text-red-400">{error}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSaveProfile}>
                            <div className="flex items-center gap-6 mb-8">
                                <div 
                                    className="relative group cursor-pointer"
                                    onClick={() => setShowAvatarPicker(true)}
                                >
                                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden group-hover:border-primary transition-colors">
                                        <img 
                                            src={currentAvatar} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-zinc-900">
                                        <Camera className="w-4 h-4 text-black" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{user?.name || 'User'}</h3>
                                    <p className="text-zinc-500 text-sm">Eco Warrior • Level {user?.level || 1}</p>
                                    <p className="text-primary text-sm mt-1">{(user?.ecoPoints || 0).toLocaleString()} Eco Points</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors disabled:opacity-50" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors disabled:opacity-50" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            disabled={isLoading}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors placeholder-zinc-700 disabled:opacity-50" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input 
                                            type="text" 
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="City, State"
                                            disabled={isLoading}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-colors placeholder-zinc-700 disabled:opacity-50" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
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
                        <button 
                            onClick={handleChangePassword}
                            className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors text-sm font-medium mb-3"
                        >
                            Change Password
                        </button>
                        <button 
                            onClick={handleDeleteAccount}
                            className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                        >
                            Delete Account
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h2 className="text-lg font-bold text-white mb-4">Session</h2>
                        <button 
                            onClick={() => {
                                logout();
                                window.location.href = '/';
                            }}
                            className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
                        >
                            Sign Out
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
