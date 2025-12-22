import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Mail, Lock, ArrowRight, Leaf, Recycle, User, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [authMode, setAuthMode] = useState('signin'); // 'signin', 'signup', 'forgot'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    // Get the redirect path from location state, or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    // Mouse Spotlight Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

    function handleCardMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
        rotateX.set(yPct * -10);
        rotateY.set(xPct * 10);
    }

    function handleCardMouseLeave() {
        x.set(0);
        y.set(0);
        rotateX.set(0);
        rotateY.set(0);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsLoading(true);

        try {
            if (authMode === 'forgot') {
                // TODO: Implement forgot password
                console.log('Reset password for:', email);
                setFormError('Password reset is not implemented yet. Please contact support.');
                setIsLoading(false);
                return;
            }

            let result;
            if (authMode === 'signup') {
                result = await register(name, email, password);
            } else {
                result = await login(email, password);
            }

            if (result.success) {
                // Redirect based on user role
                if (result.user?.role === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setFormError(result.error);
            }
        } catch (err) {
            setFormError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const titles = {
        signin: { title: 'Welcome Back', subtitle: 'Access your EcoSync control center' },
        signup: { title: 'Join EcoSync', subtitle: 'Start your waste management journey' },
        forgot: { title: 'Reset Password', subtitle: 'We will send you a recovery link' }
    };

    const switchMode = (mode) => {
        setAuthMode(mode);
        setFormError('');
    };

    return (
        <div
            className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden group"
            onMouseMove={handleMouseMove}
        >
            <Navbar />

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                {/* Mouse Spotlight */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                650px circle at ${mouseX}px ${mouseY}px,
                                rgba(16, 185, 129, 0.15),
                                transparent 80%
                            )
                        `,
                    }}
                />

                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-[15%] text-primary/10"
                >
                    <Leaf className="w-48 h-48" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-[15%] text-zinc-800"
                >
                    <Recycle className="w-64 h-64" />
                </motion.div>
            </div>

            {/* Auth Card */}
            <div className="flex-1 flex items-center justify-center p-4 relative z-10 pt-32">
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    className="w-full max-w-md perspective-1000"
                >
                    <motion.div
                        layout
                        className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
                        style={{ transform: "translateZ(20px)" }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="text-center mb-8">
                            <motion.div
                                layoutId="logo"
                                className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-zinc-800/50 rounded-2xl border border-zinc-700/50"
                            >
                                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-50" />
                                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-[spin_3s_linear_infinite]" />
                                <div className="absolute w-3 h-3 bg-primary rounded-full" />
                            </motion.div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={authMode}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h1 className="text-3xl font-bold mb-2 tracking-tight">{titles[authMode].title}</h1>
                                    <p className="text-zinc-400">{titles[authMode].subtitle}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {formError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ 
                                        opacity: 1, 
                                        height: 'auto', 
                                        y: 0,
                                        x: [0, -10, 10, -10, 10, 0]
                                    }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    transition={{ 
                                        duration: 0.3,
                                        x: { duration: 0.4, ease: "easeInOut" }
                                    }}
                                    className="mb-4"
                                >
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
                                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 relative">
                                            <AlertCircle className="w-4 h-4 text-red-400" />
                                        </div>
                                        <div className="flex-1 relative">
                                            <p className="text-sm font-medium text-red-400">{formError}</p>
                                            <p className="text-xs text-red-400/60 mt-1">
                                                {authMode === 'signin' && formError.includes('password') && 
                                                    'Forgot your password? Contact support to reset it.'}
                                                {authMode === 'signin' && formError.includes('No account') && 
                                                    <button 
                                                        type="button"
                                                        onClick={() => switchMode('signup')}
                                                        className="text-red-400 underline hover:text-red-300"
                                                    >
                                                        Create a new account
                                                    </button>
                                                }
                                                {authMode === 'signup' && formError.includes('already exists') && 
                                                    <button 
                                                        type="button"
                                                        onClick={() => switchMode('signin')}
                                                        className="text-red-400 underline hover:text-red-300"
                                                    >
                                                        Sign in instead
                                                    </button>
                                                }
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormError('')}
                                            className="w-6 h-6 rounded-full hover:bg-red-500/20 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0 relative"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="popLayout">
                                {authMode === 'signup' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-lg py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-zinc-700 text-white [color-scheme:dark]"
                                                placeholder="John Doe"
                                                required={authMode === 'signup'}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div layout className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/40 border border-zinc-800 rounded-lg py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-zinc-700 text-white [color-scheme:dark]"
                                            placeholder="name@company.com"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </motion.div>

                                {authMode !== 'forgot' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">Password</label>
                                            {authMode === 'signin' && (
                                                <button
                                                    type="button"
                                                    onClick={() => switchMode('forgot')}
                                                    className="text-xs text-primary hover:text-emerald-300 transition-colors"
                                                    disabled={isLoading}
                                                >
                                                    Forgot Password?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-black/40 border border-zinc-800 rounded-lg py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-zinc-700 text-white [color-scheme:dark]"
                                                placeholder="••••••••"
                                                required={authMode !== 'forgot'}
                                                minLength={6}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                layout
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {authMode === 'signin' ? 'Signing In...' : authMode === 'signup' ? 'Creating Account...' : 'Sending...'}
                                    </>
                                ) : (
                                    <>
                                        {authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Recovery Link'}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <motion.div layout className="mt-8 text-center text-xs text-zinc-500 flex flex-col gap-2">
                            {authMode === 'signin' ? (
                                <p>
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={() => switchMode('signup')} 
                                        className="text-primary hover:text-emerald-300 transition-colors font-medium"
                                        disabled={isLoading}
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            ) : (
                                <button 
                                    onClick={() => switchMode('signin')} 
                                    className="text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                                    disabled={isLoading}
                                >
                                    Back to Sign In
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
