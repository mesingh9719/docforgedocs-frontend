import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, Settings, LogOut, CheckCircle, AlertCircle, FileText, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const TopBar = ({ business, user, onMenuClick }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Refs for click outside
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Mock Notifications
    const notifications = [
        { id: 1, type: 'success', title: 'Document Signed', message: 'NDA-2024-001 has been signed by John.', time: '2 min ago', read: false },
        { id: 2, type: 'alert', title: 'Subscription Update', message: 'Your trial expires in 3 days.', time: '1 hour ago', read: false },
        { id: 3, type: 'info', title: 'New Feature', message: 'Check out the new Template Editor!', time: '1 day ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    // ... (rest of code)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="no-print px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm transition-all duration-300">
            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className={`${isSearchOpen ? 'hidden md:block' : 'block'}`}>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5 hidden sm:block">
                        Overview of your {business?.name || 'Workspace'}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Search */}
                <div className="relative group" ref={searchRef}>
                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                    >
                        <Search size={20} />
                    </button>

                    {/* Desktop Search / Mobile Overlay */}
                    <div className={`${isSearchOpen ? 'absolute right-0 top-1/2 -translate-y-1/2 w-[calc(100vw-80px)] md:w-auto bg-white z-50' : 'hidden md:block relative'}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            autoFocus={isSearchOpen}
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 text-slate-700 hover:border-slate-300 shadow-sm md:shadow-none"
                        />
                    </div>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`relative p-2 rounded-lg transition-all ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-white"></span>
                            </span>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {isNotificationsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-[85vw] sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 origin-top-right right-[-60px] sm:right-0"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                                    notification.type === 'alert' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {notification.type === 'success' ? <CheckCircle size={14} /> :
                                                        notification.type === 'alert' ? <AlertCircle size={14} /> :
                                                            <FileText size={14} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="mt-2 h-2 w-2 rounded-full bg-indigo-500 shrink-0"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                                    <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                                        View All Activity
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile */}
                <div className="relative pl-2" ref={profileRef}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center gap-3 p-1.5 rounded-xl transition-all border ${isProfileOpen ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-50' : 'border-transparent hover:bg-slate-50'
                            }`}
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name || 'User'}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider trancate max-w-[100px]">{user?.role || 'Member'}</p>
                        </div>
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <span className="font-bold text-sm">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-4 border-b border-slate-100 md:hidden bg-slate-50">
                                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group">
                                        <User size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        My Profile
                                    </Link>
                                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group">
                                        <Settings size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        Settings
                                    </Link>
                                </div>
                                <div className="p-2 border-t border-slate-100 mt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                                    >
                                        <LogOut size={16} className="text-red-500 group-hover:text-red-600 transition-colors" />
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
