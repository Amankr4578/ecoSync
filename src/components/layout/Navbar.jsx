import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationsDropdown from '../ui/NotificationsDropdown';

// Import auth hook conditionally to prevent errors on non-dashboard pages
let useAuth;
try {
    useAuth = require('../../context/AuthContext').useAuth;
} catch (e) {
    useAuth = () => ({ user: null, logout: () => {}, isAuthenticated: false });
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const isAdminDashboard = location.pathname.startsWith('/admin');
    const isAnyDashboard = isDashboard || isAdminDashboard;
    const isLoginPage = location.pathname === '/login';

    // Only use auth context in dashboard
    let auth = { user: null, logout: () => {}, isAuthenticated: false };
    try {
        if (isAnyDashboard) {
            auth = useAuth();
        }
    } catch (e) {
        // Auth context not available
    }

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollTo = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    const handleLogout = () => {
        auth.logout();
        navigate('/');
    };

    const dashboardLinks = [
        { label: 'Overview', path: '/dashboard' },
        { label: 'Schedule', path: '/dashboard/schedule' },
        { label: 'History', path: '/dashboard/history' },
        { label: 'Settings', path: '/dashboard/settings' },
    ];

    const adminLinks = [
        { label: 'Overview', path: '/admin/overview' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Pickups', path: '/admin/pickups' },
        { label: 'Homepage', path: '/admin/homepage' },
        { label: 'Settings', path: '/admin/settings' },
    ];

    // Animation Variants
    const navVariants = {
        initial: {
            width: isLoginPage ? '600px' : '100%',
            maxWidth: isLoginPage ? '600px' : '1280px',
            backgroundColor: 'rgba(24, 24, 27, 0)',
            borderColor: 'rgba(255, 255, 255, 0)',
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)'
        },
        animate: {
            width: isLoginPage ? '600px' : '100%',
            maxWidth: isLoginPage
                ? '600px'
                : isAnyDashboard
                    ? '1024px'
                    : scrolled
                        ? '1024px'
                        : '1280px',
            backgroundColor: (scrolled || isAnyDashboard || isLoginPage)
                ? 'rgba(24, 24, 27, 0.8)'
                : 'rgba(24, 24, 27, 0)',
            borderColor: (scrolled || isAnyDashboard || isLoginPage)
                ? 'rgba(39, 39, 42, 1)'
                : 'rgba(255, 255, 255, 0)',
            boxShadow: (scrolled || isAnyDashboard || isLoginPage)
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                : '0 0 0 0 rgba(0, 0, 0, 0)',
            backdropFilter: (scrolled || isAnyDashboard || isLoginPage) ? 'blur(12px)' : 'blur(0px)',
            transition: {
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none`}
            >
                <motion.div
                    variants={navVariants}
                    initial="initial"
                    animate="animate"
                    className="pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full border"
                >

                    {/* Logo */}
                    <Link to={isAdminDashboard ? "/admin" : isDashboard ? "/dashboard" : "/"} className="flex items-center gap-2 group cursor-pointer min-w-fit">
                        <div className={`relative w-8 h-8 flex items-center justify-center bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden transition-colors ${isAdminDashboard ? 'group-hover:border-red-400' : 'group-hover:border-primary'}`}>
                            <div className={`absolute inset-0 blur-md opacity-0 group-hover:opacity-100 transition-opacity ${isAdminDashboard ? 'bg-red-400/20' : 'bg-primary/20'}`} />
                            <div className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-[spin_3s_linear_infinite] ${isAdminDashboard ? 'border-red-400' : 'border-primary'}`} />
                            <div className={`absolute w-2 h-2 rounded-full ${isAdminDashboard ? 'bg-red-400' : 'bg-primary'}`} />
                        </div>
                        <span className={`font-bold tracking-tight text-lg text-white transition-colors ${isAdminDashboard ? 'group-hover:text-red-400' : 'group-hover:text-primary'}`}>
                            {isAdminDashboard ? 'ecoSync Admin' : 'ecoSync'}
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 whitespace-nowrap">
                        {isAdminDashboard ? (
                            <>
                                {adminLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-white' : 'text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="w-px h-4 bg-zinc-800" />
                                <div className="flex items-center gap-3">
                                    <NotificationsDropdown isAdmin={true} />
                                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-red-400/30 overflow-hidden">
                                        {auth.user?.avatar ? (
                                            <img src={auth.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : isDashboard ? (
                            <>
                                {dashboardLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-white' : 'text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="w-px h-4 bg-zinc-800" />
                                <div className="flex items-center gap-3">
                                    <NotificationsDropdown isAdmin={false} />
                                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700 overflow-hidden">
                                        {auth.user?.avatar ? (
                                            <img src={auth.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-4 h-4 text-zinc-400" />
                                        )}
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : isLoginPage ? (
                            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Link>
                        ) : (
                            <>
                                <button onClick={() => handleScrollTo('mission')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Mission</button>
                                <Link to="/guide" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Guide</Link>
                                <button onClick={() => handleScrollTo('impact')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Impact</button>
                                <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link to="/login" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </motion.div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center space-y-8"
                    >
                        <button
                            className="absolute top-8 right-8 text-zinc-500 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {isDashboard ? (
                            <>
                                {dashboardLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-3xl font-bold transition-colors ${location.pathname === link.path ? 'text-white' : 'text-zinc-500 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <button 
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-xl font-bold text-red-500 hover:text-red-400 transition-colors mt-8"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleScrollTo('mission')} className="text-3xl font-bold text-white hover:text-primary transition-colors">Mission</button>
                                <Link to="/guide" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">Guide</Link>
                                <button onClick={() => handleScrollTo('impact')} className="text-3xl font-bold text-white hover:text-primary transition-colors">Impact</button>
                                {!isLoginPage && (
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">
                                        Login
                                    </Link>
                                )}
                                {isLoginPage && (
                                    <Link to="/" onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white hover:text-primary transition-colors">
                                        Back to Home
                                    </Link>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
