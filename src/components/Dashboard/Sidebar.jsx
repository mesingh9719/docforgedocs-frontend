import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    FileText,
    Building2,
    Shield,
    PenTool,
    ScrollText,

    Sparkles
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ business, mobileMenuOpen, setMobileMenuOpen }) => {
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();
    const { can } = usePermissions();
    const { logout } = useAuth();

    const toggleSidebar = () => setCollapsed(!collapsed);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const businessName = business?.name || 'DocForge';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },

        { icon: FileText, label: 'Documents', path: '/documents', permission: 'document.view' },
        { icon: ScrollText, label: 'Signatures', path: '/signatures/list', permission: 'settings.signature' },
        { icon: Users, label: 'Team', path: '/team', permission: 'team.view' },
        { icon: Settings, label: 'Settings', path: '/settings', permission: 'settings.view' },
    ].filter(item => !item.permission || can(item.permission));

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 80 },
        mobileOpen: { x: 0 },
        mobileClosed: { x: -300 }
    };

    return (
        <motion.aside
            initial={isMobile ? "mobileClosed" : "expanded"}
            animate={
                isMobile
                    ? (mobileMenuOpen ? "mobileOpen" : "mobileClosed")
                    : (collapsed ? "collapsed" : "expanded")
            }
            variants={sidebarVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
                no-print bg-slate-900 text-slate-400 flex flex-col justify-between
                z-50 border-r border-slate-800 shadow-2xl
                lg:sticky lg:top-0 fixed top-0 left-0 h-screen overflow-hidden
            `}
        >
            {/* Header */}
            <div className={`p-6 flex items-center h-20 border-b border-slate-800/50 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
                        <Building2 size={20} strokeWidth={2.5} />
                    </div>

                    <AnimatePresence>
                        {(!collapsed || (isMobile && mobileMenuOpen)) && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, width: 0 }}
                                className="whitespace-nowrap"
                            >
                                <span className="font-bold text-lg text-white block leading-none">
                                    {businessName}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1 mt-0.5">
                                    <Sparkles size={10} /> Workspace
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop Collapse */}
                {!isMobile && !collapsed && (
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-none">
                {/* Desktop Expand Button if collapsed */}
                {!isMobile && collapsed && (
                    <button
                        onClick={toggleSidebar}
                        className="w-full flex justify-center p-2 mb-4 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}

                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-3 rounded-xl transition-all group relative overflow-hidden
                             ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                : 'hover:bg-slate-800 hover:text-slate-100'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                                )}

                                <div className={`relative z-10 flex items-center ${collapsed && !isMobile ? 'justify-center w-full' : ''}`}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />

                                    <AnimatePresence>
                                        {(!collapsed || (isMobile && mobileMenuOpen)) && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="ml-3 text-sm font-medium whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Tooltip for collapsed state */}
                                {collapsed && !isMobile && (
                                    <div className="hidden group-hover:block absolute left-full ml-4 px-3 py-2 bg-slate-800 text-xs font-semibold text-white rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 animate-in fade-in slide-in-from-left-2">
                                        {item.label}
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
                <AnimatePresence>
                    {(!collapsed || (isMobile && mobileMenuOpen)) && (
                        null /* 
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="mb-4 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-inner group cursor-pointer hover:border-indigo-500/30 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-white flex items-center gap-1">
                                    <Shield size={12} className="text-emerald-400" /> Pro Plan
                                </span>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">Active</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden mb-2">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            </div>
                            <p className="text-xs text-slate-400">75% of storage used</p>
                        </motion.div>
                        */
                    )}
                </AnimatePresence>

                <button
                    onClick={handleLogout}
                    className={`flex items-center w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700/50
                        ${(collapsed && !isMobile) ? 'justify-center p-3' : 'px-4 py-3'}`}
                    title="Log Out"
                >
                    <LogOut size={20} strokeWidth={2} />
                    <AnimatePresence>
                        {(!collapsed || (isMobile && mobileMenuOpen)) && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                                Log Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
