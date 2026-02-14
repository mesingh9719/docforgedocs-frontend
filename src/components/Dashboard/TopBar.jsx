import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, Settings, LogOut, CheckCircle, AlertCircle, FileText, ChevronDown, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/notifications';

const TopBar = ({ business, onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Refs for click outside
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            // Backend returns { data: [], unread_count: 0 }
            const raw = response.data.data;
            const formatted = raw.map(n => ({
                id: n.id,
                type: n.data.type || 'info',
                title: n.data.title || 'Notification',
                message: n.data.message || '',
                time: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Just now',
                read: !!n.read_at,
                raw_created_at: n.created_at
            }));
            setNotifications(formatted);
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

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
        <header className="no-print px-6 py-4 flex items-center justify-between sticky top-0 z-40 glass border-b border-indigo-50/50 shadow-sm transition-all duration-300">
            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className={`${isSearchOpen ? 'hidden md:block' : 'block'}`}>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Dashboard
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Beta
                        </span>
                    </h1>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* Search */}
                <div className="relative group" ref={searchRef}>
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                    >
                        <Search size={20} />
                    </button>

                    <div className={`${isSearchOpen ? 'absolute right-0 top-1/2 -translate-y-1/2 w-[calc(100vw-80px)] md:w-auto bg-white z-50 shadow-xl rounded-xl' : 'hidden md:block relative'}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Search size={16} strokeWidth={2.5} />
                        </div>
                        <input
                            type="text"
                            autoFocus={isSearchOpen}
                            placeholder="Type to search..."
                            className="pl-10 pr-12 py-2.5 bg-slate-100/50 border border-transparent rounded-xl text-sm w-full md:w-72 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 text-slate-700 hover:bg-slate-100 outline-none"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-sans font-medium text-slate-500 shadow-sm">
                                <Command size={10} /> K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <motion.button
                        autoFocus={false}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        className={`relative p-2.5 rounded-xl transition-all ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
                    >
                        <Bell size={20} strokeWidth={2} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
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
                                transition={{ type: "spring", duration: 0.3 }}
                                className="absolute right-0 mt-4 w-[90vw] sm:w-[400px] bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden z-50 origin-top-right -mr-12 sm:mr-0"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
                                    <div>
                                        <h3 className="font-bold text-slate-800">Notifications</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">You have {unreadCount} unread messages</p>
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                    {notifications.length === 0 ? (
                                        <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                                            <Bell size={32} className="mb-3 opacity-20" />
                                            <p className="text-sm font-medium">All caught up!</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-50">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => handleMarkRead(notification.id)}
                                                    className={`p-4 hover:bg-slate-50 transition-all cursor-pointer group relative ${!notification.read ? 'bg-indigo-50/20' : ''}`}
                                                >
                                                    {!notification.read && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full" />
                                                    )}
                                                    <div className="flex gap-4">
                                                        <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${!notification.read ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            <FileText size={18} strokeWidth={2} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <p className={`text-sm font-semibold truncate pr-2 ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                                    {notification.title}
                                                                </p>
                                                                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                                    {notification.time}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-500 leading-snug line-clamp-2 mix-blend-multiply">
                                                                {notification.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-slate-50/50 text-center border-t border-slate-100">
                                    <button className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 w-full py-1">
                                        View All Activity <ChevronDown size={12} />
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
                        className={`flex items-center gap-3 p-1 rounded-xl transition-all border ${isProfileOpen ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-50/50' : 'border-transparent hover:bg-slate-50'
                            }`}
                    >
                        <div className="text-right hidden md:block pr-1">
                            <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'User'}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">{user?.role || 'Member'}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
                            <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <span className="font-bold text-sm bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden z-50 origin-top-right"
                            >
                                <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                                            <p className="text-xs text-slate-500 font-medium truncate max-w-[140px]">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wide">
                                            Pro Plan
                                        </span> */}
                                    </div>
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors group">
                                        <User size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        My Profile
                                    </Link>
                                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors group">
                                        <Settings size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        Settings
                                    </Link>
                                </div>
                                <div className="p-2 border-t border-slate-50 mt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                                    >
                                        <LogOut size={18} className="text-red-500 group-hover:text-red-600 transition-colors" />
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
