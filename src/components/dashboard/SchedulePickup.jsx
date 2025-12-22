import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Weight, FileText, ArrowRight, Truck, Leaf, Recycle, Zap, Trash2, CheckCircle, Loader2, AlertCircle, Navigation, Map } from 'lucide-react';
import { pickupsAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import MapLocationPicker from '../ui/MapLocationPicker';

export default function SchedulePickup() {
    const { user, refreshUser } = useAuth();
    const [wasteType, setWasteType] = useState('recyclable');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState(user?.location || '');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [showMapPicker, setShowMapPicker] = useState(false);

    // Fetch current location using browser geolocation (with improved settings)
    const fetchCurrentLocation = async () => {
        setFetchingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setFetchingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Use OpenStreetMap Nominatim for reverse geocoding (free, no API key needed)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await response.json();
                    
                    if (data.display_name) {
                        // Format a cleaner address
                        const addr = data.address;
                        const formattedAddress = [
                            addr.house_number,
                            addr.road,
                            addr.suburb || addr.neighbourhood,
                            addr.city || addr.town || addr.village,
                            addr.state,
                            addr.postcode
                        ].filter(Boolean).join(', ');
                        
                        setAddress(formattedAddress || data.display_name);
                    } else {
                        // Fallback to coordinates if no address found
                        setAddress(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
                    }
                } catch (err) {
                    console.error('Geocoding error:', err);
                    setLocationError('Could not fetch address. Please enter manually.');
                } finally {
                    setFetchingLocation(false);
                }
            },
            (err) => {
                console.error('Geolocation error:', err);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setLocationError('Location access denied. Please enable location in browser settings.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setLocationError('Location unavailable. Please enter address manually.');
                        break;
                    case err.TIMEOUT:
                        setLocationError('Location timed out. Try again or enter address manually.');
                        break;
                    default:
                        setLocationError('Unable to get location. Please enter manually.');
                }
                setFetchingLocation(false);
            },
            { 
                enableHighAccuracy: false, // Use low accuracy for faster response
                timeout: 15000, // Increased timeout
                maximumAge: 60000 // Accept cached position up to 1 minute old
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await pickupsAPI.create({
                wasteType,
                date,
                time,
                address,
                estimatedWeight: weight,
                notes
            });
            
            setSuccess(true);
            // Reset form
            setDate('');
            setTime('');
            setWeight('');
            setNotes('');
            
            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
            
            // Refresh user stats
            refreshUser();
        } catch (err) {
            console.error('Failed to create pickup:', err);
            setError(err.response?.data?.message || 'Failed to schedule pickup. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const wasteTypes = [
        { id: 'recyclable', label: 'Recyclable', icon: Recycle, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { id: 'organic', label: 'Organic', icon: Leaf, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
        { id: 'ewaste', label: 'E-Waste', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
        { id: 'hazardous', label: 'Hazardous', icon: Trash2, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
    ];

    // Get tomorrow's date as minimum
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Schedule Pickup</h1>
                    <p className="text-zinc-400">Request a waste collection service</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-6 rounded-3xl"
                    >
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
                                        <div>
                                            <p className="text-sm text-emerald-400 font-medium">Pickup Scheduled Successfully!</p>
                                            <p className="text-xs text-emerald-400/70 mt-1">You'll receive a confirmation email shortly.</p>
                                        </div>
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

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Waste Type Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Waste Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {wasteTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setWasteType(type.id)}
                                            disabled={isLoading}
                                            className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 disabled:opacity-50 ${wasteType === type.id
                                                    ? `${type.bg} ${type.border} ring-1 ring-inset ring-white/10`
                                                    : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'
                                                }`}
                                        >
                                            <type.icon className={`w-6 h-6 ${wasteType === type.id ? type.color : 'text-zinc-500'}`} />
                                            <span className={`text-sm font-medium ${wasteType === type.id ? 'text-white' : 'text-zinc-500'}`}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            min={minDate}
                                            required
                                            disabled={isLoading}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700 disabled:opacity-50 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Time</label>
                                    <div className="relative group">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700 disabled:opacity-50 [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Weight */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Estimated Weight (kg)</label>
                                <div className="relative group">
                                    <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="e.g. 5"
                                        min="0.1"
                                        step="0.1"
                                        disabled={isLoading}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Pickup Address</label>
                                </div>
                                
                                {/* Location Selection Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowMapPicker(true)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                                    >
                                        <Map className="w-4 h-4" />
                                        Select from Map
                                    </button>
                                    <button
                                        type="button"
                                        onClick={fetchCurrentLocation}
                                        disabled={fetchingLocation || isLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            fetchingLocation 
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                                : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
                                        } disabled:opacity-50`}
                                    >
                                        {fetchingLocation ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Finding...
                                            </>
                                        ) : (
                                            <>
                                                <Navigation className="w-4 h-4" />
                                                Use GPS
                                            </>
                                        )}
                                    </button>
                                </div>

                                {locationError && (
                                    <div className="text-xs text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        {locationError}
                                    </div>
                                )}
                                
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your full pickup address or select from map..."
                                        rows={2}
                                        required
                                        disabled={isLoading || fetchingLocation}
                                        className={`w-full bg-black/40 border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700 resize-none disabled:opacity-50 ${fetchingLocation ? 'border-primary/50 animate-pulse' : 'border-zinc-800'}`}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Additional Notes (Optional)</label>
                                <div className="relative group">
                                    <FileText className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any special instructions..."
                                        rows={2}
                                        disabled={isLoading}
                                        className="w-full bg-black/40 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder-zinc-700 resize-none disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Scheduling...
                                    </>
                                ) : (
                                    <>
                                        Confirm Pickup Request
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                        </form>
                    </motion.div>
                </div>

                {/* Info / Summary Card */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Standard Pickup</h3>
                                <p className="text-xs text-emerald-400/80">Available 9 AM - 6 PM</p>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Our team will arrive within a 2-hour window of your scheduled time. Please ensure waste is properly segregated.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-3xl"
                    >
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-500" />
                            Guidelines
                        </h3>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5" />
                                Separate recyclables from organic waste.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5" />
                                Ensure hazardous materials are sealed.
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5" />
                                Max weight per bag: 15kg.
                            </li>
                        </ul>
                    </motion.div>

                    {/* Eco Points Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl"
                    >
                        <h3 className="font-bold text-white mb-2">Earn Eco Points!</h3>
                        <p className="text-sm text-zinc-400 mb-4">
                            Points are awarded based on waste type and weight:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Recycle className="w-4 h-4" />
                                10 pts/kg
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <Leaf className="w-4 h-4" />
                                5 pts/kg
                            </div>
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Zap className="w-4 h-4" />
                                20 pts/kg
                            </div>
                            <div className="flex items-center gap-2 text-red-400">
                                <Trash2 className="w-4 h-4" />
                                15 pts/kg
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>

        {/* Map Location Picker Modal */}
        <MapLocationPicker
            isOpen={showMapPicker}
            onClose={() => setShowMapPicker(false)}
            onSelectLocation={(selectedAddress) => setAddress(selectedAddress)}
            initialAddress={address}
        />
    </>
    );
}
