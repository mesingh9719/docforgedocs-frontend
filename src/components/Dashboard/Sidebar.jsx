import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    FileText,
    Building2,
    Shield
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ business, mobileMenuOpen, setMobileMenuOpen }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { can } = usePermissions();
    const { setToken } = useAuth(); // Ensure context is used if needed, or just token removal

    const toggleSidebar = () => setCollapsed(!collapsed);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setToken(null);
            navigate('/');
        }
    };

    const businessName = business?.name || 'DocForge';

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: FileText, label: 'Documents', path: '/documents', permission: 'document.view' },
        { icon: Users, label: 'Team', path: '/team', permission: 'team.view' },
        { icon: Settings, label: 'Settings', path: '/settings', permission: 'settings.manage' },
    ].filter(item => !item.permission || can(item.permission));

    return (
        <motion.aside
            initial={false}
            animate={
                window.innerWidth < 1024
                    ? { x: mobileMenuOpen ? 0 : -300, position: 'fixed', height: '100%' }
                    : { width: collapsed ? 80 : 280, x: 0, position: 'sticky' } // Slightly wider for premium feel
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} // Custom easing
            className={`
                no-print
                h-screen bg-[#0F172A] text-slate-400 flex flex-col justify-between z-50 border-r border-slate-800 shadow-2xl
                lg:sticky lg:top-0 fixed top-0 left-0
                ${mobileMenuOpen ? 'w-[280px]' : ''}
            `}
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between h-20 border-b border-slate-800/80">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                        <Building2 size={18} strokeWidth={2.5} />
                    </div>
                    {(!collapsed || mobileMenuOpen) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col"
                        >
                            <span className="font-bold text-lg text-white tracking-tight leading-none">
                                {businessName}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mt-1">
                                Workspace
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Only show collapse toggle on Desktop */}
                <button
                    onClick={toggleSidebar}
                    className={`
                        p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all hidden lg:block
                        ${collapsed ? 'mx-auto' : ''}
                    `}
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                {/* Close button for Mobile */}
                <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all lg:hidden"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                        className={({ isActive }) => `
                            flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative mb-1
                            ${isActive
                                ? 'bg-indigo-600/10 text-white'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                                    />
                                )}

                                <div className={`flex items-center justify-center relative z-10 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                {(!collapsed || mobileMenuOpen) && (
                                    <span className={`ml-4 text-sm font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                                        {item.label}
                                    </span>
                                )}

                                {/* Collapsed Tooltip (Desktop Only) */}
                                {collapsed && !mobileMenuOpen && (
                                    <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl translate-x-[-10px] group-hover:translate-x-0">
                                        {item.label}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                                    </div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
                {/* Enterprise Badge */}
                {(!collapsed || mobileMenuOpen) && (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700/50 relative overflow-hidden group cursor-pointer hover:border-indigo-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <Shield className="w-12 h-12 text-slate-700 -rotate-12 group-hover:text-indigo-500/10 transition-colors" />
                        </div>
                        <p className="text-xs font-bold text-slate-300 relative z-10">Pro Plan</p>
                        <p className="text-[10px] text-slate-500 mt-1 relative z-10 group-hover:text-indigo-400 transition-colors">Manage team access</p>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center rounded-xl transition-all duration-200 group w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10
                        ${collapsed && !mobileMenuOpen ? 'justify-center p-3' : 'px-4 py-3'}
                    `}
                >
                    <LogOut size={20} />
                    {(!collapsed || mobileMenuOpen) && (
                        <span className="ml-3 text-sm font-medium">Log Out</span>
                    )}
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
